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
 * Construye la URL de redirección al Checkout Web alojado de Wompi.
 */
export function buildWompiCheckoutUrl(params: {
  publicKey: string;
  reference: string;
  amountInCents: number;
  currency: string;
  signature: string;
  redirectUrl: string;
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
    "redirect-url": params.redirectUrl,
  });

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
