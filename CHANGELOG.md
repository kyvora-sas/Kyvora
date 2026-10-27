# CHANGELOG - KYVORA

Todas las modificaciones notables realizadas al sitio oficial de KYVORA (`kyvora.net.co`) quedan registradas en este documento siguiendo las convenciones de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [2.0.0] - 2026-10-27

### Resumen General
Reconstrucción integral (visual, comercial, técnica y legal) del sitio oficial de KYVORA para su operación desde Colombia por parte de una persona natural independiente, preparado para despliegue en Vercel con integración segura de Wompi y cumplimiento de la normativa colombiana.

---

### Añadido (Added)
- **Sistema de Diseño Premium**:
  - Paleta técnica: Base negro profundo (`#030712`), acento azul eléctrico (`#0066FF`), cian de precisión (`#00F5FF`), superficies oscuras con bordes de baja opacidad.
  - Tipografías modernas con personalidad: *Space Grotesk* para titulares técnicos y *Inter* para lectura editorial.
  - Retículas digitales sutiles con gradientes radiales y microinteracciones de alta fidelidad.
  - Soporte completo para accesibilidad y consulta de medios `@media (prefers-reduced-motion: reduce)`.
- **Arquitectura de Navegación & Secciones**:
  - `Navbar`: Menú interactivo con navegación por teclado accesible, menú móvil lateral optimizado y botón de acción principal ("Iniciar Proyecto").
  - `Hero`: Titular original (*"Convertimos ideas complejas en software real."*), coordenadas técnicas de estudio independiente en Colombia y llamadas a la acción directas.
  - `Services`: Sección de 4 servicios clave (Desarrollo Web, Aplicaciones Web y Móviles, Sistemas de Software Personalizados, Automatización e Inteligencia Artificial) detallando qué se construye, qué necesidad resuelve, qué incluye, advertencias sobre dependencias y cómo cotizar.
  - `LabProjects`: Portafolio verificado de proyectos de laboratorio con capturas de pantalla reales (`Pulso`, `QuakeNet`, `Kyvora Studio`, `PulsAI`), fichas técnicas, repositorios y estados de desarrollo reales.
  - `PricingSection`: Modelo comercial mixto con precios base transparentes en pesos colombianos (COP) para servicios estandarizados y factores de alcance para proyectos a la medida.
  - `ProcessSection`: Metodología técnica de entrega en 6 fases claras y verificables (Descubrimiento, Alcance, Cotización, Desarrollo, Pruebas y Entrega, Soporte).
  - `DonateSection`: Interfaz interactiva de aportes voluntarios ("Donate Us") con selector de destino (Fondo General o Proyectos Específicos), chips de montos sugeridos ($20.000, $50.000, $100.000, $250.000 COP), campo de importe personalizado validado y resumen en tiempo real.
  - `ContactSection`: Formulario accesible con validación estricta, sanitización contra XSS, trampa anti-spam honeypot oculta, limitación de frecuencia (rate limit) y casilla obligatoria de consentimiento para tratamiento de datos personales conforme a la Ley 1581 de 2012.
  - `Footer`: Canales de contacto verificados (WhatsApp, correo, GitHub, Instagram), créditos legales para persona natural independiente en Colombia y enlace oficial a la Superintendencia de Industria y Comercio (SIC).
- **Módulo de Pagos & Aportes con Wompi Colombia**:
  - `src/lib/wompi.ts`: Módulo criptográfico del servidor para cálculo de firma de integridad SHA-256 (`reference + amount_in_cents + currency + integrity_secret`) y validación de checksum en webhooks (`properties + timestamp + events_secret`).
  - `src/lib/transactions-store.ts`: Almacén transaccional persistente con soporte para registros en memoria y archivo JSON local (`data/transactions.json`), con prevención de idempotencia y trazabilidad de eventos.
  - `src/app/api/donate/create-transaction/route.ts`: Endpoint seguro del servidor que valida montos mínimos y máximos en COP, genera referencias únicas de auditoría (`KYV-DON-...`) y devuelve la URL oficial del checkout de Wompi firmada.
  - `src/app/api/donate/status/route.ts`: Endpoint seguro para consulta de estado de transacciones en el servidor (evita confiar en parámetros manipulables del cliente).
  - `src/app/api/webhooks/wompi/route.ts`: Webhook receptor de eventos de Wompi con autenticación criptográfica, validación de moneda/monto, prevención de repetición y manejo de transiciones de estado (`APPROVED`, `DECLINED`, `VOIDED`, `ERROR`).
  - `src/app/donate/resultado/page.tsx`: Pantalla de retorno que consulta el estado real verificado por el servidor con diseño responsive y opciones de reintento o soporte.
- **Marco Legal Colombiano (8 Páginas dedicadas)**:
  - `src/app/legal/datos-personales/page.tsx`: Política de Tratamiento de Datos Personales (Ley 1581 de 2012 y Dec. 1377 de 2013).
  - `src/app/legal/privacidad/page.tsx`: Aviso de Privacidad comercial.
  - `src/app/legal/terminos/page.tsx`: Términos y Condiciones de Uso del Sitio Web.
  - `src/app/legal/contratacion/page.tsx`: Condiciones Generales de Contratación de Servicios de Software.
  - `src/app/legal/pagos-reversiones/page.tsx`: Condiciones de Pagos, Derecho de Retracto (Ley 1480 art. 47) y Reversión del Pago (Decreto 587 de 2016).
  - `src/app/legal/pqrs/page.tsx`: Sistema interactivo de Peticiones, Quejas, Reclamos y Solicitudes con generación de radicado y plazos legales (15 días hábiles).
  - `src/app/legal/cookies/page.tsx`: Política de Tecnologías y Cookies.
  - `src/app/legal/donate/page.tsx`: Condiciones Legales de los Aportes Voluntarios (aclarando expresamente que son mecenazgo para desarrollo independiente y no donaciones deducibles a entidades sin ánimo de lucro).
  - `src/components/LegalLayout.tsx`: Plantilla reutilizable con migas de pan, fecha de vigencia y advertencia sobre datos de la SIC.
- **SEO, Seguridad & Calidad**:
  - `src/app/robots.ts` y `src/app/sitemap.ts`: Generación dinámica de directivas de indexación y mapa del sitio para las 19 rutas de la aplicación.
  - `next.config.ts`: Cabeceras de seguridad HTTP completas (Content Security Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Strict-Transport-Security, Permissions-Policy).
  - `scripts/test-wompi-and-security.js`: Suite automatizada de 12 pruebas de seguridad, criptografía SHA-256 e idempotencia ejecutadas con `npm test`.

---

### Modificado (Changed)
- `package.json`:
  - Scripts actualizados para compatibilidad con Windows y Webpack estable (`"build": "next build --webpack"`, `"dev": "next dev --webpack"`).
  - Adición del script `"test": "node scripts/test-wompi-and-security.js"`.
  - Inclusión de dependencias clave (`sharp` para procesamiento de imágenes blur en Next.js, `resend`, `lucide-react`).
- `eslint.config.mjs`:
  - Configurado para excluir scripts utilitarios de testing de reglas de frontend y mantener un código libre de advertencias y errores (0 problemas en `npm run lint`).
- `src/app/globals.css`:
  - Rediseño completo con variables semánticas HSL, estilos de foco accesible y resets modernos.
- `src/app/layout.tsx`:
  - Metadatos completos Open Graph, Twitter Cards, Schema.org Organization y WebSite en formato JSON-LD, favicon y tipografías variables de Google Fonts.
- `src/app/page.tsx`:
  - Ensamblado armónico de todas las secciones comerciales, de laboratorio, aportes y contacto.

---

### Corregido (Fixed)
- Error de Turbopack en compilaciones de Next.js 16 sobre entornos Windows al resolver rutas de Tailwind CSS v4.
- Incompatibilidad de importaciones de iconos eliminados en versiones recientes de `lucide-react` (creación de `SocialIcons.tsx` con SVGs puros para GitHub e Instagram).
- Ausencia de módulo `sharp` durante la optimización de imágenes en el build estático.
- Corrección de advertencias de React 19 relativas a llamadas síncronas de `setState` dentro de `useEffect` en la página de resultados de Wompi.
