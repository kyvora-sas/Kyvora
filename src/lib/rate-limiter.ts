import { isIP } from "net";
import { getOrCreatePool } from "./transactions-store";

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  ttlSeconds: number;
}

// Almacén en memoria de respaldo para desarrollo local sin PostgreSQL o ejecución de tests
interface MemoryLimitEntry {
  count: number;
  resetAt: number;
}
const memoryStore = new Map<string, MemoryLimitEntry>();

let isTableInitialized = false;

async function ensureRateLimitsTable(): Promise<void> {
  if (isTableInitialized) return;
  try {
    const pool = getOrCreatePool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.rate_limits (
        key VARCHAR(120) PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 1,
        reset_at TIMESTAMPTZ NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at 
        ON public.rate_limits (reset_at);
    `);
    isTableInitialized = true;
  } catch (err) {
    // Si la inicialización falla temporalmente, se registrará en el primer intento
    console.warn("[rate-limiter] Aviso al verificar tabla rate_limits:", (err as Error)?.message);
  }
}

/**
 * Controla la tasa de solicitudes (Rate Limiting) de forma compartida entre instancias
 * serverless de Vercel utilizando PostgreSQL (Neon).
 * 
 * En ausencia de base de datos relacional (desarrollo local o pruebas unitarias),
 * utiliza un almacén en memoria con ventana deslizante.
 *
 * @param key Identificador único del recurso y sujeto (ej. "donate:create:190.25.1.2")
 * @param maxRequests Máximo número de solicitudes permitidas en la ventana
 * @param windowSeconds Duración de la ventana en segundos
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const hasPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

  if (hasPostgres) {
    try {
      await ensureRateLimitsTable();
      const pool = getOrCreatePool();

      const query = `
        INSERT INTO public.rate_limits (key, count, reset_at)
        VALUES ($1, 1, NOW() + ($2 || ' seconds')::INTERVAL)
        ON CONFLICT (key) DO UPDATE
        SET count = CASE 
              WHEN public.rate_limits.reset_at < NOW() THEN 1 
              ELSE public.rate_limits.count + 1 
            END,
            reset_at = CASE 
              WHEN public.rate_limits.reset_at < NOW() THEN NOW() + ($2 || ' seconds')::INTERVAL 
              ELSE public.rate_limits.reset_at 
            END
        RETURNING count, GREATEST(1, EXTRACT(EPOCH FROM (reset_at - NOW()))::INTEGER) AS ttl_seconds;
      `;

      const res = await pool.query(query, [key, windowSeconds]);
      if (res.rows.length > 0) {
        const count = Number(res.rows[0].count);
        const ttlSeconds = Number(res.rows[0].ttl_seconds);
        return {
          allowed: count <= maxRequests,
          count,
          ttlSeconds,
        };
      }
    } catch (dbErr) {
      // Política de fail-open: si la base de datos presenta lentitud o fallo en el rate limit,
      // no bloqueamos las donaciones legítimas de los usuarios.
      console.warn("[rate-limiter] Error consultando rate_limits en PostgreSQL, recurriendo a memoria:", (dbErr as Error)?.message);
    }
  }

  // Fallback en memoria volátil
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return { allowed: true, count: 1, ttlSeconds: windowSeconds };
  }

  entry.count++;
  const ttlSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  return {
    allowed: entry.count <= maxRequests,
    count: entry.count,
    ttlSeconds,
  };
}

/**
 * Valida sintácticamente si una cadena corresponde a una única dirección IPv4 o IPv6 real.
 * Emplea `net.isIP` nativo de Node.js:
 * - Retorna true si es IPv4 válida (isIP === 4) o IPv6 válida (isIP === 6).
 * - Retorna false para listas de IP separadas por coma, caracteres de inyección,
 *   valores malformados, puertos o cadenas vacías.
 */
export function isValidIp(ip: string | null | undefined): boolean {
  if (!ip || typeof ip !== "string") return false;
  const trimmed = ip.trim();
  return isIP(trimmed) !== 0;
}

/**
 * Extrae la dirección IP del cliente priorizando exclusivamente fuentes verificadas
 * por la infraestructura de borde (Vercel Edge Network).
 *
 * Supuestos de confianza en el runtime de Vercel:
 * 1. 'x-real-ip': En la red de borde de Vercel, este encabezado es inyectado y sobreescrito
 *    obligatoriamente por el Edge con la dirección IP de la conexión TCP entrante. Un atacante
 *    remoto NO puede falsificar 'x-real-ip' porque Vercel descarta cualquier cabecera 'x-real-ip'
 *    enviada por el cliente antes de invocar la Serverless Function. Por tanto, es la fuente primaria
 *    garantizada en este proyecto.
 * 2. 'x-vercel-forwarded-for': Encabezado secundario de Vercel. Si 'x-real-ip' estuviera ausente
 *    y esta cabecera contiene una sola IP válida verificada por Vercel, se acepta.
 * 3. 'x-forwarded-for': Este encabezado estándar es susceptible de falsificación por parte del
 *    cliente en redes intermedias. No se asume que el primer ni el último elemento sean confiables
 *    sin control estricto de toda la topología de proxies. Por tanto, no se acepta como fuente de IP
 *    individual si no existe un encabezado de borde verificado.
 * 4. Fallback 'unknown-client': Si no existe una cabecera de borde verificada con una sola IP válida
 *    (IPv4 o IPv6), se retorna explícitamente "unknown-client".
 *    - Todas las solicitudes sin fuente de IP confiable comparten la clave "unknown-client".
 *    - Esto asegura que un atacante que omita cabeceras o envíe valores malformados sea limitado
 *      a 15 solicitudes en la ventana global compartida.
 *    - Los usuarios legítimos en producción siempre reciben una IP real asignada por Vercel Edge,
 *      por lo que no sufren bloqueos accidentales si la cuota de 'unknown-client' se agota.
 */
export function getClientIp(request: Request): string {
  // 1. Fuente canónica y garantizada por Vercel: x-real-ip
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  // 2. Fuente secundaria de borde Vercel: x-vercel-forwarded-for (solo si es una única IP válida)
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelForwarded && isValidIp(vercelForwarded)) {
    return vercelForwarded;
  }

  // 3. Fallback explícito: no confiar en x-forwarded-for arbitrario ni inventar 127.0.0.1
  return "unknown-client";
}
