import type { ResourceArticle } from "./types";

/**
 * Artículos editoriales publicados en /recursos.
 * Regla editorial: solamente incluir piezas revisadas con valor práctico real,
 * sin cifras o estadísticas inventadas y diferenciando criterios de hechos verificables.
 */
export const resourceArticles: ResourceArticle[] = [
  {
    id: "website-cost-colombia",
    category: "costos",
    published: true,
    publishedAt: "2026-11-11",
    updatedAt: "2026-11-11",
    readingMinutes: 6,
    authorName: "KYVORA Studio",
    relatedServiceValue: "Landing Page / Web",
    es: {
      slug: "cuanto-cuesta-desarrollar-una-pagina-web-en-colombia",
      title: "¿Cuánto cuesta desarrollar una página web en Colombia?",
      seoTitle: "Cuánto cuesta desarrollar una página web en Colombia (Guía técnica)",
      metaDescription:
        "Guía transparente sobre los factores que definen el costo de una página web en Colombia, gastos externos reales (dominio, hosting, pasarelas) y rangos referenciales.",
      excerpt:
        "Qué determina realmente el valor de un proyecto web en Colombia, qué costos externos recaen sobre el negocio y cómo evitar presupuestos ambiguos.",
      categoryLabel: "Costos y Alcance",
      readingTimeLabel: "6 min de lectura",
      keywords: [
        "cuánto cuesta una página web en Colombia",
        "precio desarrollo web Colombia",
        "cotización landing page Colombia",
        "desarrollo web a medida COP",
      ],
      ctaTitle: "¿Quieres estimar el alcance real de tu sitio o aplicación?",
      ctaDescription:
        "Cuéntanos qué objetivo comercial u operativo necesitas resolver y preparamos una propuesta con entregables verificables y sin costos ocultos.",
      ctaButtonLabel: "Cotizar sitio web con KYVORA",
      blocks: [
        {
          type: "paragraph",
          text: "Preguntar cuánto cuesta desarrollar una página web en Colombia suele producir respuestas contradictorias: desde ofertas de unos pocos cientos de miles de pesos hasta cotizaciones empresariales de varios millones. La diferencia casi nunca está en un capricho de tarifa, sino en el tipo de ingeniería, el alcance funcional, las integraciones externas y el grado de personalización que el proyecto realmente exige.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Hecho vs. criterio de mercado",
          text: "En Colombia no existe una tarifa oficial regulada para desarrollo de software. Los valores de referencia que mostramos aquí corresponden a los rangos públicos base documentados por KYVORA y a la estructura técnica habitual del mercado, diferenciando claramente la inversión de desarrollo frente a los costos de terceros (dominio, hosting o comisiones transaccionales).",
        },
        {
          type: "heading",
          level: 2,
          id: "rangos-referencia",
          text: "1. Rangos según el tipo de proyecto web",
        },
        {
          type: "paragraph",
          text: "Antes de comparar precios aislados, conviene ubicar el proyecto en su categoría arquitectónica correcta. No cuesta ni tarda lo mismo construir una presencia comercial rápida que desarrollar una plataforma transaccional o con lógica de negocio propia.",
        },
        {
          type: "table",
          caption: "Comparativa de referencia entre categorías web habituales en KYVORA Studio (valores base en COP)",
          headers: ["Tipo de solución", "Referencia base en KYVORA", "Tiempo estimado", "Qué incluye habitualmente"],
          rows: [
            [
              "Landing Page Profesional",
              "Desde $850.000 COP",
              "5 a 10 días hábiles",
              "Diseño responsive personalizado, hasta 5 secciones estructuradas, formulario con validación y envío de correo, SEO base y Open Graph.",
            ],
            [
              "Aplicación Web / MVP Inicial",
              "Desde $2.800.000 COP",
              "3 a 6 semanas",
              "Frontend interactivo (Next.js / React), autenticación de usuarios, base de datos relacional PostgreSQL, panel administrativo y pruebas críticas.",
            ],
            [
              "Sistema a Medida o Integración Compleja",
              "Cotización según especificación",
              "Definido tras diagnóstico",
              "Levantamiento de arquitectura, APIs propias, flujos de roles avanzados, pasarelas de pago o automatización operativa conectada.",
            ],
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "variables-que-mueven-el-costo",
          text: "2. Cinco variables técnicas que alteran el presupuesto",
        },
        {
          type: "list",
          ordered: true,
          items: [
            {
              title: "Arquitectura de datos y autenticación",
              text: "Un sitio informativo no necesita base de datos ni sesiones seguras. En cuanto requieres cuentas de usuario, permisos por rol o historial privado, entra en escena modelado relacional, validación en servidor y protección contra abusos.",
            },
            {
              title: "Integraciones con terceros y pasarelas de pago",
              text: "Conectar WhatsApp con un enlace directo toma minutos; integrar pagos verificables con Wompi (firma de integridad en backend, webhooks firmados y conciliación de estados en base de datos) exige ingeniería de seguridad y pruebas explícitas.",
            },
            {
              title: "Preparación real de contenidos e identidad visual",
              text: "Cuando el negocio ya cuenta con textos aprobados, fotografía propia y logotipo definido, el desarrollo fluye sin fricción. Si es necesario redactar, estructurar la propuesta comercial o producir recursos gráficos desde cero, el esfuerzo aumenta.",
            },
            {
              title: "Soporte multilingüe y estrategia de contenidos",
              text: "Publicar en español e inglés con rutas canónicas limpias, metadatos diferenciados y coherencia legal duplicará la revisión editorial y las pruebas de interfaz frente a un sitio en un solo idioma.",
            },
            {
              title: "Rendimiento, SEO técnico y cumplimiento normativo",
              text: "En Colombia, cualquier formulario o flujo de pago debe respaldarse con aviso de privacidad, política de tratamiento de datos (Ley 1581 de 2012) y canales claros de atención o PQRS.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "costos-externos-recurrentes",
          text: "3. Costos externos que toda cotización transparente debe separar",
        },
        {
          type: "paragraph",
          text: "Un error frecuente al contratar una página web es asumir que el pago único al desarrollador cubre todos los servicios de por vida. Por transparencia y control del cliente, la propiedad del dominio y las cuentas de infraestructura deben permanecer a nombre del negocio o facturarse de forma desglosada.",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Dominio (.co o .com)",
              text: "Renovación anual ante el registrador correspondiente. Mantenerlo en una cuenta propia evita dependencias operativas si cambias de proveedor.",
            },
            {
              title: "Hosting o infraestructura cloud",
              text: "Sitios estáticos o ligeros pueden operar en planes iniciales gratuitos o económicos según tráfico y uso comercial; sistemas con base de datos persistente, colas o alto volumen requieren planes pagos en proveedores cloud.",
            },
            {
              title: "Servicios de correo transaccional, mapas o modelos de IA",
              text: "Proveedores de envío de correos (como Resend), APIs externas o consumo de modelos de lenguaje facturan por volumen o uso mensual directo al titular.",
            },
            {
              title: "Comisiones de pasarela de pago",
              text: "Si recaudas dinero en línea, el procesador financiero descuenta una comisión y retenciones aplicables por cada transacción aprobada, independiente del costo del software.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "como-evaluar-propuesta",
          text: "4. Qué exigir antes de aprobar una propuesta web",
        },
        {
          type: "callout",
          tone: "decision",
          title: "Lista mínima de control para evitar sobrecostos",
          text: "Solicita por escrito: (1) qué secciones o módulos exactos están incluidos, (2) qué queda expresamente excluido en la primera entrega, (3) si recibes el código fuente y control de tus cuentas de dominio/hosting, y (4) plazo estimado por hitos verificables junto con garantía técnica posterior al lanzamiento.",
        },
        {
          type: "paragraph",
          text: "En resumen, pagar menos por una plantilla pesada e imposible de escalar suele salir costoso cuando el negocio crece. Al mismo tiempo, tampoco tiene sentido pagar por una arquitectura sobredimensionada si una landing page bien diseñada y veloz cubre exactamente tu etapa actual.",
        },
      ],
    },
    en: {
      slug: "how-much-does-a-website-cost-in-colombia",
      title: "How much does it cost to develop a website in Colombia?",
      seoTitle: "Website Development Cost in Colombia — Transparent Scope Guide",
      metaDescription:
        "Clear breakdown of what drives website development costs in Colombia, separate recurring third-party expenses (domain, hosting, gateways), and reference project scopes.",
      excerpt:
        "What actually shapes web development pricing in Colombia, which recurring external fees stay outside the build quote, and how to compare proposals fairly.",
      categoryLabel: "Pricing & Scope",
      readingTimeLabel: "6 min read",
      keywords: [
        "website development cost Colombia",
        "custom web pricing COP USD",
        "landing page cost Colombia",
        "MVP development budget",
      ],
      ctaTitle: "Need a clear estimate for your site or web app?",
      ctaDescription:
        "Share your business goal and functional scope. We prepare a transparent proposal with concrete deliverables and zero hidden dependencies.",
      ctaButtonLabel: "Request a website quote",
      blocks: [
        {
          type: "paragraph",
          text: "Asking how much a website costs in Colombia frequently yields wildly different numbers: from barebones template setups to multi-million-peso enterprise quotes. The gap rarely comes down to arbitrary pricing alone; it usually reflects engineering rigor, custom interactivity, external integrations, and how much content is already ready.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Reference facts vs. market context",
          text: "Colombia does not enforce fixed statutory rates for software engineering. The reference figures below reflect KYVORA's own published starting scopes alongside standard technical cost drivers, explicitly separating engineering fees from third-party expenses such as domains, hosting, or payment gateway commissions.",
        },
        {
          type: "heading",
          level: 2,
          id: "reference-tiers",
          text: "1. Typical reference ranges by project category",
        },
        {
          type: "paragraph",
          text: "Before comparing standalone quotes, classify what you are actually building. An informational landing page carries a completely different engineering footprint than a product with user accounts and a relational database.",
        },
        {
          type: "table",
          caption: "Reference comparison across common KYVORA Studio scopes (starting figures in COP)",
          headers: ["Solution Type", "KYVORA Reference Starting Point", "Typical Timeline", "Usual Scope Included"],
          rows: [
            [
              "Professional Landing Page",
              "From $850,000 COP",
              "5 to 10 business days",
              "Custom responsive layout, up to 5 structured sections, validated contact form with email routing, base SEO metadata, and Open Graph tags.",
            ],
            [
              "Web Application / Initial MVP",
              "From $2,800,000 COP",
              "3 to 6 weeks",
              "Interactive frontend (Next.js / React), user authentication, PostgreSQL database modeling, management dashboard, and critical flow testing.",
            ],
            [
              "Custom Software System",
              "Quoted per technical spec",
              "Scoped after discovery",
              "Bespoke architecture, multi-role workflows, custom APIs, payment integrations, or operational process automation.",
            ],
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "cost-drivers",
          text: "2. Five technical factors that change the budget",
        },
        {
          type: "list",
          ordered: true,
          items: [
            {
              title: "Data modeling and authentication",
              text: "An informational site requires neither user accounts nor a persistent database. Once roles, private dashboards, or audit logs enter the picture, security modeling and backend validation become essential.",
            },
            {
              title: "Third-party integrations and online payments",
              text: "Adding a direct WhatsApp link takes minutes. Integrating verified payment flows—such as server-side signatures, webhook validation, and idempotent transaction status tracking—demands dedicated backend engineering.",
            },
            {
              title: "Readiness of copy and brand assets",
              text: "When approved copy, product photography, and visual branding are ready from day one, execution stays lean. Creating structure and copy from scratch adds strategy and editorial hours.",
            },
            {
              title: "Multilingual support and content operations",
              text: "Delivering Spanish and English versions with proper canonical URLs, accurate translations, and synchronized legal notices doubles QA and editorial review effort.",
            },
            {
              title: "Performance, technical SEO, and legal compliance",
              text: "Operating legitimately in Colombia requires clear privacy disclosures, Law 1581 data-processing consent on forms, and accessible support channels.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "external-costs",
          text: "3. Third-party costs every honest proposal separates",
        },
        {
          type: "paragraph",
          text: "One common mistake when commissioning a website is assuming a one-time build fee pays for external infrastructure forever. Keeping domain ownership and cloud accounts under the client's direct control prevents painful vendor lock-in.",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Domain registration (.co / .com)",
              text: "Renewed yearly with the domain registrar under the client's legal ownership.",
            },
            {
              title: "Hosting and managed cloud infrastructure",
              text: "Lightweight marketing sites can start on entry cloud tiers, whereas database-backed apps or heavy traffic workloads carry ongoing monthly hosting charges.",
            },
            {
              title: "Transactional email, maps, or AI API tokens",
              text: "Services like Resend or external AI APIs bill directly according to message volume or token consumption.",
            },
            {
              title: "Payment processor transaction fees",
              text: "Payment gateways charge per-transaction commissions and applicable local withholdings separate from software build costs.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "proposal-checklist",
          text: "4. What to confirm before signing off on a web quote",
        },
        {
          type: "callout",
          tone: "decision",
          title: "Practical pre-contract checklist",
          text: "Confirm in writing: (1) exact sections or modules delivered, (2) explicit exclusions in v1, (3) source-code ownership and direct control of domain/hosting accounts, and (4) milestone delivery schedule plus post-launch technical warranty.",
        },
        {
          type: "paragraph",
          text: "Bottom line: choosing the cheapest fragile template often costs more once you outgrow it—yet over-engineering a complex custom stack when a fast, well-structured landing page solves your current goal is equally wasteful.",
        },
      ],
    },
  },
  {
    id: "website-vs-webapp",
    category: "arquitectura",
    published: true,
    publishedAt: "2026-11-11",
    updatedAt: "2026-11-11",
    readingMinutes: 5,
    authorName: "KYVORA Studio",
    relatedServiceValue: "Aplicación Web/Móvil",
    es: {
      slug: "pagina-web-vs-aplicacion-web-diferencias",
      title: "Página web vs. aplicación web: diferencias y cuándo necesitas cada una",
      seoTitle: "Página web vs. Aplicación web: cuándo elegir cada arquitectura",
      metaDescription:
        "Aprende a distinguir una página web informativa de una aplicación web con usuarios y base de datos para no invertir de más ni quedarte corto técnicamente.",
      excerpt:
        "Una tabla práctica y criterios concretos para decidir si tu negocio necesita un sitio comercial veloz o una aplicación web interactiva con lógica propia.",
      categoryLabel: "Arquitectura de Producto",
      readingTimeLabel: "5 min de lectura",
      keywords: [
        "página web vs aplicación web",
        "diferencia entre sitio web y web app",
        "cuándo hacer una aplicación web",
        "arquitectura MVP web",
      ],
      ctaTitle: "¿No tienes claro qué arquitectura encaja con tu idea?",
      ctaDescription:
        "Revisamos tu flujo operativo contigo y definimos si conviene arrancar por una web de conversión o un MVP funcional por fases.",
      ctaButtonLabel: "Consultar arquitectura con KYVORA",
      blocks: [
        {
          type: "paragraph",
          text: "Muchos proyectos arrancan con el nombre equivocado: clientes que piden una «página web sencilla» cuando en realidad necesitan gestión de inventario con usuarios, y emprendedores que piden una «aplicación completa» cuando primero deberían validar demanda con una landing enfocada en conversión.",
        },
        {
          type: "heading",
          level: 2,
          id: "diferencia-fundamental",
          text: "1. La diferencia central: comunicar frente a operar",
        },
        {
          type: "paragraph",
          text: "En términos simples, una página web (o sitio comercial) existe para presentar información, generar confianza, posicionar en buscadores y convertir visitantes en contactos o ventas directas. Una aplicación web existe para que las personas ejecuten tareas, guarden estado propio en una base de datos y operen flujos de negocio.",
        },
        {
          type: "table",
          caption: "Comparativa técnica y operativa: Página Web vs. Aplicación Web",
          headers: ["Criterio", "Página Web / Landing Comercial", "Aplicación Web (Web App / MVP)"],
          rows: [
            [
              "Objetivo principal",
              "Informar, posicionar en Google y captar leads o consultas.",
              "Permitir operación interactiva, gestión de registros y flujos de usuario.",
            ],
            [
              "Autenticación y roles",
              "No requiere cuentas de usuario ni control de acceso privado.",
              "Incluye inicio de sesión, sesiones seguras y permisos por rol (admin, cliente, operador).",
            ],
            [
              "Estado y base de datos",
              "Contenido mayormente uniforme; a lo sumo un formulario de contacto.",
              "Lectura/escritura constante sobre base de datos relacional (ej. PostgreSQL).",
            ],
            [
              "Velocidad y SEO",
              "Prioridad máxima: páginas indexables y carga inmediata.",
              "Las rutas internas suelen ser privadas; el SEO vive en las páginas públicas de entrada.",
            ],
            [
              "Costo e inversión",
              "Menor alcance inicial y mantenimiento reducido.",
              "Mayor ingeniería por validaciones, seguridad, pruebas e infraestructura continua.",
            ],
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "cuando-basta-pagina-web",
          text: "2. Señales de que hoy te basta una página web bien hecha",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Tu prioridad es explicar servicios y captar clientes",
              text: "Si los visitantes leen tu propuesta y luego hablan contigo por formulario o WhatsApp, no necesitas un panel autenticado complejo.",
            },
            {
              title: "Aún estás validando interés del mercado",
              text: "Publicar primero una landing clara permite medir consultas reales antes de programar meses de lógica interna.",
            },
            {
              title: "Los procesos internos aún se resuelven sin portal de cliente",
              text: "No tiene sentido construir cuentas de usuario si todavía nadie las necesita para operar.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "cuando-necesitas-webapp",
          text: "3. Cuándo sí debes construir una aplicación web",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Cada usuario ve datos distintos",
              text: "Portales de clientes, paneles administrativos, seguimiento de pedidos o tableros de reportes por empresa.",
            },
            {
              title: "El negocio ya sufre con hojas de cálculo desbordadas",
              text: "Cuando múltiples personas editan el mismo archivo sin historial, con errores de fórmulas o pérdida de trazabilidad.",
            },
            {
              title: "Necesitas reglas de negocio y automatizaciones en tiempo real",
              text: "Cálculo automático de estados, alertas, webhooks de pago o auditoría segura de acciones.",
            },
          ],
        },
        {
          type: "callout",
          tone: "decision",
          title: "La vía intermedia inteligente: crecer por etapas sobre el mismo código",
          text: "En stacks modernos como Next.js con TypeScript y PostgreSQL no tienes que desechar tu sitio comercial para evolucionar. Puedes lanzar una presencia pública sólida en semana 1–2 e incorporar módulos autenticados o APIs en fases posteriores sin reconstruir todo desde cero.",
        },
      ],
    },
    en: {
      slug: "website-vs-web-application-differences",
      title: "Website vs. Web Application: differences and when you need each",
      seoTitle: "Website vs Web Application — Choosing the Right Architecture",
      metaDescription:
        "Understand the architectural and budget differences between a commercial website and an interactive web application so you neither over-build nor hit a wall early.",
      excerpt:
        "A side-by-side decision table and practical signals to decide between a fast marketing website and an authenticated web application.",
      categoryLabel: "Product Architecture",
      readingTimeLabel: "5 min read",
      keywords: [
        "website vs web application",
        "difference between website and web app",
        "when to build an MVP web app",
        "Next.js architecture decision",
      ],
      ctaTitle: "Unsure which architecture matches your current stage?",
      ctaDescription:
        "We review your operational workflow together and recommend whether starting with a lean conversion site or a phased MVP makes the most sense.",
      ctaButtonLabel: "Discuss architecture with KYVORA",
      blocks: [
        {
          type: "paragraph",
          text: "Many digital projects start under the wrong label: teams ask for a 'simple website' when they actually need multi-user inventory workflows, while founders ask for a 'full application' before validating demand with a focused commercial landing page.",
        },
        {
          type: "heading",
          level: 2,
          id: "core-distinction",
          text: "1. Core distinction: communicating vs. operating",
        },
        {
          type: "paragraph",
          text: "A commercial website exists primarily to explain value clearly, build credibility, rank on search engines, and convert visitors into inquiries or leads. A web application exists so users can log in, perform interactive tasks, persist records in a database, and run real operational workflows.",
        },
        {
          type: "table",
          caption: "Architectural and operational comparison: Website vs. Web Application",
          headers: ["Dimension", "Marketing Website / Landing", "Web Application (Web App / MVP)"],
          rows: [
            [
              "Primary job",
              "Educate visitors, rank on Google, and capture leads.",
              "Power interactive workflows, state changes, and operational tasks.",
            ],
            [
              "Authentication & roles",
              "None needed for public visitors.",
              "User accounts, session security, and role-based permissions.",
            ],
            [
              "Database persistence",
              "Largely static or CMS-driven content plus contact routing.",
              "Continuous read/write operations on a relational database (e.g., PostgreSQL).",
            ],
            [
              "SEO emphasis",
              "Critical across every public URL.",
              "Private app screens stay behind login; SEO lives on public entry pages.",
            ],
            [
              "Build & upkeep footprint",
              "Smaller initial scope and lower operational overhead.",
              "Higher engineering requirements for validation, security, tests, and hosting.",
            ],
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "when-website-wins",
          text: "2. Signals a well-crafted website is all you need today",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Visitors read your offer and reach out directly",
              text: "If your commercial funnel ends in a WhatsApp chat, call, or contact form, a private dashboard adds cost without return.",
            },
            {
              title: "You are still validating demand",
              text: "Shipping a fast landing page measures real market interest before investing weeks into backend rules.",
            },
            {
              title: "No user-specific data needs to be saved yet",
              text: "Avoid building login flows prematurely if customers do not yet require ongoing account access.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "when-webapp-wins",
          text: "3. When you genuinely need a web application",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Different users must see different records",
              text: "Client portals, admin dashboards, order trackers, or multi-branch operational tools.",
            },
            {
              title: "Spreadsheets are causing errors and bottlenecks",
              text: "When multiple staff overwrite shared files or lose audit trails across manual sheets.",
            },
            {
              title: "You depend on server-side rules and real-time integrations",
              text: "Status automation, signed payment webhooks, role validation, and reliable audit logs.",
            },
          ],
        },
        {
          type: "callout",
          tone: "decision",
          title: "Phased growth without throwing code away",
          text: "Modern TypeScript stacks like Next.js paired with PostgreSQL let you launch a fast public site first and progressively add authenticated application modules later on the same foundation.",
        },
      ],
    },
  },
  {
    id: "ai-with-purpose",
    category: "ia-automatizacion",
    published: true,
    publishedAt: "2026-11-11",
    updatedAt: "2026-11-11",
    readingMinutes: 6,
    authorName: "KYVORA Lab & Studio",
    relatedServiceValue: "Automatización / IA",
    es: {
      slug: "como-integrar-ia-en-tu-negocio-con-criterio",
      title: "Cómo integrar inteligencia artificial en un negocio sin utilizarla innecesariamente",
      seoTitle: "Cómo integrar IA en un negocio con criterio técnico (y cuándo evitarla)",
      metaDescription:
        "Marco práctico para decidir cuándo usar inteligencia artificial real, cuándo basta automatización determinista y cómo cuidar costos, privacidad y confiabilidad.",
      excerpt:
        "No todo problema operativo requiere un modelo de lenguaje. Aprende cuándo la IA suma eficiencia real, cuándo conviene código determinista y cómo controlar riesgos.",
      categoryLabel: "IA y Automatización",
      readingTimeLabel: "6 min de lectura",
      keywords: [
        "integrar inteligencia artificial en negocio",
        "cuándo usar IA y cuándo no",
        "automatización de procesos vs IA",
        "modelos locales Ollama privacidad",
      ],
      ctaTitle: "¿Evaluando automatizar tareas o integrar modelos de lenguaje?",
      ctaDescription:
        "Analizamos tu proceso paso a paso para combinar reglas deterministas donde hace falta precisión exacta e IA únicamente donde aporta ahorro real.",
      ctaButtonLabel: "Evaluar automatización con KYVORA",
      blocks: [
        {
          type: "paragraph",
          text: "Hoy abunda la tentación de insertar inteligencia artificial en cualquier pantalla para parecer innovador: chats flotantes que no responden nada útil, flujos lentos para tareas que un botón hacía en un clic, o llamadas costosas a APIs externas para validar formatos simples. En KYVORA partimos de una premisa opuesta: si una regla determinista resuelve el problema más rápido, más barato y sin error probabilístico, la IA sobra.",
        },
        {
          type: "heading",
          level: 2,
          id: "cuando-no-usar-ia",
          text: "1. Problemas que NO deberían depender de un modelo generativo",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Cálculos contables, precios y firmas de seguridad",
              text: "Totales en pesos, impuestos, stock disponible o validación criptográfica exigen precisión exacta del 100%, nunca probabilidad estadística.",
            },
            {
              title: "Validaciones de formularios o filtros estructurados",
              text: "Si ya tienes campos concretos (ciudad, categoría, rango de fechas), una consulta SQL o expresión regular es instantánea y predecible.",
            },
            {
              title: "Atención al cliente sin base documental limpia",
              text: "Un asistente conectado a documentos desactualizados o contradictorios responderá con seguridad afirmaciones incorrectas.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "donde-si-aporta-valor",
          text: "2. Dónde la IA sí aporta una ventaja práctica verificable",
        },
        {
          type: "table",
          caption: "Matriz de criterio: automatización clásica frente a integración de IA",
          headers: ["Tipo de tarea operativa", "¿Conviene IA?", "Enfoque recomendado"],
          rows: [
            [
              "Clasificar solicitudes escritas en lenguaje libre y extraer campos",
              "Sí, como apoyo",
              "Modelo con salida JSON validada por esquema + revisión humana en casos ambiguos.",
            ],
            [
              "Resumir documentos extensos o consultar manuales internos",
              "Sí",
              "Búsqueda sobre documentos fuente reales citando el fragmento original (verificación humana).",
            ],
            [
              "Sincronizar pedidos entre formulario, correo y base de datos",
              "No",
              "Webhooks, colas de tareas e integraciones API deterministas.",
            ],
            [
              "Entornos con alta sensibilidad de datos locales",
              "Evaluar modelo local",
              "Evaluación de modelos ejecutados localmente (ej. pruebas con Ollama como en nuestro prototipo PulsAI) frente a APIs en la nube.",
            ],
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "patron-arquitectonico-seguro",
          text: "3. Principio arquitectónico: validar la salida y definir fallback",
        },
        {
          type: "paragraph",
          text: "Cuando un flujo sí justifica usar un modelo de lenguaje, nunca conviene confiar ciegamente en su texto crudo para disparar acciones sensibles en base de datos. Una buena práctica es tratar la respuesta del modelo como entrada no confiable, validarla con tipos estrictos y mantener un camino de respaldo claro.",
        },
        {
          type: "code",
          filename: "pipeline-criterio.ts",
          language: "typescript",
          code: `// Ejemplo ilustrativo: validar la clasificación sugerida antes de actuar
type TriageResult = {
  category: "soporte" | "cotizacion" | "otro";
  needsHumanReview: boolean;
};

export function normalizeModelSuggestion(raw: unknown): TriageResult {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "category" in raw &&
    (raw.category === "soporte" || raw.category === "cotizacion")
  ) {
    return { category: raw.category, needsHumanReview: false };
  }

  // Fallback determinista: ante duda o formato inválido, escalar a persona
  return { category: "otro", needsHumanReview: true };
}`,
        },
        {
          type: "heading",
          level: 2,
          id: "costos-privacidad-ley1581",
          text: "4. Privacidad, Ley 1581 de 2012 y costo continuo por tokens",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Tres puntos críticos antes de pasar a producción",
          text: "Primero, revisa qué datos personales viajan a proveedores externos de IA y si cuentas con autorización acorde a la Ley 1581 de 2012 en Colombia. Segundo, contempla el costo variable mensual por tokens al crecer el volumen de uso. Tercero, diseña límites claros de tasa y monitoreo para evitar facturas inesperadas por abusos automatizados.",
        },
        {
          type: "paragraph",
          text: "Integrar IA con criterio no consiste en añadir complejidad llamativa, sino en quitar fricción real donde el texto, la voz o los documentos no estructurados frenaban al equipo—manteniendo control humano, costos acotados y reglas exactas en todo lo crítico.",
        },
      ],
    },
    en: {
      slug: "how-to-integrate-ai-in-a-business-with-purpose",
      title: "How to integrate AI into a business without overusing it",
      seoTitle: "Integrating AI Into Business Workflows With Engineering Judgment",
      metaDescription:
        "Practical engineering framework for deciding when AI delivers real operational value, when deterministic code is superior, and how to control token costs and data privacy.",
      excerpt:
        "Not every business bottleneck needs a language model. Learn when AI adds measurable leverage, when deterministic automation wins, and how to stay in control.",
      categoryLabel: "AI & Automation",
      readingTimeLabel: "6 min read",
      keywords: [
        "integrate AI in business workflow",
        "deterministic automation vs AI",
        "local LLM Ollama vs cloud API",
        "AI cost and privacy governance",
      ],
      ctaTitle: "Evaluating automation or practical AI in your workflow?",
      ctaDescription:
        "We map your real process step by step—using deterministic code where precision is mandatory and AI only where unstructured input justifies it.",
      ctaButtonLabel: "Discuss automation with KYVORA",
      blocks: [
        {
          type: "paragraph",
          text: "There is widespread pressure to drop artificial intelligence into every screen simply to look modern—floating chatbots that deflect users, slower interfaces for one-click tasks, or expensive external API calls doing jobs a plain database query solves cleanly. At KYVORA, we start from the opposite rule: if deterministic code solves the task faster, cheaper, and with zero hallucination risk, leave AI out.",
        },
        {
          type: "heading",
          level: 2,
          id: "where-not-to-use-ai",
          text: "1. Workloads that should NOT rely on generative models",
        },
        {
          type: "list",
          ordered: false,
          items: [
            {
              title: "Accounting math, pricing, and security checks",
              text: "Totals, tax calculations, inventory balances, and cryptographic validation demand 100% deterministic accuracy, never probabilistic guessing.",
            },
            {
              title: "Structured filtering and form validation",
              text: "When inputs already carry discrete fields like city, category, or date ranges, SQL queries and explicit schemas execute instantaneously.",
            },
            {
              title: "Customer support layered over outdated documentation",
              text: "Connecting a model to messy, conflicting records simply generates confident-sounding wrong answers.",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "where-ai-helps",
          text: "2. Where AI genuinely delivers practical value",
        },
        {
          type: "table",
          caption: "Decision matrix: deterministic automation vs. targeted AI",
          headers: ["Operational Task", "Use AI?", "Recommended Engineering Pattern"],
          rows: [
            [
              "Triage free-form inquiries and extract structured fields",
              "Yes, assistive",
              "Schema-validated JSON output paired with human fallback for edge cases.",
            ],
            [
              "Summarize lengthy internal documents or query verified manuals",
              "Yes",
              "Grounded retrieval citing exact source passages for rapid human verification.",
            ],
            [
              "Sync orders between forms, email notifications, and databases",
              "No",
              "Deterministic webhooks, queues, and typed API contracts.",
            ],
            [
              "Privacy-sensitive workflows with local hardware options",
              "Evaluate local models",
              "Local model execution (such as Ollama experimentation seen in our PulsAI prototype) vs. external APIs.",
            ],
          ],
        },
        {
          type: "heading",
          level: 2,
          id: "safe-architecture-pattern",
          text: "3. Architectural rule: treat model output as untrusted input",
        },
        {
          type: "paragraph",
          text: "Even when a language model fits the task, raw output should never directly mutate production records without structural validation and a predictable fallback path.",
        },
        {
          type: "code",
          filename: "safe-triage.ts",
          language: "typescript",
          code: `// Illustrative pattern: validate model output strictly before routing
type TriageResult = {
  category: "support" | "quote" | "other";
  needsHumanReview: boolean;
};

export function normalizeModelSuggestion(raw: unknown): TriageResult {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "category" in raw &&
    (raw.category === "support" || raw.category === "quote")
  ) {
    return { category: raw.category, needsHumanReview: false };
  }

  // Deterministic fallback: route uncertain cases to human review
  return { category: "other", needsHumanReview: true };
}`,
        },
        {
          type: "heading",
          level: 2,
          id: "privacy-and-token-economics",
          text: "4. Data privacy, compliance, and ongoing token costs",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Three production checks before launch",
          text: "First, verify what personal data leaves your infrastructure toward third-party providers and ensure proper user consent (including Colombian Law 1581 of 2012 where applicable). Second, model variable monthly token fees as volume scales. Third, enforce strict rate limiting so abusive traffic never triggers runaway API bills.",
        },
        {
          type: "paragraph",
          text: "Purposeful AI is not about visual hype—it is about removing genuine friction around unstructured text, documents, or voice while keeping deterministic code, human oversight, and predictable economics firmly in charge.",
        },
      ],
    },
  },
];

