# KYVORA — Sitio Oficial (v2.0.0)

> Sitio web oficial y plataforma comercial de **KYVORA** (`https://www.kyvora.net.co/`), estudio de desarrollo de software independiente operado en Colombia. Diseñado con una identidad visual premium, arquitectura full-stack sobre Next.js, sistema de aportes voluntarios integrado con **Wompi Colombia** y un marco de cumplimiento legal adaptado a la legislación colombiana (Leyes 1581 de 2012, 1480 de 2011 y 2439 de 2024).

---

## 🚀 Tecnologías Principales

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Serverless API Routes)
- **Lenguaje**: [TypeScript 5](https://www.typescriptlang.org/) (Tipado estricto, 0 `any`)
- **Estilos & UI**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Modules nativos con tokens semánticos
- **Iconografía**: [Lucide React](https://lucide.dev/) + Componentes SVG optimizados
- **Procesamiento de Imágenes**: [Sharp](https://sharp.pixelplumbing.com/) (Next.js Image Optimization)
- **Pasarela de Pagos**: [Wompi Colombia](https://wompi.co/) (Checkout alojado seguro, firmas SHA-256 en servidor, webhooks idempotentes)
- **Envío de Correos**: [Resend](https://resend.com/) (Formulario de contacto con sanitización y anti-spam)
- **Calidad de Código**: ESLint 9 + Suite propia de pruebas de seguridad y criptografía

---

## 📋 Requisitos Previos

- **Node.js**: Versión `>= 18.18.0` (recomendado Node.js 20 LTS o superior)
- **Gestor de paquetes**: `npm` versión `>= 9.0.0`
- **Entorno de ejecución**: Compatible con Windows, macOS y Linux

---

## 🛠️ Instalación y Puesta en Marcha

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/kyvora-sas/web-kyvora.git
   cd web-kyvora
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Copia el archivo de ejemplo a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Edita `.env.local` con tus claves de Wompi (Sandbox inicialmente) y Resend.

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

5. **Ejecutar la suite de pruebas automatizadas**:
   ```bash
   npm test
   ```

6. **Verificar linting de código**:
   ```bash
   npm run lint
   ```

7. **Compilar para producción**:
   ```bash
   npm run build
   ```

8. **Probar el bundle de producción localmente**:
   ```bash
   npm run start
   ```

---

## 🔐 Variables de Entorno

| Variable | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Público | URL base del sitio web (`http://localhost:3000` o `https://www.kyvora.net.co`) | Sí |
| `NEXT_PUBLIC_WOMPI_ENVIRONMENT` | Público | Entorno de Wompi: `sandbox` o `production` | Sí |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Público | Llave pública de Wompi (`pub_test_...` o `pub_prod_...`) | Sí |
| `WOMPI_INTEGRITY_SECRET` | **Privado** | Secreto para cálculo del hash SHA-256 de integridad | Sí |
| `WOMPI_EVENTS_SECRET` | **Privado** | Secreto para autenticación de webhooks de Wompi | Sí |
| `RESEND_API_KEY` | **Privado** | Llave de API de Resend para entrega de formularios | Opcional (modo simulación activo si falta) |
| `CONTACT_NOTIFICATION_EMAIL` | **Privado** | Dirección a la que se envían las consultas comerciales | Opcional |

> ⚠️ **IMPORTANTE DE SEGURIDAD**: Las variables `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET` y `RESEND_API_KEY` son estrictamente del servidor. **NUNCA** las prefijes con `NEXT_PUBLIC_` ni las expongas en el repositorio.

---

## 🏛️ Arquitectura del Sistema

```
web-kyvora/
├── data/                       # Almacenamiento local persistente (transacciones)
│   └── transactions.json
├── docs/                       # Documentación técnica y legal detallada
│   ├── ARQUITECTURA_Y_DECISIONES.md
│   ├── GUIA_WOMPI_SANDBOX.md
│   ├── ENDPOINTS_Y_WEBHOOKS.md
│   ├── INVENTARIO_PAGINAS_Y_COMPONENTES.md
│   ├── MATRIZ_DE_PRUEBAS.md
│   ├── DATOS_LEGALES_PENDIENTES.md
│   └── ERRORES_CONOCIDOS_Y_RIESGOS.md
├── public/                     # Assets públicos estáticos e imágenes oficiales
│   └── img/
├── scripts/                    # Scripts de verificación y pruebas automatizadas
│   └── test-wompi-and-security.js
├── src/
│   ├── app/
│   │   ├── api/                # Endpoints de API seguros (Serverless)
│   │   │   ├── contact/
│   │   │   ├── donate/
│   │   │   │   ├── create-transaction/
│   │   │   │   └── status/
│   │   │   └── webhooks/
│   │   │       └── wompi/
│   │   ├── donate/resultado/   # Pantalla de confirmación de aportes Wompi
│   │   ├── legal/              # 8 Páginas de cumplimiento legal en Colombia
│   │   │   ├── contratacion/
│   │   │   ├── cookies/
│   │   │   ├── datos-personales/
│   │   │   ├── donate/
│   │   │   ├── pagos-reversiones/
│   │   │   ├── pqrs/
│   │   │   ├── privacidad/
│   │   │   └── terminos/
│   │   ├── globals.css         # Tokens de diseño, estilos globales y resets
│   │   ├── layout.tsx          # Estructura raíz, SEO, fuentes y metadatos
│   │   ├── page.tsx            # Página de inicio completa
│   │   ├── robots.ts           # Configuración dinámica de robots.txt
│   │   └── sitemap.ts          # Generador dinámico de sitemap.xml
│   ├── components/             # Componentes modulares y accesibles
│   │   ├── ContactSection.tsx
│   │   ├── DonateSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── LabProjects.tsx
│   │   ├── LegalLayout.tsx
│   │   ├── Navbar.tsx
│   │   ├── PricingSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── Services.tsx
│   │   └── SocialIcons.tsx
│   ├── config/                 # Constantes de negocio, precios y aspectos legales
│   │   ├── legal.ts
│   │   ├── pricing.ts
│   │   ├── projects.ts
│   │   ├── site.ts
│   │   └── wompi.ts
│   └── lib/                    # Lógica de negocio y utilitarios del servidor
│       ├── transactions-store.ts
│       └── wompi.ts
├── .env.example                # Plantilla de variables de entorno segura
├── CHANGELOG.md                # Registro histórico de versiones y cambios
├── next.config.ts              # Configuración de Next.js y cabeceras de seguridad
├── package.json
└── tsconfig.json
```

---

## 💳 Sistema de Aportes Voluntarios ("Donate Us") & Wompi

KYVORA no opera como entidad sin ánimo de lucro ni fundación, sino como un proyecto de desarrollo de software independiente liderado por una persona natural. Por esta razón:
- Los aportes se estructuran como **mecenazgo voluntario comercial** para financiar herramientas y proyectos de código abierto/laboratorio.
- **Flujo criptográfico**:
  1. El cliente selecciona un destino (General o Proyecto específico) y un monto en COP.
  2. El servidor valida que el monto esté entre `$10.000 COP` y `$50.000.000 COP`.
  3. El servidor genera una referencia única (`KYV-DON-...`) y calcula la **firma de integridad SHA-256** combinando `reference + amount_in_cents + currency + integrity_secret`.
  4. El servidor registra la transacción con estado inicial `PENDING` en el almacén de datos.
  5. El usuario es redirigido de forma segura al checkout alojado de Wompi.
  6. Al completarse o declinarse el pago, Wompi envía una notificación vía webhook con un checksum firmado a `/api/webhooks/wompi`.
  7. El servidor valida la autenticidad del webhook, comprueba que el importe coincida exactamente con lo registrado inicialmente, y actualiza el estado de forma **idempotente**.
  8. El frontend consulta el endpoint seguro `/api/donate/status` para confirmar el resultado real sin depender de parámetros manipulables en la URL.

---

## ⚖️ Marco Legal Colombiano

El sitio incluye 8 páginas legales redactadas de acuerdo con la legislación vigente en Colombia:
- **Ley 1581 de 2012 & Decreto 1377 de 2013**: Tratamiento y protección de datos personales. Casilla obligatoria de autorización expresa en formularios.
- **Ley 1480 de 2011 (Estatuto del Consumidor)**:
  - Información comercial transparente y veraz.
  - Derecho de Retracto (Art. 47) y sus excepciones legítimas en servicios totalmente ejecutados o software a la medida personalizado.
  - Reversión del Pago (Decreto 587 de 2016) para fraudes o transacciones no solicitadas.
- **Ley 2439 de 2024**: Regulaciones actualizadas de comercio electrónico.
- **PQRS**: Formulario interactivo con generación de radicado y compromiso de respuesta en 15 días hábiles conforme al Código de Procedimiento Administrativo.
- **Enlace visible a la SIC**: Acceso directo y permanente al portal de la Superintendencia de Industria y Comercio (`https://www.sic.gov.co/`).

---

## 🚢 Despliegue en Vercel

1. **Subir el repositorio a GitHub**:
   Asegúrate de que los cambios estén confirmados en la rama principal.

2. **Crear el proyecto en Vercel**:
   - Conecta tu cuenta de Vercel con el repositorio `web-kyvora`.
   - Vercel detectará automáticamente Next.js.
   - En la sección **Build Command**, confirma que utilice `npm run build`.

3. **Configurar las Variables de Entorno en el panel de Vercel**:
   En `Settings > Environment Variables`, añade:
   - `NEXT_PUBLIC_SITE_URL`: `https://www.kyvora.net.co`
   - `NEXT_PUBLIC_WOMPI_ENVIRONMENT`: `production` (o `sandbox` para pruebas previas)
   - `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`: Tu clave pública de Wompi.
   - `WOMPI_INTEGRITY_SECRET`: Tu secreto de integridad de Wompi.
   - `WOMPI_EVENTS_SECRET`: Tu secreto de eventos de Wompi.
   - `RESEND_API_KEY`: Tu clave de API de Resend.
   - `CONTACT_NOTIFICATION_EMAIL`: `kyvorasas@gmail.com`

4. **Configurar Webhook en Wompi**:
   En el panel de Wompi (Mis Comercios > Desarrolladores), configura la URL de eventos:
   ```
   https://www.kyvora.net.co/api/webhooks/wompi
   ```

5. **Configurar Dominio Personalizado**:
   En el panel de Vercel (`Domains`), añade `kyvora.net.co` y `www.kyvora.net.co` y actualiza los registros DNS tipo CNAME/A en tu proveedor de dominio.

---

## 📄 Licencia y Derechos

© 2026 KYVORA. Todos los derechos reservados. Desarrollado y operado por Persona Natural Independiente en Colombia.
