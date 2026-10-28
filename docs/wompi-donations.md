# KYVORA — Arquitectura y Guía de Integración de Donaciones con Wompi Colombia

Documentación oficial para el flujo de donaciones y aportes voluntarios en KYVORA mediante la pasarela de pagos Wompi Colombia (Grupo Bancolombia), con soporte para entornos Sandbox y Producción desplegados en Vercel y bases de datos PostgreSQL.

---

## 1. Arquitectura del Flujo de Donaciones

```
+---------------------------------------------------------------------------------------------------+
|                                        PORTAL KYVORA                                              |
|                                                                                                   |
|  1. Usuario selecciona destino ($10k-$50M COP) -> POST /api/donate/create-transaction             |
|     - Servidor valida importe y genera referencia única (KYV-DON-TARGET-TIMESTAMP-HEX)            |
|     - Servidor calcula firma de integridad oficial SHA-256 en backend                             |
|     - Servidor registra la transacción como PENDING en PostgreSQL (o ledger local)                |
|     - Servidor genera URL del Checkout Web de Wompi con redirect-url canónica                     |
+-------------------------------------------------+-------------------------------------------------+
                                                  | Redirección al Checkout Wompi
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                  CHECKOUT OFICIAL WOMPI                                           |
|                                                                                                   |
|  2. Usuario selecciona método de pago (Tarjeta / PSE / Nequi / Bancolombia / Corresponsal)       |
|     - Wompi procesa el cobro y valida antifraude                                                  |
|     - Wompi emite identificador único oficial: id (ej. 179315-1234567890-12345)                 |
+------------------------+--------------------------------------------------+-----------------------+
                         |                                                  |
     A. Redirección      |                                                  | B. Notificación Webhook
     del Navegador       |                                                  | (Asíncrona y segura)
                         v                                                  v
+---------------------------------------------------+  +--------------------------------------------+
|        RETORNO AL SITIO PÚBLICO                   |  |          WEBHOOK DEL SERVIDOR              |
|        /donate/resultado?reference=...&id=...     |  |          POST /api/webhooks/wompi          |
|                                                   |  |                                            |
| 3. Frontend carga y llama /api/donate/status      |  | 4. Servidor valida firma SHA-256           |
|    - Servidor valida que id pertenezca a la ref   |  |    (properties + timestamp + eventsSecret) |
|    - Servidor consulta API Wompi con Private Key  |  |    - Verifica idempotencia por eventId     |
|    - Servidor valida que importe y moneda calcen  |  |    - Previene asociación cruzada de id     |
|    - Actualiza estado a APPROVED en base de datos |  |    - Protege estado definitivo (máquina)   |
|    - Frontend muestra «Aporte Aprobado»           |  |    - Actualiza estado a APPROVED           |
+---------------------------------------------------+  +--------------------------------------------+
```

---

## 2. Variables de Entorno Requeridas

Configura estas variables en `.env.local` (desarrollo) y en las variables de entorno del proyecto en el panel de Vercel (Producción y Preview). **Nunca** incluyas claves reales en el control de versiones.

| Variable | Ámbito | Descripción | Ejemplo / Formato |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Público | URL base del sitio para redirecciones y canónicos. | `https://www.kyvora.net.co` (o `http://localhost:3000` en local) |
| `NEXT_PUBLIC_WOMPI_ENVIRONMENT` | Público | Define el entorno de la pasarela: `sandbox` o `production`. | `sandbox` / `production` |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Público | Llave pública de comercio de Wompi para inicializar el checkout. | `pub_test_...` o `pub_prod_...` |
| `WOMPI_INTEGRITY_SECRET` | Servidor | Secreto de integridad para calcular el hash SHA-256 de las donaciones. | `test_integrity_...` o `prod_integrity_...` |
| `WOMPI_EVENTS_SECRET` | Servidor | Secreto para verificar la firma criptográfica (checksum) de los webhooks. | `test_events_...` o `prod_events_...` |
| `WOMPI_PRIVATE_KEY` | Servidor | Llave privada para consultar transacciones directamente en la API oficial de Wompi. | `prv_test_...` o `prv_prod_...` |
| `DATABASE_URL` o `POSTGRES_URL` | Servidor | Cadena de conexión PostgreSQL para persistencia relacional en Vercel. | `postgres://user:pass@host:5432/db?sslmode=require` |
| `RESEND_API_KEY` | Servidor | Clave de Resend para notificaciones de contacto. | `re_...` |
| `CONTACT_NOTIFICATION_EMAIL` | Servidor | Correo receptor de notificaciones. | `kyvorasas@gmail.com` |

---

## 3. Configuración en el Panel de Wompi

### A. Entorno Sandbox (Pruebas)
1. Inicia sesión en el [Dashboard de Wompi](https://comercios.wompi.co/).
2. Asegúrate de estar en el modo **Sandbox** (banner superior de pruebas).
3. Dirígete a **Desarrolladores > Llaves de API**:
   - Copia la **Llave pública** (`pub_test_...`) en `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`.
   - Copia la **Llave privada** (`prv_test_...`) en `WOMPI_PRIVATE_KEY`.
4. Dirígete a **Desarrolladores > Secretos para integración técnica**:
   - Copia el **Secreto de integridad** (`test_integrity_...`) en `WOMPI_INTEGRITY_SECRET`.
   - Copia el **Secreto de eventos** (`test_events_...`) en `WOMPI_EVENTS_SECRET`.
5. Dirígete a **Desarrolladores > URLs de eventos y redirección**:
   - **URL de redirección:** `https://www.kyvora.net.co/donate/resultado`
   - **URL de eventos (Webhook):** `https://www.kyvora.net.co/api/webhooks/wompi`
   *(En pruebas locales con túneles como ngrok o Cloudflare Tunnel, puedes usar temporalmente `https://tu-tunel.ngrok-free.app/api/webhooks/wompi`).*

### B. Entorno de Producción
1. Completa el proceso de vinculación legal y comercial de Wompi (RUT, cuenta bancaria Bancolombia o interbancaria).
2. Cambia al modo **Producción** en el panel de Wompi.
3. Copia las llaves de producción correspondientes (`pub_prod_...`, `prv_prod_...`, `prod_integrity_...`, `prod_events_...`) en el panel de configuración de Vercel.
4. Establece `NEXT_PUBLIC_WOMPI_ENVIRONMENT=production`.
5. Configura la URL de eventos: `https://www.kyvora.net.co/api/webhooks/wompi`.
6. Configura la URL de redirección: `https://www.kyvora.net.co/donate/resultado`.

---

## 4. Política de Redirección y Control por Entorno

Wompi Checkout Web permite especificar la URL de redirección en el query param `redirect-url`.

- **Producción:** Se envía `https://www.kyvora.net.co/donate/resultado?reference=KYV-DON-...`. Si por error de configuración `NEXT_PUBLIC_SITE_URL` estuviera en `localhost`, el servidor detecta el entorno de producción y fuerza la URL canónica `https://www.kyvora.net.co`.
- **Desarrollo Local (`localhost` / `127.0.0.1`):** La regla WAF anti-SSRF de AWS CloudFront en `checkout.wompi.co` bloquea con HTTP 403 las peticiones GET cuyos query params contengan `localhost` o direcciones loopback. Por ello, en desarrollo local el parámetro `redirect-url` se omite de la URL de checkout. El usuario puede utilizar la URL por defecto configurada en el panel o sincronizar con su ID de transacción en la pantalla de resultado.
- **Túneles de Desarrollo:** Si se configura una URL pública HTTPS en `NEXT_PUBLIC_SITE_URL` (por ejemplo `https://kyvora.ngrok-free.app`), `redirect-url` se incluye automáticamente sin bloqueos de WAF.

---

## 5. Persistencia y Base de Datos (PostgreSQL en Vercel)

Las funciones Serverless de Vercel operan en contenedores efímeros de solo lectura. Para producción, el sistema utiliza el adaptador `PostgresTransactionStore`.

### Esquema Relacional (`db/schema.sql`)
La tabla `donations` incluye:
- `reference`: `VARCHAR(80) UNIQUE NOT NULL`.
- `wompi_transaction_id`: `VARCHAR(100) UNIQUE` (previene que un ID de Wompi apruebe más de una donación).
- `amount_cop`, `amount_in_cents`, `currency`, `target_id`.
- `status`: `VARCHAR(20) CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'))`.
- `processed_event_ids`: `TEXT[]` para control de idempotencia de webhooks.
- `audit_logs`: `JSONB` para trazabilidad completa.

### Ejecución de Migraciones
1. **Crear las tablas en la base de datos:**
   ```bash
   # Utilizando psql o la consola SQL de Vercel / Neon / Supabase:
   psql "$DATABASE_URL" -f db/schema.sql
   ```
2. **Migrar registros históricos desde `data/transactions.json`:**
   ```bash
   DATABASE_URL="$DATABASE_URL" node scripts/migrate-transactions-to-postgres.js
   ```
   El script utiliza `ON CONFLICT (reference) DO NOTHING`, preservando los 7 registros históricos de prueba sin alterarlos.

---

## 6. Verificación de Seguridad y Transiciones de Estado

### Validaciones Obligatorias en cada Consulta
El servidor nunca confía en parámetros enviados por el navegador ni aprueba donaciones sin validar:
1. **Existencia en Wompi:** Se consulta `GET /v1/transactions/:id` utilizando la llave privada (`WOMPI_PRIVATE_KEY`).
2. **Concordancia de Referencia:** Si `tx.reference !== record.reference`, responde HTTP 400 con código `REFERENCE_MISMATCH`. No modifica el registro consultado ni el ajeno.
3. **Concordancia de Importe:** Si `tx.amount_in_cents !== record.amountInCents`, responde HTTP 400 con código `AMOUNT_MISMATCH`.
4. **Concordancia de Moneda:** Si `tx.currency !== record.currency` (`COP`), responde HTTP 400 con código `CURRENCY_MISMATCH`.
5. **No Reutilización de IDs:** Si el `id` de Wompi ya está asociado a otra donación, responde HTTP 400 con código `TRANSACTION_ALREADY_BOUND`.
6. **Máquina de Estados:** Un evento tardío que reporte `PENDING` **nunca** puede degradar una donación que ya fue confirmada como `APPROVED` o `DECLINED`.

---

## 7. Diagnóstico de Discrepancias y Preguntas Frecuentes

### ¿Por qué aparece «Discrepancia de Referencia» (`REFERENCE_MISMATCH`)?
Ocurre cuando el usuario tiene abierta una pestaña con una donación previa (ej. `KYV-DON-GEN-1793152281770-0E51F74C`) e intenta ingresar o sincronizar el ID de Wompi de una donación realizada en otra pestaña o en un intento posterior (ej. `KYV-DON-GEN-1793154181552-DC7DB2D0`).

**Solución:** La interfaz muestra automáticamente un botón directo: **«Verificar referencia pagada (...)»**, el cual redirige a la donación que realmente coincide con ese pago en Wompi, verificándola y aprobándola de inmediato sin inconsistencias.

---

## 8. Pasos para Probar en Sandbox de Extremo a Extremo

1. Inicia el servidor: `npm run dev`.
2. Dirígete a la sección de donaciones en `http://localhost:3000/#donate`.
3. Selecciona un importe (ej. $50.000 COP) y un destino.
4. Pulsa **«Realizar Aporte Seguro»**. Se generará la transacción y se abrirá el Checkout de Wompi.
5. Usa los datos de prueba oficiales de Sandbox de Wompi:
   - **Tarjeta Aprobada:** `4242 4242 4242 4242`, fecha futura, CVV `123`.
6. Completa el pago. Wompi mostrará la pantalla de confirmación con el **ID de Transacción** (ej. `179315-...`).
7. Abre la página de resultado con la referencia generada y el ID de Wompi:
   `http://localhost:3000/donate/resultado?reference=KYV-DON-...&id=ID_WOMPI`
   *(O ingresa el ID en el campo «Sincronizar ID» de la pantalla).*
8. El servidor validará la autenticidad con Wompi Sandbox y la pantalla cambiará inmediatamente a **«Aporte Verificado y Aprobado»**.

---

## 9. Limitaciones Pendientes antes de Aceptar Pagos Reales

Antes de recibir pagos reales con dinero de usuarios en producción:
1. **Completar vinculación en Wompi Colombia:** Aprobación de documentos legales y vinculación de cuenta bancaria.
2. **Conectar Base de Datos en Vercel:** Proveer `DATABASE_URL` (Neon o Vercel Postgres) y ejecutar la migración inicial.
3. **Configurar Webhook en Producción:** Asignar `https://www.kyvora.net.co/api/webhooks/wompi` en el panel de Wompi.
4. **Verificación de Notificaciones por Correo:** Configurar `RESEND_API_KEY` para que el donante y la administración reciban el comprobante digital por correo electrónico.
