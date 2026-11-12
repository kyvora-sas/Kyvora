# KYVORA — Checklist Operativo de Resend, Dominio y Producción

Estado documentado de forma transparente sin inventar credenciales ni registros externos.

## 1. Remitente de Correo (`Resend`) en `/api/contact`

Actualmente `src/app/api/contact/route.ts` configura:

- Destinatario por defecto: `process.env.CONTACT_NOTIFICATION_EMAIL || "kyvorasas@gmail.com"`
- Remitente por defecto: `process.env.CONTACT_FROM_EMAIL || "KYVORA Contacto <onboarding@resend.dev>"`

Para migrar el remitente al dominio propio `kyvora.net.co` y evitar restricciones del remitente sandbox de Resend:

1. Ingresar al panel de **Resend -> Domains** y agregar el dominio `kyvora.net.co` (o un subdominio dedicado como `mail.kyvora.net.co`).
2. Publicar en el DNS autoritativo de `kyvora.net.co` los registros solicitados por Resend:
   - Registro **DKIM** (`TXT`) generado por Resend.
   - Registro **SPF** (`TXT`) o subdominio de envío autorizado (`MX`/`TXT`).
   - Registro **DMARC** recomendado (`TXT` en `_dmarc.kyvora.net.co`).
3. Verificar en Resend hasta obtener estado **Verified**.
4. Configurar en **Vercel -> Project Settings -> Environment Variables**:
   - `RESEND_API_KEY` (clave activa de producción)
   - `CONTACT_FROM_EMAIL` = `"KYVORA <contacto@kyvora.net.co>"` (o dirección bajo el dominio verificado)
   - `CONTACT_NOTIFICATION_EMAIL` = `"kyvorasas@gmail.com"` (o bandeja corporativa deseada)

## 2. Dominio Canónico (`www.kyvora.net.co`) y Vercel

- El proyecto declara `metadataBase: new URL("https://www.kyvora.net.co")` en `src/app/layout.tsx` y `redirects()` permanente en `next.config.ts` desde host `kyvora.net.co` hacia `https://www.kyvora.net.co/:path*`.
- En Vercel -> Domains, asegurar ambos dominios agregados (`www.kyvora.net.co` como principal y `kyvora.net.co` redirigiendo al principal) con certificado TLS activo.
- Nota: `vercel.json` actual solo define `crons`; no existe conflicto con `redirects()` de `next.config.ts`.

## 3. Variables Críticas Antes de Publicar en Producción

- **PostgreSQL / Wompi:** Verificar `POSTGRES_URL` (o `DATABASE_URL`), `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET` y `WOMPI_EVENTS_SECRET` acordes al entorno objetivo.
- **Content-Security-Policy:** `next.config.ts` omite `upgrade-insecure-requests` fuera de `VERCEL_ENV === "production"` para mantener funcionalidad íntegra en pruebas locales HTTP, y elimina `'unsafe-eval'` en builds de producción (`NODE_ENV === "production"`).

