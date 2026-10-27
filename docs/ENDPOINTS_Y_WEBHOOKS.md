# KYVORA — Especificación Técnica de Endpoints y Webhooks

Este documento describe la interfaz de programación de aplicaciones (API) y los contratos de datos de los endpoints serverless de KYVORA.

---

## 1. POST `/api/donate/create-transaction`

Crea una intención de aporte voluntario verificada por el servidor, calcula la firma de integridad SHA-256 de Wompi y devuelve la URL del checkout oficial.

### Encabezados Requeridos
- `Content-Type`: `application/json`

### Cuerpo de la Solicitud (JSON)
```json
{
  "amount": 50000,
  "targetId": "general",
  "donorName": "Alejandro Gómez",
  "donorEmail": "alejandro@ejemplo.com"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `amount` | Number | Sí | Monto en pesos colombianos (mínimo 10.000, máximo 50.000.000). |
| `targetId` | String | Sí | ID del destino (`general`, `pulso`, `quakenet`, `pulsai`, `studio`). |
| `donorName` | String | No | Nombre del donante o mecenas (opcional). |
| `donorEmail` | String | No | Correo para soporte o confirmación (opcional). |

### Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "reference": "KYV-DON-1793140800000-A1B2C3D4",
  "checkoutUrl": "https://checkout.wompi.co/p/?public-key=pub_test_...&currency=COP&amount-in-cents=5000000&reference=KYV-DON-...&signature%3Aintegrity=f4c8...&redirect-url=https%3A%2F%2Fwww.kyvora.net.co%2Fdonate%2Fresultado"
}
```

### Respuestas de Error
- `400 Bad Request`:
  ```json
  { "error": "El importe mínimo para un aporte voluntario es de $10.000 COP." }
  ```
- `500 Internal Server Error`:
  ```json
  { "error": "Error interno al inicializar la transacción." }
  ```

---

## 2. GET `/api/donate/status`

Consulta segura del estado de una transacción. El cliente no puede forzar un estado aprobado modificando parámetros de consulta; este endpoint verifica contra el almacén del servidor.

### Parámetros de Consulta (Query Params)
- `reference`: (Requerido si no se envía `id`) Referencia única `KYV-DON-...`.
- `id`: (Opcional) ID de transacción devuelto por Wompi.

### Ejemplo de Solicitud
`GET /api/donate/status?reference=KYV-DON-1793140800000-A1B2C3D4`

### Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "reference": "KYV-DON-1793140800000-A1B2C3D4",
  "status": "APPROVED",
  "amountInCents": 5000000,
  "currency": "COP",
  "targetTitle": "Fondo General de Desarrollo",
  "createdAt": "2026-10-27T17:00:00.000Z",
  "donorName": "Alejandro Gómez"
}
```
*Estados posibles de `status`: `PENDING`, `APPROVED`, `DECLINED`, `VOIDED`, `ERROR`.*

### Respuestas de Error
- `404 Not Found`:
  ```json
  { "error": "Transacción no encontrada en el sistema." }
  ```

---

## 3. POST `/api/webhooks/wompi`

Endpoint receptor de notificaciones de eventos emitidos por Wompi Colombia. Valida el checksum SHA-256 antes de procesar cualquier cambio de estado.

### Encabezados
- `Content-Type`: `application/json`

### Ejemplo de Payload Entrante (Evento de Wompi)
```json
{
  "event": "transaction.updated",
  "data": {
    "transaction": {
      "id": "12345-67890",
      "reference": "KYV-DON-1793140800000-A1B2C3D4",
      "amount_in_cents": 5000000,
      "currency": "COP",
      "status": "APPROVED"
    }
  },
  "signature": {
    "properties": [
      "transaction.id",
      "transaction.status",
      "transaction.amount_in_cents"
    ],
    "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  "timestamp": 1793140805,
  "environment": "test"
}
```

### Lógica de Validación del Servidor
1. Concatena los valores de las propiedades indicadas en `signature.properties`.
2. Añade `timestamp` y el secreto de eventos (`WOMPI_EVENTS_SECRET`).
3. Calcula el hash SHA-256 y lo compara con `signature.checksum`.
4. Valida que `currency === "COP"`.
5. Valida que `amount_in_cents` coincida con el importe registrado en la creación de la referencia.
6. Actualiza el estado a `APPROVED`, `DECLINED`, `VOIDED` o `ERROR`.
7. Si el evento ya había sido procesado previamente con el mismo estado, devuelve `200 OK` de forma idempotente sin duplicar acciones.

### Respuestas
- `200 OK`:
  ```json
  { "success": true, "message": "Evento procesado correctamente." }
  ```
- `401 Unauthorized`:
  ```json
  { "error": "Firma de webhook inválida o checksum alterado." }
  ```
- `404 Not Found`:
  ```json
  { "error": "Referencia no encontrada." }
  ```

---

## 4. POST `/api/contact`

Procesa las consultas comerciales enviadas desde el formulario principal de contacto.

### Encabezados
- `Content-Type`: `application/json`

### Cuerpo de la Solicitud (JSON)
```json
{
  "name": "Carlos Rodríguez",
  "email": "carlos@empresa.com",
  "serviceType": "web",
  "projectDescription": "Necesitamos rediseñar la plataforma institucional de nuestra empresa con catálogo de productos.",
  "budget": "cop_15m_plus",
  "dataConsent": true,
  "website_hp": ""
}
```

### Reglas de Seguridad & Validación
- **Honeypot (`website_hp`)**: Debe llegar vacío. Si contiene texto, la petición se descarta discretamente.
- **Consentimiento de Datos (`dataConsent`)**: Debe ser estrictamente `true` (Ley 1581 de 2012). Si no, devuelve error 400.
- **Sanitización**: Los campos de texto se sanean contra ataques de inyección HTML/XSS.
- **Rate Limit**: Máximo 5 solicitudes por IP cada 15 minutos.
- **Entrega**: Envía el correo mediante la API de **Resend**. Si `RESEND_API_KEY` no está configurada, registra la solicitud en la consola del servidor en modo simulación para no interrumpir el flujo.

### Respuestas
- `200 OK`:
  ```json
  { "success": true, "message": "Mensaje recibido correctamente. Te responderemos a la brevedad." }
  ```
- `400 Bad Request`:
  ```json
  { "error": "Debes autorizar el tratamiento de tus datos personales para enviar el mensaje." }
  ```
- `429 Too Many Requests`:
  ```json
  { "error": "Demasiadas solicitudes enviadas. Por favor espera unos minutos." }
  ```
