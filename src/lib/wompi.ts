import crypto from "crypto";
import { wompiConfig } from "@/config/wompi";
import { siteConfig } from "@/config/site";

/**
 * Genera una referencia única para la transacción.
 * Formato: KYV-DON-{TIMESTAMP_MS}-{HEX_ALEATORIO}
 * Ejemplo: KYV-DON-1730000000000-A1B2C3
 */
export function generateReference(prefix: string = "KYV-DON"): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Convierte un monto en COP a centavos enteros requeridos por Wompi.
 * Ejemplo: 20000 COP -> 2000000 centavos
 */
export function copToCents(amountCOP: number): number {
  return Math.round(amountCOP * 100);
}

/**
 * Valida que el secreto de integridad coincida con el ambiente de la llave pública y no se confunda
 * con la llave privada, el secreto de eventos o la llave pública.
 */
export function validateIntegritySecretForEnvironment(
  integritySecret: string,
  publicKey?: string,
  environment?: string
): { isValid: boolean; reason?: string } {
  const secret = (integritySecret || "").trim().replace(/^["']|["']$/g, "");
  if (!secret) {
    return { isValid: false, reason: "El secreto de integridad (WOMPI_INTEGRITY_SECRET) no está configurado o está vacío." };
  }

  // Comprobación de confusión con otras credenciales
  if (secret.startsWith("prv_")) {
    return {
      isValid: false,
      reason: "Se configuró una llave privada (WOMPI_PRIVATE_KEY) en lugar del secreto de integridad (WOMPI_INTEGRITY_SECRET)."
    };
  }
  if (secret.startsWith("pub_")) {
    return {
      isValid: false,
      reason: "Se configuró la llave pública (NEXT_PUBLIC_WOMPI_PUBLIC_KEY) en lugar del secreto de integridad (WOMPI_INTEGRITY_SECRET)."
    };
  }
  if (secret.includes("_events_")) {
    return {
      isValid: false,
      reason: "Se configuró el secreto de eventos (WOMPI_EVENTS_SECRET) en lugar del secreto de integridad (WOMPI_INTEGRITY_SECRET)."
    };
  }

  const cleanPubKey = (publicKey || "").trim();
  const isProdKey = cleanPubKey.startsWith("pub_prod_");
  const isTestKey = cleanPubKey.startsWith("pub_test_");

  const cleanEnv = (environment || "").toLowerCase().trim();
  const isProdEnv = cleanEnv === "production" || cleanEnv === "prod";

  if ((isProdKey || isProdEnv) && secret.startsWith("test_integrity_")) {
    return {
      isValid: false,
      reason: "Discrepancia de entorno: Se configuró un secreto de integridad de pruebas (test_integrity_...) en un ambiente o con llave pública de Producción (pub_prod_...)."
    };
  }

  if ((isTestKey && !isProdEnv) && secret.startsWith("prod_integrity_")) {
    return {
      isValid: false,
      reason: "Discrepancia de entorno: Se configuró un secreto de integridad de Producción (prod_integrity_...) con una llave pública de Sandbox (pub_test_...)."
    };
  }

  if (!secret.startsWith("prod_integrity_") && !secret.startsWith("test_integrity_")) {
    return {
      isValid: false,
      reason: "Formato de secreto de integridad desconocido. Debe iniciar con 'prod_integrity_' (Producción) o 'test_integrity_' (Sandbox)."
    };
  }

  return { isValid: true };
}

/**
 * Calcula la firma de integridad oficial para el Checkout Web de Wompi.
 * Algoritmo oficial: SHA-256(reference + amount_in_cents + currency + integrity_secret)
 * Si se utiliza fecha de expiración: SHA-256(reference + amount_in_cents + currency + expiration_time + integrity_secret)
 * Devuelve el hash en minúsculas hexadecimal.
 */
export function calculateIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string = "COP",
  integritySecret?: string,
  expirationTime?: string
): string {
  const rawSecret = integritySecret || process.env.WOMPI_INTEGRITY_SECRET || process.env.WOMPI_INTEGRITY_KEY || "";
  const secret = rawSecret.trim().replace(/^["']|["']$/g, "");
  if (!secret) {
    throw new Error("WOMPI_INTEGRITY_SECRET no está configurado en las variables de entorno del servidor.");
  }

  // Validaciones estrictas de seguridad para prevenir confusión de credenciales
  if (secret.startsWith("prv_")) {
    throw new Error("Error de configuración: Se configuró una llave privada (WOMPI_PRIVATE_KEY) en lugar del secreto de integridad (WOMPI_INTEGRITY_SECRET).");
  }
  if (secret.startsWith("pub_")) {
    throw new Error("Error de configuración: Se configuró una llave pública (NEXT_PUBLIC_WOMPI_PUBLIC_KEY) en lugar del secreto de integridad (WOMPI_INTEGRITY_SECRET).");
  }
  if (secret.includes("_events_")) {
    throw new Error("Error de configuración: Se configuró el secreto de eventos (WOMPI_EVENTS_SECRET) en lugar del secreto de integridad (WOMPI_INTEGRITY_SECRET).");
  }

  const cleanRef = reference?.trim() || "";
  if (!cleanRef) {
    throw new Error("La referencia de pago no puede estar vacía.");
  }

  const cleanCurrency = (currency || "COP").trim().toUpperCase();
  if (cleanCurrency !== "COP") {
    throw new Error(`Moneda no soportada por Wompi para checkout de donaciones: ${cleanCurrency}. Se requiere COP.`);
  }

  const cleanAmount = Math.round(Number(amountInCents));
  if (isNaN(cleanAmount) || cleanAmount <= 0) {
    throw new Error("El importe en centavos debe ser un número entero mayor a cero.");
  }

  const cleanExpiration = expirationTime?.trim() || "";
  const stringToSign = cleanExpiration
    ? `${cleanRef}${cleanAmount}${cleanCurrency}${cleanExpiration}${secret}`
    : `${cleanRef}${cleanAmount}${cleanCurrency}${secret}`;

  return crypto.createHash("sha256").update(stringToSign, "utf8").digest("hex");
}

/**
 * Valida un evento webhook recibido de Wompi mediante el checksum oficial.
 * Algoritmo:
 * 1. Extrae las propiedades listadas en payload.signature.properties (concatenando data[prop])
 * 2. Concatena el timestamp
 * 3. Concatena eventsSecret
 * 4. Calcula SHA-256 y compara con payload.signature.checksum
 */
export function verifyWebhookChecksum(
  eventPayload: Record<string, unknown>,
  eventsSecret?: string
): { isValid: boolean; reason?: string } {
  const secret = eventsSecret || process.env.WOMPI_EVENTS_SECRET || process.env.WOMPI_EVENT_SECRET || "";
  if (!secret) {
    return { isValid: false, reason: "WOMPI_EVENTS_SECRET no configurado en servidor" };
  }

  const sig = eventPayload?.signature as Record<string, unknown> | undefined;
  if (!eventPayload || !sig || !Array.isArray(sig.properties)) {
    return { isValid: false, reason: "Payload de evento incompleto o sin estructura de firma" };
  }

  const properties: string[] = sig.properties as string[];
  const receivedChecksum = sig.checksum as string | undefined;
  const timestamp = eventPayload.timestamp;

  if (!receivedChecksum || timestamp === undefined || timestamp === null) {
    return { isValid: false, reason: "Checksum o timestamp faltante en el evento" };
  }

  if (properties.length === 0) {
    return { isValid: false, reason: "La lista de propiedades de firma está vacía" };
  }

  const hasTransactionProps = properties.some((p) => typeof p === "string" && p.startsWith("transaction."));
  if (!hasTransactionProps) {
    return { isValid: false, reason: "La firma no contiene propiedades requeridas de transacción" };
  }

  // Función recursiva para obtener propiedades anidadas seguras
  const getNestedValue = (obj: unknown, path: string): unknown => {
    return path
      .split(".")
      .reduce(
        (acc: unknown, part: string) =>
          acc && typeof acc === "object" && part in (acc as Record<string, unknown>)
            ? (acc as Record<string, unknown>)[part]
            : undefined,
        obj
      );
  };

  let concatenatedString = "";
  for (const prop of properties) {
    const val = getNestedValue(eventPayload.data, prop);
    if (val === undefined || val === null) {
      return { isValid: false, reason: `Propiedad requerida '${prop}' no encontrada en el evento` };
    }
    concatenatedString += String(val);
  }

  concatenatedString += String(timestamp);
  concatenatedString += secret;

  const calculatedChecksum = crypto.createHash("sha256").update(concatenatedString, "utf8").digest("hex");

  // Comparación en tiempo constante para mitigar timing attacks
  const isMatch =
    calculatedChecksum.length === receivedChecksum.length &&
    crypto.timingSafeEqual(Buffer.from(calculatedChecksum), Buffer.from(receivedChecksum));

  if (!isMatch) {
    return { isValid: false, reason: "El checksum calculado no coincide con el recibido" };
  }

  return { isValid: true };
}

/**
 * Determina si una URL apunta a un entorno local o loopback mediante URL.hostname.
 * AWS WAF en CloudFront (checkout.wompi.co) bloquea con error 403 (regla SSRF)
 * peticiones GET cuyos query parameters contengan hosts locales.
 */
export function isLocalOrLoopbackUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();

    // 1. localhost exacto o cualquier subdominio de .localhost (RFC 6761)
    if (hostname === "localhost" || hostname.endsWith(".localhost")) {
      return true;
    }

    // 2. IPv4 loopback (rango 127.0.0.0/8: 127.0.0.1 hasta 127.255.255.255)
    if (hostname.startsWith("127.")) {
      return true;
    }

    // 3. IPv6 loopback (::1, [::1], 0:0:0:0:0:0:0:1)
    if (
      hostname === "::1" ||
      hostname === "[::1]" ||
      hostname === "0:0:0:0:0:0:0:1" ||
      hostname === "[0:0:0:0:0:0:0:1]"
    ) {
      return true;
    }

    // 4. IP 0.0.0.0
    if (hostname === "0.0.0.0") {
      return true;
    }

    return false;
  } catch {
    // Si la cadena no es una URL parseable válida, se asume insegura
    return true;
  }
}

export interface WompiReturnUrlOptions {
  vercelEnv?: string;
  nodeEnv?: string;
  vercelUrl?: string;
  vercelBranchUrl?: string;
  siteUrl?: string;
}

/**
 * Valida si una URL pertenece formalmente a los dominios autorizados de KYVORA.
 */
export function isKyvoraDomain(urlStr: string): boolean {
  try {
    const hostname = new URL(urlStr).hostname.toLowerCase();
    return (
      hostname === "www.kyvora.net.co" ||
      hostname === "kyvora.net.co"
    );
  } catch {
    return false;
  }
}

/**
 * Determina de manera determinista e inequívoca la URL base para el retorno de Wompi.
 * Política de entornos:
 * 1. Producción: Si VERCEL_ENV === "production", SIEMPRE retorna el dominio canónico de KYVORA (https://www.kyvora.net.co).
 *    Se ignora cualquier valor en NEXT_PUBLIC_SITE_URL o VERCEL_URL que contenga dominios efímeros (*.vercel.app)
 *    para garantizar que en producción el usuario regrese única y exclusivamente al dominio oficial.
 * 2. Preview: Si VERCEL_ENV === "preview", utiliza la URL pública del deployment o branch preview de Vercel
 *    (VERCEL_BRANCH_URL o VERCEL_URL o siteUrl si es un subdominio preview HTTPS), permitiendo pruebas aisladas.
 * 3. Desarrollo local / Loopback: Si el entorno es local o la URL resultante es localhost/loopback (127.0.0.1, ::1, etc.),
 *    retorna undefined para omitir el parámetro redirect-url y evitar el error 403 (SSRF) de CloudFront AWS WAF en Wompi.
 *    Si en desarrollo se configura un túnel público seguro explícito (ej. ngrok, loca.lt), se usa dicho túnel.
 * 4. Seguridad: NUNCA se confía en encabezados de la petición del cliente (Host, x-forwarded-host) ni en
 *    parámetros provistos por el usuario, previniendo vulnerabilidades de Open Redirect.
 */
export function getWompiReturnBaseUrl(options?: WompiReturnUrlOptions): string | undefined {
  const vercelEnv = (options?.vercelEnv ?? process.env.VERCEL_ENV)?.toLowerCase().trim();
  const nodeEnv = (options?.nodeEnv ?? process.env.NODE_ENV)?.toLowerCase().trim();
  const siteUrl = (options?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL)?.trim();
  const vercelUrl = (options?.vercelUrl ?? process.env.VERCEL_URL)?.trim();
  const vercelBranchUrl = (options?.vercelBranchUrl ?? process.env.VERCEL_BRANCH_URL)?.trim();

  // 1. Producción en Vercel:
  // Forzar siempre https://www.kyvora.net.co sin importar si NEXT_PUBLIC_SITE_URL apunta a *.vercel.app
  if (vercelEnv === "production") {
    return siteConfig.url;
  }

  // 2. Entorno Preview en Vercel:
  if (vercelEnv === "preview") {
    const rawPreviewHost = vercelBranchUrl || vercelUrl;
    if (rawPreviewHost) {
      const cleanHost = rawPreviewHost.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
      return `https://${cleanHost}`;
    }
    if (siteUrl && !isLocalOrLoopbackUrl(siteUrl) && !isKyvoraDomain(siteUrl)) {
      return siteUrl.replace(/\/+$/, "");
    }
    return undefined;
  }

  // 3. Producción fuera de Vercel (servidor dedicado o contenedor con dominio configurado)
  if (nodeEnv === "production" && siteUrl && isKyvoraDomain(siteUrl)) {
    return siteConfig.url;
  }

  // 4. Desarrollo local o sin URL pública configurada:
  const isLocal = !siteUrl || isLocalOrLoopbackUrl(siteUrl);
  if (isLocal) {
    return undefined;
  }

  // 5. Túnel público HTTPS para desarrollo (ngrok, loca.lt, etc.)
  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol === "https:") {
      return siteUrl.replace(/\/+$/, "");
    }
  } catch {
    return undefined;
  }

  return undefined;
}

/**
 * Construye la URL de retorno completa para Wompi Checkout.
 * Ejemplo: https://www.kyvora.net.co/donate/resultado?reference=KYV-DON-...
 * Si el entorno es local (o no tiene URL pública), devuelve undefined para que
 * buildWompiCheckoutUrl omita el parámetro redirect-url.
 */
export function buildWompiReturnUrl(
  reference: string,
  options?: WompiReturnUrlOptions
): string | undefined {
  const baseUrl = getWompiReturnBaseUrl(options);
  if (!baseUrl) {
    return undefined;
  }
  const sanitized = baseUrl.trim().replace(/\/+$/, "");
  return `${sanitized}/donate/resultado?reference=${encodeURIComponent(reference)}`;
}

/**
 * Construye la URL de redirección al Checkout Web alojado de Wompi.
 * Si redirectUrl no se suministra (por ejemplo, en desarrollo local para evitar el bloqueo 403 de CloudFront WAF),
 * el parámetro redirect-url se omite limpiamente.
 */
export function buildWompiCheckoutUrl(params: {
  publicKey: string;
  reference: string;
  amountInCents: number;
  currency: string;
  signature: string;
  redirectUrl?: string;
  expirationTime?: string;
  customerData?: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
  };
}): string {
  const cleanPublicKey = params.publicKey.trim();
  const cleanCurrency = params.currency.trim().toUpperCase();
  const cleanAmountInCents = Math.round(params.amountInCents).toString();
  const cleanReference = params.reference.trim();
  const cleanSignature = params.signature.trim();

  const query = new URLSearchParams({
    "public-key": cleanPublicKey,
    currency: cleanCurrency,
    "amount-in-cents": cleanAmountInCents,
    reference: cleanReference,
    "signature:integrity": cleanSignature,
  });

  if (params.redirectUrl) {
    query.set("redirect-url", params.redirectUrl.trim());
  }

  if (params.expirationTime) {
    query.set("expiration-time", params.expirationTime.trim());
  }

  if (params.customerData?.email) {
    query.set("customer-data:email", params.customerData.email.trim());
  }
  if (params.customerData?.fullName) {
    query.set("customer-data:full-name", params.customerData.fullName.trim());
  }
  if (params.customerData?.phoneNumber) {
    query.set("customer-data:phone-number", params.customerData.phoneNumber.trim());
  }

  // Wompi acepta la query con ':' en los parámetros signature:integrity y customer-data:*
  // Reemplazar '%3A' por ':' garantiza máxima compatibilidad con los analizadores oficiales de Wompi
  const queryString = query.toString().replace(/%3A/g, ":");

  return `${wompiConfig.checkoutUrl}?${queryString}`;
}

/**
 * Analiza y extrae de forma robusta los identificadores que Wompi devuelve en la URL de retorno.
 * Maneja tanto el estándar de Wompi (?id=...), como redirecciones compuestas (&id=... o ?id=...),
 * corrigiendo casos donde Wompi concatena con doble signo de interrogación.
 */
export function parseWompiReturnParams(
  searchParams: URLSearchParams | { get: (name: string) => string | null }
): { reference: string | null; transactionId: string | null } {
  let reference = searchParams.get("reference")?.trim() || null;
  let transactionId = searchParams.get("id")?.trim() || null;

  // Corregir posible concatenación errónea de Wompi (?reference=XYZ?id=123 o &id=123)
  if (reference) {
    if (reference.includes("?id=")) {
      const [refPart, idPart] = reference.split("?id=");
      reference = refPart.trim() || null;
      if (!transactionId && idPart) {
        transactionId = idPart.trim() || null;
      }
    } else if (reference.includes("&id=")) {
      const [refPart, idPart] = reference.split("&id=");
      reference = refPart.trim() || null;
      if (!transactionId && idPart) {
        transactionId = idPart.trim() || null;
      }
    }
  }

  // Filtrar cadenas vacías
  if (reference === "") reference = null;
  if (transactionId === "") transactionId = null;

  return { reference, transactionId };
}

export interface WompiApiTransaction {
  id: string;
  reference: string;
  amount_in_cents: number;
  currency: string;
  status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
  customer_email?: string;
  created_at?: string;
  finalized_at?: string;
  customer_data?: {
    full_name?: string;
    email?: string;
    phone_number?: string;
  };
}

export async function fetchWompiTransactionById(
  transactionId: string,
  privateKey: string,
  env: "production" | "sandbox" = "sandbox"
): Promise<{ ok: boolean; status: number; data?: WompiApiTransaction; error?: string }> {
  try {
    const baseUrl = wompiConfig.apiBaseUrl[env] || wompiConfig.apiBaseUrl.sandbox;
    const res = await fetch(`${baseUrl}/transactions/${encodeURIComponent(transactionId)}`, {
      headers: { Authorization: `Bearer ${privateKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const json = await res.json();
    return { ok: true, status: res.status, data: json?.data };
  } catch (err) {
    return { ok: false, status: 500, error: (err as Error)?.message };
  }
}

export async function fetchWompiTransactionByReference(
  reference: string,
  privateKey: string,
  env: "production" | "sandbox" = "sandbox"
): Promise<{ ok: boolean; status: number; data?: WompiApiTransaction; error?: string }> {
  try {
    const baseUrl = wompiConfig.apiBaseUrl[env] || wompiConfig.apiBaseUrl.sandbox;
    const res = await fetch(`${baseUrl}/transactions?reference=${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${privateKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    if (list.length === 0) {
      return { ok: true, status: 200, data: undefined };
    }
    const sorted = [...list].sort((a: WompiApiTransaction, b: WompiApiTransaction) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });
    return { ok: true, status: 200, data: sorted[0] };
  } catch (err) {
    return { ok: false, status: 500, error: (err as Error)?.message };
  }
}

