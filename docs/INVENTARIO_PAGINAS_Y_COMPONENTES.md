# KYVORA — Inventario de Páginas, Rutas y Componentes

Este inventario documenta la totalidad de la estructura del frontend, páginas estáticas y dinámicas, y componentes modulares implementados en el proyecto.

---

## 1. Inventario de Rutas y Páginas

| Ruta URL | Tipo | Archivo Fuente | Descripción |
|---|---|---|---|
| `/` | Estática (SSG) | `src/app/page.tsx` | Página principal que integra Hero, Servicios, Laboratorio, Precios, Proceso, Aportes y Contacto. |
| `/donate/resultado` | Estática con cliente | `src/app/donate/resultado/page.tsx` | Pantalla de retorno tras interactuar con Wompi; consulta segura del estado transaccional al servidor. |
| `/legal/datos-personales` | Estática (SSG) | `src/app/legal/datos-personales/page.tsx` | Política integral de Tratamiento de Datos Personales conforme a la Ley 1581 de 2012 y Decreto 1377 de 2013. |
| `/legal/privacidad` | Estática (SSG) | `src/app/legal/privacidad/page.tsx` | Aviso de Privacidad comercial para clientes, prospectos y donantes. |
| `/legal/terminos` | Estática (SSG) | `src/app/legal/terminos/page.tsx` | Términos y Condiciones generales de navegación, propiedad intelectual y uso del sitio web. |
| `/legal/contratacion` | Estática (SSG) | `src/app/legal/contratacion/page.tsx` | Condiciones Generales de Contratación de Servicios de Software, hitos, entregables y garantías. |
| `/legal/pagos-reversiones` | Estática (SSG) | `src/app/legal/pagos-reversiones/page.tsx` | Política de Pagos, Derecho de Retracto (Ley 1480 art. 47) y Reversión del Pago (Decreto 587 de 2016). |
| `/legal/pqrs` | Estática con cliente | `src/app/legal/pqrs/page.tsx` | Módulo interactivo para radicación de Peticiones, Quejas, Reclamos y Solicitudes con radicado legal. |
| `/legal/cookies` | Estática (SSG) | `src/app/legal/cookies/page.tsx` | Política sobre uso de cookies técnicas y analíticas respetuosas de la privacidad. |
| `/legal/donate` | Estática (SSG) | `src/app/legal/donate/page.tsx` | Condiciones específicas del sistema de aportes voluntarios ("Donate Us") y régimen tributario. |
| `/robots.txt` | Dinámica / SEO | `src/app/robots.ts` | Reglas de rastreo e indexación para Googlebot y otros motores de búsqueda. |
| `/sitemap.xml` | Dinámica / SEO | `src/app/sitemap.ts` | Mapa del sitio con las 10 URLs canónicas indexables y prioridades de rastreo. |

---

## 2. Inventario de Endpoints de Servidor (API Routes)

| Endpoint | Método | Archivo Fuente | Propósito |
|---|---|---|---|
| `/api/donate/create-transaction` | POST | `src/app/api/donate/create-transaction/route.ts` | Valida el aporte, firma la transacción con SHA-256 y genera el enlace oficial a Wompi. |
| `/api/donate/status` | GET | `src/app/api/donate/status/route.ts` | Consulta del estado seguro en el almacén del servidor. |
| `/api/webhooks/wompi` | POST | `src/app/api/webhooks/wompi/route.ts` | Receptor de eventos Wompi con verificación criptográfica de checksum e idempotencia. |
| `/api/contact` | POST | `src/app/api/contact/route.ts` | Procesa consultas comerciales con filtro anti-spam honeypot, sanitización y entrega por correo. |

---

## 3. Inventario de Componentes de Interfaz (`src/components/`)

| Componente | Archivo | Responsabilidad Principal |
|---|---|---|
| `Navbar` | `Navbar.tsx` | Barra de navegación superior responsive con logotipo oficial, enlaces ancla, menú móvil animado y navegación por teclado. |
| `Hero` | `Hero.tsx` | Portada de alto impacto visual con titular original, propuesta de valor concreta, coordenadas técnicas y CTAs directos. |
| `Services` | `Services.tsx` | Desglose modular de las 4 líneas de servicio de KYVORA con tarjetas interactivas expandibles, alcances y advertencias de dependencias. |
| `LabProjects` | `LabProjects.tsx` | Vitrina de proyectos reales de laboratorio (`Pulso`, `QuakeNet`, `Kyvora Studio`, `PulsAI`) con capturas de pantalla oficiales, insignias de estado y stacks técnicos. |
| `PricingSection` | `PricingSection.tsx` | Modelo comercial mixto con precios base en COP para servicios estandarizados y factores de alcance para proyectos personalizados. |
| `ProcessSection` | `ProcessSection.tsx` | Diagrama interactivo de la metodología de entrega de software en 6 fases secuenciales. |
| `DonateSection` | `DonateSection.tsx` | Widget de aportes voluntarios ("Donate Us") con selector de destino, chips de montos predefinidos, cálculo dinámico y conexión a Wompi. |
| `ContactSection` | `ContactSection.tsx` | Formulario accesible con validación en vivo, prevención de spam y consentimiento explícito de tratamiento de datos personales. |
| `Footer` | `Footer.tsx` | Pie de página con enlaces institucionales, canales de contacto verificados (WhatsApp, Email, GitHub, Instagram) y enlace a la SIC. |
| `LegalLayout` | `LegalLayout.tsx` | Estructura contenedora para todas las páginas legales, con barra lateral de navegación rápida, migas de pan y fecha de última actualización. |
| `SocialIcons` | `SocialIcons.tsx` | Componentes SVG autónomos y accesibles para iconos de GitHub e Instagram sin dependencias externas. |

---

## 4. Módulos de Configuración y Utilidades (`src/config/` y `src/lib/`)

- `src/config/site.ts`: Metadatos generales, canales de contacto verificados y menús de navegación.
- `src/config/pricing.ts`: Precios base en COP, factores de cálculo de cotización y rangos de presupuesto.
- `src/config/projects.ts`: Ficha técnica de cada proyecto de laboratorio con URLs y tecnologías verificadas.
- `src/config/legal.ts`: Constantes normativas colombianas, citas de estatutos y marcadores de datos pendientes del propietario.
- `src/config/wompi.ts`: URLs de checkout por entorno, montos de aportes sugeridos y destinos de recaudación.
- `src/lib/wompi.ts`: Funciones criptográficas de cálculo de firma SHA-256 y verificación de checksum de webhooks.
- `src/lib/transactions-store.ts`: Almacén transaccional persistente con registro local en `data/transactions.json` y prevención de duplicados.
