/**
 * Utilidades de sanitización y validación segura para el endpoint de contacto (/api/contact).
 */

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Valida y normaliza correos electrónicos rechazando secuencias peligrosas
 * para encabezados SMTP (CRLF) o inyección de enlaces/HTML.
 */
export function sanitizeAndValidateEmail(raw: string): string | null {
  const cleanEmail = String(raw ?? "").trim().toLowerCase().slice(0, 120);
  if (!cleanEmail) return null;
  if (/[\s\r\n<>'"`\\]/.test(cleanEmail)) return null;
  if (cleanEmail.includes("..")) return null;

  const emailRegex =
    /^[a-z0-9.!#$%&*+/=?^_{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

  if (!emailRegex.test(cleanEmail)) {
    return null;
  }

  return cleanEmail;
}

