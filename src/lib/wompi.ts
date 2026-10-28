import crypto from "crypto";
import { wompiConfig } from "@/config/wompi";

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
 * Calcula la firma de integridad oficial para el Checkout Web de Wompi.
 * Algoritmo oficial: SHA-256(reference + amount_in_cents + currency + integrity_secret)
 * Devuelve el hash en minúsculas hexadecimal.
 */
export function calculateIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string = "COP",
  integritySecret?: string
): string {
  const secret = integritySecret || process.env.WOMPI_INTEGRITY_SECRET || "";
  if (!secret) {
    throw new Error("WOMPI_INTEGRITY_SECRET no está configurado en las variables de entorno del servidor.");
  }

  const stringToSign = `${reference}${amountInCents}${currency}${secret}`;
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
  const secret = eventsSecret || process.env.WOMPI_EVENTS_SECRET || "";
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

  if (!receivedChecksum || timestamp === undefined) {
    return { isValid: false, reason: "Checksum o timestamp faltante en el evento" };
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
  customerData?: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
  };
}): string {
  const query = new URLSearchParams({
    "public-key": params.publicKey,
    currency: params.currency,
    "amount-in-cents": params.amountInCents.toString(),
    reference: params.reference,
    "signature:integrity": params.signature,
  });

  if (params.redirectUrl) {
    query.set("redirect-url", params.redirectUrl);
  }

  if (params.customerData?.email) {
    query.set("customer-data:email", params.customerData.email);
  }
  if (params.customerData?.fullName) {
    query.set("customer-data:full-name", params.customerData.fullName);
  }
  if (params.customerData?.phoneNumber) {
    query.set("customer-data:phone-number", params.customerData.phoneNumber);
  }

  return `${wompiConfig.checkoutUrl}?${query.toString()}`;
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

