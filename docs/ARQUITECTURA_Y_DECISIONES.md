# KYVORA — Arquitectura del Sistema y Decisiones Técnicas

Este documento detalla los fundamentos de ingeniería, las elecciones de diseño de software y las medidas de seguridad adoptadas en la reconstrucción del sitio web oficial de KYVORA.

---

## 1. Principios de Diseño de Software

1. **Defensa en Profundidad (Defense in Depth)**:
   - Toda validación que ocurre en el navegador del cliente se replica estrictamente en el servidor.
   - Los datos sensibles (secretos de firma SHA-256 de Wompi, API Keys de Resend) nunca se exponen al paquete del cliente (`client bundle`).
2. **Idempotencia Transaccional**:
   - Cada intento de pago o aporte genera una referencia criptográfica única.
   - Las notificaciones entrantes de pasarelas de pago se pueden procesar múltiples veces sin duplicar registros ni corromper estados de cuenta.
3. **Mantenibilidad y Tipado Estricto**:
   - Se erradicó el uso de tipos `any`. Todos los modelos de datos, estados de transacción y respuestas HTTP cuentan con interfaces y tipos TypeScript fuertemente verificados.
4. **Respeto a la Normativa Local (Compliance by Design)**:
   - La arquitectura técnica incorpora los requisitos legales de Colombia desde la raíz (consentimiento previo, trazabilidad de autorizaciones, no almacenamiento de datos bancarios).

---

## 2. Pila Tecnológica y Decisiones de Compilación

| Componente | Tecnología Seleccionada | Justificación Técnica |
|---|---|---|
| **Framework Base** | Next.js 16 (App Router) | Renderizado híbrido (páginas estáticas pre-renderizadas + funciones serverless para APIs). Óptimo para Vercel y SEO. |
| **Motor de Compilación** | Next.js con Webpack (`--webpack`) | En sistemas Windows, el compilador Turbopack presentaba un conflicto de resolución de módulos con `@tailwindcss/node` en `@vercel/turbopack/postcss`. El uso de Webpack garantiza compilaciones reproducibles, rápidas y estables (7 segundos para 19 rutas). |
| **Sistema de Diseño** | Tailwind CSS v4 + Variables CSS | Centralización de tokens de diseño semánticos en `globals.css` (HSL), eliminando la dependencia de librerías CSS pesadas y facilitando la personalización de temas oscuros técnicos. |
| **Procesamiento Gráfico** | Sharp | Motor nativo de alta eficiencia para la optimización de imágenes en tiempo de compilación y soporte de `placeholder="blur"`. |
| **Pasarela de Pagos** | Wompi Colombia | Pasarela líder en Colombia con soporte nativo para PSE, tarjetas de crédito/débito y Nequi, con esquema oficial de firmas SHA-256 para integridad de transacciones. |
| **Email Transaccional** | Resend | API moderna con alta tasa de entregabilidad, soporte para TypeScript y excelente rendimiento en entornos Edge/Serverless. |

---

## 3. Arquitectura del Flujo de Pagos (Wompi Colombia)

### 3.1. Esquema de Firma de Integridad
Para prevenir la manipulación del importe o la moneda en el navegador del usuario, KYVORA no permite que el cliente inicie pagos directamente con Wompi sin validación previa del backend.

El backend ejecuta:
```typescript
const rawConcatenated = `${reference}${amountInCents}${currency}${integritySecret}`;
const signature = crypto.createHash("sha256").update(rawConcatenated).digest("hex");
```
- **Referencia**: `KYV-DON-<TIMESTAMP>-<RANDOM_HEX>`
- **Moneda**: Exclusivamente `COP`
- **Monto en Centavos**: `monto * 100` (entero sin decimales)
- **Firma devuelta**: Cadena hexadecimal de 64 caracteres.

### 3.2. Verificación de Webhooks de Wompi
Cuando Wompi envía una notificación HTTP POST a `/api/webhooks/wompi`:
1. Extrae el objeto de firma del payload:
   - `signature.properties`: Lista ordenada de propiedades que forman el hash (ej. `["transaction.id", "transaction.status", "transaction.amount_in_cents"]`).
   - `signature.checksum`: Hash SHA-256 generado por Wompi.
   - `timestamp`: Marca de tiempo Unix provista en el evento.
2. El servidor concatena los valores reales presentes en `data` correspondientes a cada propiedad de la lista, añade el `timestamp` y el secreto privado `WOMPI_EVENTS_SECRET`.
3. Calcula el hash SHA-256 local y lo compara con el `checksum` recibido en tiempo constante para evitar ataques de temporización (`timing attacks`).
4. Si el checksum es válido y el importe coincide con el registro original, actualiza el estado de la transacción en el almacén de datos. Si no coincide, rechaza la operación con código HTTP 401/400.

---

## 4. Estrategia de Persistencia de Datos

### 4.1. Adaptador Transaccional (`src/lib/transactions-store.ts`)
- **Desarrollo y Pruebas**: Almacenamiento dual en caché en memoria y persistencia local en `data/transactions.json`. Esto permite probar flujos completos, recargas de página y pruebas automatizadas sin necesidad de configurar una base de datos externa.
- **Producción en Vercel**: El diseño del almacén utiliza un patrón de repositorio (`Repository Pattern`), lo que permite conectar fácilmente una base de datos distribuida como **Vercel KV (Redis)**, **Supabase (PostgreSQL)** o **Upstash** simplemente sobreescribiendo los métodos `saveTransaction`, `getTransaction` y `updateTransactionStatus` sin modificar la lógica de los endpoints.

---

## 5. Medidas de Seguridad Web Implementadas

### 5.1. Cabeceras HTTP de Seguridad (`next.config.ts`)
- **Content-Security-Policy (CSP)**:
  - Restringe la carga de scripts, estilos e imágenes a orígenes autorizados (`self`, Wompi `checkout.wompi.co`, Google Fonts).
- **X-Frame-Options: DENY**:
  - Previene ataques de Clickjacking impidiendo que el sitio sea embebido en `<iframe>` externos.
- **X-Content-Type-Options: nosniff**:
  - Evita que los navegadores interpreten archivos con tipos MIME erróneos (MIME sniffing).
- **Strict-Transport-Security (HSTS)**:
  - Fuerza conexiones seguras HTTPS por 2 años con inclusión de subdominios y precarga (`max-age=63072000; includeSubDomains; preload`).
- **Referrer-Policy: strict-origin-when-cross-origin**:
  - Protege la privacidad del usuario al navegar fuera del sitio.
- **Permissions-Policy**:
  - Desactiva el acceso innecesario a sensores del dispositivo (cámara, micrófono, geolocalización).

### 5.2. Protección del Formulario de Contacto
- **Honeypot Antispam**: Campo trampa invisible (`website_hp`). Si un bot automatizado completa este campo, la solicitud se descarta inmediatamente con código 200 sin procesar correo ni alertar al atacante.
- **Rate Limiting**: Control de frecuencia por dirección IP (máximo 5 envíos por ventana de 15 minutos).
- **Sanitización de Entradas**: Todos los campos de texto se sanean para neutralizar caracteres `<, >, &, ", '` antes de generar el correo electrónico.
- **Consentimiento Legal Obligatorio**: No se permite el envío a menos que el usuario marque activamente la casilla de aceptación de la Política de Tratamiento de Datos Personales (Ley 1581 de 2012).
