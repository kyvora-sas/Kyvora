/**
 * Utilidades de formato y normalización para KYVORA.
 */

/**
 * Convierte una cadena con una o varias direcciones de correo electrónico
 * (separadas por guiones, comas, puntos y coma o espacios) en un enlace URI
 * estándar 'mailto:' conforme al estándar RFC 6068 (ej: 'mailto:correo1@dom.co,correo2@dom.co').
 *
 * @param emails - Cadena con una o varias direcciones de correo electrónico.
 * @returns Cadena con el formato 'mailto:correo1@dom.co,correo2@dom.co'.
 */
export function formatMailto(emails: string): string {
  if (!emails || typeof emails !== "string") {
    return "mailto:";
  }

  const matches = emails.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (!matches || matches.length === 0) {
    return `mailto:${emails.trim()}`;
  }

  // Elimina correos duplicados preservando el orden de aparición
  const uniqueEmails = Array.from(new Set(matches));
  return `mailto:${uniqueEmails.join(",")}`;
}

