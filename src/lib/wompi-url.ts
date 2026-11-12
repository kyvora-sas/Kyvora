/**
 * Analiza y extrae de forma robusta los identificadores que Wompi devuelve en la URL de retorno.
 * Maneja tanto el estándar de Wompi (?id=...), como redirecciones compuestas (&id=... o ?id=...),
 * corrigiendo casos donde Wompi concatena con doble signo de interrogación.
 *
 * Módulo cliente puro sin dependencias de servidor ni criptografía de Node.js.
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

