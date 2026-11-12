export type Language = "es" | "en";

export interface Translations {
  nav: {
    skipLink: string;
    services: string;
    lab: string;
    pricing: string;
    process: string;
    resources: string;
    donate: string;
    contact: string;
    startProject: string;
    navigationLabel: string;
    mobileNavTitle: string;
    operatingFrom: string;
  };
  hero: {
    badgeStudio: string;
    badgeCountry: string;
    primaryClaim: string;
    titlePart1: string;
    titleGradient: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    studioLabel: string;
    studioSummary: string;
    labLabel: string;
    labSummary: string;
    specs: {
      stackTitle: string;
      stackValue: string;
      systemsTitle: string;
      systemsValue: string;
      infraTitle: string;
      infraValue: string;
      complianceTitle: string;
      complianceValue: string;
    };
  };
  manifesto: {
    badge: string;
    statement: string;
    subClaim: string;
    supporting: string;
    pillars: Array<{ label: string; value: string }>;
  };
  services: {
    badge: string;
    divisionTag: string;
    title: string;
    subtitle: string;
    focusAreas: string[];
    whatWeBuildLabel: string;
    needSolvedLabel: string;
    includedLabel: string;
    limitationsLabel: string;
    howToQuoteLabel: string;
    requestQuoteBtn: string;
    items: Array<{
      id: string;
      num: string;
      title: string;
      shortDesc: string;
      whatWeBuild: string;
      needSolved: string;
      included: string[];
      limitationsAndDependencies: string[];
      howToQuote: string;
    }>;
  };
  lab: {
    badge: string;
    visionClaim: string;
    featuredLabel: string;
    title: string;
    subtitle: string;
    repoBtn: string;
    internalPrototype: string;
    purposeLabel: string;
    contributionText: string;
    contributionBtn: string;
    resourcesPrompt: string;
    resourcesBtn: string;
    projects: Record<
      string,
      {
        tagline: string;
        purpose: string;
        status: string;
      }
    >;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    deliverablesLabel: string;
    scopeFactorsTitle: string;
    disclaimer: string;
    contractConditionsLink: string;
    tiers: Array<{
      id: string;
      title: string;
      badge?: string;
      description: string;
      priceNote: string;
      deliveryTimeEstimated: string;
      deliverables: string[];
      limitations: string[];
      ctaText: string;
    }>;
    scopeFactors: Array<{
      title: string;
      description: string;
    }>;
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    phasePrefix: string;
    steps: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
  };
  human: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
    closingNote: string;
    resourcesCta: string;
    contactCta: string;
  };
  donate: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Badge: string;
    targets: Array<{
      id: string;
      title: string;
      description: string;
    }>;
    step2Title: string;
    popularBadge: string;
    customAmountLabel: string;
    customMinText: string;
    step3Title: string;
    donorNamePlaceholder: string;
    donorEmailPlaceholder: string;
    totalLabel: string;
    targetAssignedLabel: string;
    gatewayLabel: string;
    gatewayName: string;
    proceedBtn: string;
    loadingBtn: string;
    legalNotice: string;
    donateConditionsLink: string;
    reversalsPolicyLink: string;
    errorMinAmount: string;
    errorMaxAmount: string;
    errorGeneric: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    channelsTitle: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      serviceLabel: string;
      serviceDefaultOption: string;
      serviceOptions: Array<{ value: string; label: string }>;
      budgetLabel: string;
      budgetPlaceholder: string;
      descLabel: string;
      descPlaceholder: string;
      termsLabel: string;
      termsLinkText: string;
      submitBtn: string;
      loadingBtn: string;
      successTitle: string;
      successDesc: string;
      newMsgBtn: string;
      errorRequiredTerms: string;
      errorGeneric: string;
    };
  };
  footer: {
    description: string;
    operatingNote: string;
    infraNote: string;
    navTitle: string;
    legalTitle: string;
    channelsTitle: string;
    sicText: string;
    allRightsReserved: string;
    legalNav: Array<{ href: string; label: string }>;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      skipLink: "Saltar al contenido principal",
      services: "Servicios",
      lab: "Laboratorio",
      pricing: "Precios",
      process: "Proceso",
      resources: "Recursos",
      donate: "Donate Us",
      contact: "Contacto",
      startProject: "Iniciar Proyecto",
      navigationLabel: "Navegación principal",
      mobileNavTitle: "Navegación",
      operatingFrom: "Operando desde Colombia",
    },
    hero: {
      badgeStudio: "KYVORA · Studio & Lab",
      badgeCountry: "Colombia",
      primaryClaim: "Tecnología con intención.",
      titlePart1: "Convertimos ideas complejas en ",
      titleGradient: "software real",
      description:
        "Desarrollamos páginas web, aplicaciones interactivas, sistemas a la medida, automatizaciones e integración con inteligencia artificial. Sin plantillas genéricas. Con criterio técnico y arquitectura pensada para durar.",
      ctaPrimary: "Iniciar un Proyecto",
      ctaSecondary: "Explorar KYVORA Lab",
      studioLabel: "KYVORA STUDIO",
      studioSummary: "Desarrollo web, apps, sistemas personalizados, automatización e IA.",
      labLabel: "KYVORA LAB",
      labSummary: "Investigación, prototipos propios y productos experimentales.",
      specs: {
        stackTitle: "Stack Core",
        stackValue: "Next.js · React 19 · TS",
        systemsTitle: "Sistemas",
        systemsValue: "PostgreSQL · APIs · IoT",
        infraTitle: "Infraestructura",
        infraValue: "Vercel · Cloud · WebSockets",
        complianceTitle: "Cumplimiento",
        complianceValue: "Ley 1480 · Ley 1581 (Col)",
      },
    },
    manifesto: {
      badge: "Manifiesto KYVORA",
      statement:
        "La tecnología no debería existir por existir. Debería resolver problemas, abrir posibilidades y convertir ideas en algo real.",
      subClaim: "Ideas que toman forma.",
      supporting:
        "Combinamos diseño con criterio, ingeniería modular e investigación propia para construir plataformas claras, confiables y pensadas para crecer con el negocio.",
      pillars: [
        { label: "01 · KYVORA Studio", value: "Software y sistemas a medida" },
        { label: "02 · KYVORA Lab", value: "Prototipos e I+D propio" },
        { label: "03 · Ingeniería", value: "Arquitectura modular y limpia" },
      ],
    },
    services: {
      badge: "KYVORA STUDIO · Servicios",
      divisionTag: "División Comercial",
      title: "Desarrollo, Sistemas e Inteligencia Artificial",
      subtitle:
        "Soluciones estructuradas con alcance transparente: especificamos qué construimos, qué incluye cada entregable y qué dependencias técnicas aplican.",
      focusAreas: [
        "Desarrollo web",
        "Landing pages",
        "Aplicaciones web y móviles",
        "Sistemas personalizados",
        "Inventarios y gestión administrativa",
        "Automatización de procesos",
        "Integración de IA",
      ],
      whatWeBuildLabel: "Qué se desarrolla",
      needSolvedLabel: "Necesidad que resuelve",
      includedLabel: "Qué incluye el entregable",
      limitationsLabel: "Limitaciones y dependencias del servicio",
      howToQuoteLabel: "Cómo cotizar:",
      requestQuoteBtn: "Solicitar cotización de este servicio",
      items: [
        {
          id: "web-development",
          num: "01",
          title: "Desarrollo Web & Landing Pages",
          shortDesc: "Sitios web institucionales y landing pages orientadas a claridad y conversión.",
          whatWeBuild:
            "Sitios web institucionales, páginas de aterrizaje (landing pages) para campañas comerciales, portafolios interactivos y portales de contenido estructurado desarrollados sobre arquitecturas modernas como Next.js y React.",
          needSolved:
            "Resuelve la falta de credibilidad, la lentitud de carga de plantillas pesadas y la baja tasa de conversión de visitantes en clientes potenciales.",
          included: [
            "Diseño UI/UX adaptado a la identidad de marca (Desktop y Móvil)",
            "Código semántico, accesible y optimizado para motores de búsqueda (SEO)",
            "Formularios funcionales con protección anti-spam y entrega por correo",
            "Optimización técnica de rendimiento, carga y Core Web Vitals",
            "Metadatos Open Graph para previsualización en WhatsApp y redes sociales",
          ],
          limitationsAndDependencies: [
            "El cliente debe proveer los textos finales, logotipos y material fotográfico oficial.",
            "El costo anual de nombre de dominio y hosting cloud corre por cuenta del cliente.",
            "No incluye pasarelas de pago transaccionales complejas a menos que se coticen como módulo adicional.",
          ],
          howToQuote:
            "Selecciona el tipo 'Página web' en nuestro formulario de contacto o escríbenos por WhatsApp con los enlaces de referencia y secciones requeridas.",
        },
        {
          id: "app-development",
          num: "02",
          title: "Aplicaciones Web y Móviles",
          shortDesc: "Plataformas interactivas y aplicaciones móviles orientadas a resolver problemas concretos.",
          whatWeBuild:
            "Aplicaciones web progresivas (PWA), paneles de administración (dashboards) de usuario y clientes móviles desarrollados con tecnologías modernas como Next.js, React y Flutter.",
          needSolved:
            "Permite a negocios y startups materializar productos mínimos viables (MVP) o herramientas internas operativas sin lidiar con arquitecturas sobredimensionadas.",
          included: [
            "Flujos de autenticación segura de usuarios (Email/Password, OAuth)",
            "Diseño de interfaz interactiva con estados de carga y manejo de errores",
            "Modelado de base de datos y diseño de APIs RESTful o Server Actions",
            "Pruebas funcionales de los flujos críticos de la aplicación",
            "Despliegue configurado en entornos de staging y producción",
          ],
          limitationsAndDependencies: [
            "Las cuentas de desarrollador en Apple App Store y Google Play Store deben ser provistas por el cliente.",
            "Servicios de base de datos o almacenamiento de archivos (AWS, Supabase, Cloudinary) son pagados directamente al proveedor por el contratante.",
          ],
          howToQuote:
            "Envíanos una descripción de los roles de usuario esperados y las 3 o 4 pantallas principales de tu flujo para elaborar una estimación por hitos.",
        },
        {
          id: "custom-systems",
          num: "03",
          title: "Sistemas Personalizados de Software",
          shortDesc: "Software a la medida para procesos operativos, sincronización de datos y plataformas privadas.",
          whatWeBuild:
            "Herramientas de gestión interna, sistemas de facturación/inventario a medida, motores de cálculo, conexiones entre plataformas dispares y servicios de backend con bases de datos relacionales.",
          needSolved:
            "Elimina las limitaciones y costos recurrentes de licencias SaaS genéricas que no se adaptan a las particularidades operativas del negocio.",
          included: [
            "Levantamiento de especificación técnica y modelo de datos relacional",
            "Manejo de concurrencia, transacciones atómicas y seguridad de datos",
            "Paneles de reportería y exportación estructurada de información",
            "Roles, permisos granulares y registros de auditoría",
            "Documentación técnica de arquitectura y manual básico de administración",
          ],
          limitationsAndDependencies: [
            "Requiere disponibilidad del equipo del cliente durante la etapa de descubrimiento para definir reglas de negocio.",
            "Mantenimiento correctivo o evolutivo post-garantía se formaliza mediante acuerdos de nivel de servicio (SLA) mensuales.",
          ],
          howToQuote:
            "Agenda una sesión de diagnóstico inicial mediante nuestro formulario indicando el cuello de botella operativo que necesitas solucionar.",
        },
        {
          id: "automation-ai",
          num: "04",
          title: "Automatización e Integración de IA",
          shortDesc: "Flujos de automatización y asistentes inteligentes para optimizar tareas repetitivas.",
          whatWeBuild:
            "Integraciones con modelos de lenguaje (LLMs de OpenAI, Anthropic o modelos abiertos), asistentes contextuales para atención preliminar, agentes de extracción de datos de documentos y automatización de procesos entre aplicaciones.",
          needSolved:
            "Reduce drásticamente el tiempo dedicado por el personal a tareas repetitivas de clasificación, respuesta a consultas frecuentes o transcripción de datos.",
          included: [
            "Diseño de prompts estructurados y canalización segura de datos hacia los modelos",
            "Almacenamiento y búsqueda vectorial si el caso requiere recuperación de documentos (RAG)",
            "Webhooks para activar automatizaciones ante eventos comerciales o de mensajería",
            "Manejo de fallos, reintentos y límites de tokens para control presupuestal",
          ],
          limitationsAndDependencies: [
            "El consumo de tokens de los modelos de IA es facturado directamente por los proveedores (OpenAI, Anthropic) al cliente.",
            "Los modelos de IA pueden presentar márgenes de incertidumbre ('alucinaciones'); se diseñan salvaguardas pero no sustituyen el juicio humano crítico en decisiones legales o médicas.",
          ],
          howToQuote:
            "Cuéntanos qué proceso repetitivo deseas automatizar y qué herramientas utilizas actualmente (WhatsApp, correo, hojas de cálculo, CRM).",
        },
      ],
    },
    lab: {
      badge: "KYVORA LAB · I+D y Experimentación",
      visionClaim: "Tecnología para ideas que todavía no existen.",
      featuredLabel: "Proyecto Destacado del Laboratorio",
      title: "Laboratorio de Productos Propios",
      subtitle:
        "Iniciativas de investigación, experimentación y software concebidas internamente por KYVORA. Mostramos únicamente desarrollos reales respaldados por código.",
      repoBtn: "Repositorio",
      internalPrototype: "Prototipo Interno",
      purposeLabel: "Propósito técnico:",
      contributionText:
        "¿Quieres apoyar el desarrollo de sensores en QuakeNet o la infraestructura de Pulso?",
      contributionBtn: "Aportar a un Proyecto en Donate Us",
      resourcesPrompt: "¿Buscas criterio técnico o guías prácticas?",
      resourcesBtn: "Explorar Guías en /recursos",
      projects: {
        pulso: {
          tagline: "Red social experimental orientada a interacción en tiempo real.",
          purpose:
            "Explorar nuevas dinámicas de interacción comunitaria y comunicación instantánea móvil y web con latencia reducida y consumo controlado de datos.",
          status: "Fase Beta",
        },
        quakenet: {
          tagline: "Sistema distribuido de detección y monitoreo sísmico.",
          purpose:
            "Crear una red de monitoreo de eventos telúricos mediante micro-sensores y agregación de señales en tiempo real para análisis geoespacial preliminar.",
          status: "Experimental",
        },
        "kyvora-studio": {
          tagline: "Editor de video no lineal (NLE) multipista para escritorio y web.",
          purpose:
            "Suite de edición y postproducción de video en desarrollo con arquitectura monorepo y streaming nativo en Windows. Incluye línea de tiempo multipista (video, audio y texto), proyectos .XTP, monitor 1080p a 60 fps, corte, duplicación y renderizado multi-códec con FFmpeg 7.",
          status: "En Desarrollo",
        },
        pulsai: {
          tagline: "Asistente analítico conectado a modelos locales con búsqueda web, documentos y voz.",
          purpose:
            "Prototipo experimental de PulsAI Analytics conectado al modelo local gemma4:e2b mediante Ollama, con herramientas integradas de búsqueda web, lectura de documentos, entrada de imagen y soporte de voz.",
          status: "Experimental",
        },
        voicetranslate: {
          tagline: "Traductor de voz bidireccional en tiempo real con IA y síntesis auditiva.",
          purpose:
            "Herramienta web de transcripción continua y traducción contextual de baja latencia impulsada por Web Speech API y Gemini 2.5 Flash, con prevención automática de eco y modo conversación en vivo.",
          status: "Fase Beta",
        },
      },
    },
    pricing: {
      badge: "Transparencia Comercial",
      title: "Precios & Cotizaciones",
      subtitle:
        "Modelo mixto: tarifas estandarizadas para alcances acotados y cotizaciones individuales según la arquitectura requerida.",
      deliverablesLabel: "Entregables incluidos:",
      scopeFactorsTitle: "Factores que determinan el costo en proyectos personalizados",
      disclaimer:
        "Precios referenciales en pesos colombianos (COP). El costo definitivo se formaliza en una propuesta comercial y contrato de servicios de acuerdo con el alcance técnico, requerimientos de integración y plazos acordados.",
      contractConditionsLink: "Condiciones de Contratación",
      tiers: [
        {
          id: "landing-page",
          title: "Landing Page Profesional",
          badge: "Base Estandarizada",
          description:
            "Diseño y desarrollo de sitio web de alta conversión, adaptado a dispositivos móviles, optimizado para SEO y velocidad.",
          priceNote: "Desde $850.000 COP según secciones y contenido",
          deliveryTimeEstimated: "5 a 10 días hábiles",
          deliverables: [
            "Estructura visual responsive (móvil, tablet, desktop)",
            "Hasta 5 secciones de contenido estructurado",
            "Formulario de contacto con validación y reenvío por correo",
            "Optimización técnica de velocidad de carga y SEO base",
            "Metadatos SEO y tarjetas Open Graph para redes sociales",
            "Integración con WhatsApp y analítica básica",
          ],
          limitations: [
            "No incluye pasarela de pagos ni comercio electrónico transaccional",
            "El cliente provee textos finales, fotografía y activos de marca",
            "Hosting y dominio anual corren por cuenta del cliente",
          ],
          ctaText: "Solicitar Landing Page",
        },
        {
          id: "mvp-web-app",
          title: "Aplicación Web / MVP Inicial",
          badge: "Producto Digital",
          description:
            "Desarrollo de aplicación interactiva con autenticación de usuarios, base de datos y lógica de negocio para validar un producto.",
          priceNote: "Desde $2.800.000 COP según módulos y flujos",
          deliveryTimeEstimated: "3 a 6 semanas",
          deliverables: [
            "Arquitectura frontend en Next.js / React y backend en Node.js o Supabase",
            "Autenticación segura (Email/Password, OAuth)",
            "Modelado de base de datos relacional (PostgreSQL)",
            "Panel de administración básico o dashboard de usuario",
            "Pruebas unitarias de flujos críticos",
            "Despliegue configurado en Vercel / Cloud",
          ],
          limitations: [
            "Módulos adicionales o pasarelas de pago se cotizan por separado",
            "Costos de infraestructura cloud pagados por el cliente",
            "Mantenimiento post-lanzamiento acordado por SLA opcional",
          ],
          ctaText: "Cotizar MVP",
        },
        {
          id: "custom-system",
          title: "Sistema a Medida / Automatización e IA",
          badge: "Solución Integral",
          description:
            "Arquitectura y desarrollo de plataformas completas, automatizaciones de procesos operativos e integración de modelos de lenguaje.",
          priceNote: "Cotización individual según especificación técnica",
          deliveryTimeEstimated: "Estimado tras levantamiento de requerimientos",
          deliverables: [
            "Documento de especificación funcional y arquitectura de software",
            "Desarrollo frontend, backend, APIs RESTful y WebSockets",
            "Integración con modelos de IA (OpenAI, Anthropic, open-source)",
            "Automatización de pipelines de datos y tareas recurrentes",
            "Entornos de staging y producción con CI/CD",
            "Garantía técnica de estabilidad y soporte",
          ],
          limitations: [
            "Requiere fase de descubrimiento y definición de alcance",
            "Tokens de API de IA y servidores especializados son provistos por el contratante",
          ],
          ctaText: "Agendar Sesión de Descubrimiento",
        },
      ],
      scopeFactors: [
        {
          title: "Volumen y complejidad de flujos",
          description:
            "Sistemas con múltiples estados, roles de usuario o aprobaciones requieren mayor tiempo de arquitectura y validación.",
        },
        {
          title: "Integraciones de terceros",
          description:
            "Conectar pasarelas de pago (Wompi, PSE), CRMs, ERPs o APIs externas requiere adaptar esquemas y gestionar webhooks e idempotencia.",
        },
        {
          title: "Infraestructura y persistencia",
          description:
            "El tipo de base de datos, servidores de baja latencia o almacenamiento de archivos influye en la ingeniería requerida.",
        },
        {
          title: "Inteligencia artificial",
          description:
            "Agentes, pipelines RAG o procesamiento de lenguaje natural demandan pruebas de fiabilidad, prompts y control de costes por inferencia.",
        },
      ],
    },
    process: {
      badge: "Metodología KYVORA",
      title: "Proceso Progresivo en 5 Etapas",
      subtitle:
        "Un flujo ordenado de principio a fin, con comunicación directa y validaciones tangibles antes de cada paso siguiente.",
      phasePrefix: "Etapa",
      steps: [
        {
          num: "01",
          title: "Exploración",
          desc: "Comprendemos el problema operativo o comercial, las restricciones técnicas reales y el contexto antes de diseñar una línea de código.",
        },
        {
          num: "02",
          title: "Diseño",
          desc: "Definimos arquitectura de software, modelo de datos, flujos clave e identidad visual con foco en claridad y propósito.",
        },
        {
          num: "03",
          title: "Desarrollo",
          desc: "Implementamos con código tipado, limpio y modular, habilitando revisiones verificables durante el avance.",
        },
        {
          num: "04",
          title: "Validación",
          desc: "Ejecutamos pruebas de seguridad, accesibilidad, rendimiento y respuesta en dispositivos reales antes de publicar.",
        },
        {
          num: "05",
          title: "Evolución",
          desc: "Desplegamos de forma controlada y entregamos una base documentada y mantenible preparada para iterar con criterio.",
        },
      ],
    },
    human: {
      badge: "Criterio & Enfoque Humano",
      title: "Un estudio tecnológico independiente construido con cercanía y criterio",
      subtitle:
        "Creemos en colaboraciones técnicas transparentes: comunicación directa con quien diseña y programa, alcance realista y tecnología construida para servir a personas reales.",
      pillars: [
        {
          num: "01",
          title: "Cercanía real",
          desc: "Conversas directamente con el equipo técnico que piensa la arquitectura y escribe el código de tu proyecto.",
        },
        {
          num: "02",
          title: "Comunicación directa",
          desc: "Alineamos objetivos, dependencias y avances concretos sin intermediarios comerciales ni jerga artificial.",
        },
        {
          num: "03",
          title: "Desarrollo con criterio",
          desc: "Elegimos herramientas probadas y estructuras mantenibles por encima de modas pasajeras o plantillas pesadas.",
        },
        {
          num: "04",
          title: "A medida de necesidades reales",
          desc: "Desde presencia web clara hasta inventarios, gestión administrativa, automatización operativa e integración de IA.",
        },
      ],
      closingNote:
        "Operando de forma independiente desde el Valle del Cauca, Colombia — abiertos a conversar sobre tu proyecto o compartir guías prácticas.",
      resourcesCta: "Explorar Guías en /recursos",
      contactCta: "Conversar sobre un proyecto",
    },
    donate: {
      badge: "Mecenazgo & Aportes Voluntarios",
      title: "Donate Us · Apoya el Laboratorio",
      subtitle:
        "Impulsa el desarrollo de herramientas abiertas, sensores IoT y proyectos experimentales concebidos en Colombia.",
      step1Title: "1. Selecciona el destino de tu aporte",
      step1Badge: "transparente y verificable",
      targets: [
        {
          id: "general",
          title: "Fondo General del Laboratorio KYVORA",
          description:
            "Apoyo libre para investigación, servidores, prototipado y mantenimiento de herramientas de acceso abierto.",
        },
        {
          id: "quakenet",
          title: "Proyecto QuakeNet (Detección Sísmica)",
          description:
            "Recursos destinados a adquisición de sensores IoT de prueba, calibración y servidores para el mapa en tiempo real.",
        },
        {
          id: "pulso",
          title: "Proyecto Pulso (Red Social Experimental)",
          description:
            "Recursos orientados a pruebas de estrés, infraestructura de WebSockets y optimización de latencia en la beta.",
        },
        {
          id: "pulsai",
          title: "Proyecto PulsAI (IA Experimental)",
          description:
            "Recursos para cobertura de tokens en APIs de modelos de lenguaje e investigación en agentes autónomos.",
        },
      ],
      step2Title: "2. Elige o ingresa el importe (en Pesos Colombianos - COP)",
      popularBadge: "Sugerido",
      customAmountLabel: "Otro Importe COP:",
      customMinText: "Mínimo: $10.000 COP",
      step3Title: "3. Datos del Aportante (Opcional)",
      donorNamePlaceholder: "Nombre o seudónimo (Opcional)",
      donorEmailPlaceholder: "Correo electrónico para comprobante (Opcional)",
      totalLabel: "Total Aporte Voluntario:",
      targetAssignedLabel: "Destino Asignado:",
      gatewayLabel: "Pasarela de Procesamiento:",
      gatewayName: "Wompi Colombia (Bancolombia)",
      proceedBtn: "Continuar al Pago con Wompi",
      loadingBtn: "Generando transacción segura con Wompi...",
      legalNotice:
        "Los aportes son transferencias voluntarias a una persona natural independiente en Colombia para el sostenimiento de sus proyectos tecnológicos y código abierto. No constituyen donaciones a entidades sin ánimo de lucro (ESAL) ni otorgan deducciones del impuesto sobre la renta.",
      donateConditionsLink: "Condiciones Legales de Donate Us",
      reversalsPolicyLink: "Política de Pagos y Reversiones",
      errorMinAmount: "El importe mínimo para realizar un aporte es de $10.000 COP.",
      errorMaxAmount: "El importe no puede superar $50.000.000 COP.",
      errorGeneric: "Error al conectar con la pasarela de pago.",
    },
    contact: {
      badge: "Contacto Directo",
      title: "¿Tienes algo que construir?",
      subtitle:
        "Cuéntanos qué tienes en mente. No necesitas tener todo especificado desde el primer día: nosotros te ayudamos a estructurar la arquitectura técnica y el alcance.",
      channelsTitle: "Canales oficiales verificados",
      form: {
        nameLabel: "Nombre completo *",
        namePlaceholder: "Ej: Daniel Morales",
        emailLabel: "Correo electrónico *",
        emailPlaceholder: "tu@empresa.com",
        serviceLabel: "Tipo de servicio *",
        serviceDefaultOption: "Selecciona una categoría",
        serviceOptions: [
          { value: "Landing Page / Web", label: "Desarrollo Web & Landing Page" },
          { value: "Aplicación Web/Móvil", label: "Aplicación Web o Móvil (MVP)" },
          { value: "Sistema a Medida", label: "Sistema Personalizado de Software" },
          { value: "Automatización / IA", label: "Automatización e Integración de IA" },
          { value: "Otro", label: "Otro requerimiento técnico" },
        ],
        budgetLabel: "Presupuesto estimado (Opcional)",
        budgetPlaceholder: "Ej: $2.000.000 COP o $1.000 USD",
        descLabel: "Descripción del proyecto o necesidad *",
        descPlaceholder:
          "Cuéntanos el propósito de tu proyecto, qué funcionalidades clave imaginas o qué problema necesitas resolver...",
        termsLabel:
          "Autorizo a KYVORA el tratamiento de mis datos de contacto exclusivamente para atender y dar respuesta a esta consulta comercial, conforme a la",
        termsLinkText: "Política de Tratamiento de Datos Personales (Ley 1581 de 2012).",
        submitBtn: "Enviar Mensaje",
        loadingBtn: "Transmitiendo mensaje...",
        successTitle: "Mensaje recibido correctamente",
        successDesc:
          "Revisaremos tu requerimiento y nos pondremos en contacto contigo a la brevedad posible.",
        newMsgBtn: "Enviar otro mensaje",
        errorRequiredTerms:
          "Debes autorizar el tratamiento de datos personales para enviar tu mensaje.",
        errorGeneric: "Error al procesar el envío.",
      },
    },
    footer: {
      description:
        "Estudio tecnológico independiente en Colombia. Desarrollamos soluciones web modernas, aplicaciones escalables, sistemas a medida y automatizaciones con IA.",
      operatingNote: "Operado en Colombia por Persona Natural Independiente.",
      infraNote: "Infraestructura preparada para Vercel & Wompi.",
      navTitle: "Navegación",
      legalTitle: "Marco Legal Colombia",
      channelsTitle: "Canales Verificados",
      sicText: "Superintendencia de Industria y Comercio (SIC)",
      allRightsReserved: "Todos los derechos reservados. KYVORA Studio & Software.",
      legalNav: [
        { label: "Datos Personales", href: "/legal/datos-personales" },
        { label: "Aviso de Privacidad", href: "/legal/privacidad" },
        { label: "Términos de Uso", href: "/legal/terminos" },
        { label: "Condiciones de Contratación", href: "/legal/contratacion" },
        { label: "Pagos y Reversiones", href: "/legal/pagos-reversiones" },
        { label: "Canal PQRS", href: "/legal/pqrs" },
        { label: "Política de Cookies", href: "/legal/cookies" },
        { label: "Condiciones Donate Us", href: "/legal/donate" },
      ],
    },
  },
  en: {
    nav: {
      skipLink: "Skip to main content",
      services: "Services",
      lab: "Laboratory",
      pricing: "Pricing",
      process: "Process",
      resources: "Resources",
      donate: "Donate Us",
      contact: "Contact",
      startProject: "Start Project",
      navigationLabel: "Main navigation",
      mobileNavTitle: "Navigation",
      operatingFrom: "Operating from Colombia",
    },
    hero: {
      badgeStudio: "KYVORA · Studio & Lab",
      badgeCountry: "Colombia",
      primaryClaim: "Technology with intent.",
      titlePart1: "We turn complex ideas into ",
      titleGradient: "real software",
      description:
        "We design and build websites, interactive applications, custom systems, operational automation, and AI integrations. No generic templates. Intentional engineering built to last.",
      ctaPrimary: "Start a Project",
      ctaSecondary: "Explore KYVORA Lab",
      studioLabel: "KYVORA STUDIO",
      studioSummary: "Websites, apps, custom software systems, automation & AI.",
      labLabel: "KYVORA LAB",
      labSummary: "Internal research, original prototypes & experimental products.",
      specs: {
        stackTitle: "Core Stack",
        stackValue: "Next.js · React 19 · TS",
        systemsTitle: "Systems",
        systemsValue: "PostgreSQL · APIs · IoT",
        infraTitle: "Infrastructure",
        infraValue: "Vercel · Cloud · WebSockets",
        complianceTitle: "Compliance",
        complianceValue: "Commercial & Privacy (Col)",
      },
    },
    manifesto: {
      badge: "KYVORA Manifesto",
      statement:
        "Technology should not exist merely for its own sake. It should solve problems, unlock possibilities, and turn ideas into something real.",
      subClaim: "Ideas that take shape.",
      supporting:
        "We unite thoughtful design, modular software engineering, and in-house experimentation to build clear, dependable platforms designed to grow with your business.",
      pillars: [
        { label: "01 · KYVORA Studio", value: "Custom software & systems" },
        { label: "02 · KYVORA Lab", value: "Internal R&D & prototypes" },
        { label: "03 · Engineering", value: "Clean, modular architecture" },
      ],
    },
    services: {
      badge: "KYVORA STUDIO · Services",
      divisionTag: "Commercial Division",
      title: "Development, Custom Systems & AI",
      subtitle:
        "Structured solutions with transparent scope: we define what we build, what each deliverable covers, and every technical dependency upfront.",
      focusAreas: [
        "Web development",
        "Landing pages",
        "Web & mobile applications",
        "Custom software systems",
        "Inventory & administrative operations",
        "Process automation",
        "AI integration",
      ],
      whatWeBuildLabel: "What we build",
      needSolvedLabel: "Problem it solves",
      includedLabel: "Included in deliverable",
      limitationsLabel: "Limitations & service dependencies",
      howToQuoteLabel: "How to quote:",
      requestQuoteBtn: "Request a quote for this service",
      items: [
        {
          id: "web-development",
          num: "01",
          title: "Web Development & Landing Pages",
          shortDesc: "Institutional websites and landing pages designed for clarity and conversion.",
          whatWeBuild:
            "Corporate websites, commercial campaign landing pages, interactive portfolios, and structured content portals built on modern architectures like Next.js and React.",
          needSolved:
            "Overcomes credibility gaps, slow loading times caused by bloated templates, and low conversion rates from visitors to qualified leads.",
          included: [
            "UI/UX design tailored to your brand identity (Desktop & Mobile)",
            "Semantic, accessible code optimized for search engines (SEO)",
            "Functional forms with anti-spam protection and email delivery",
            "Technical optimization for performance, fast loading, and Core Web Vitals",
            "Open Graph metadata for rich previews on WhatsApp and social media",
          ],
          limitationsAndDependencies: [
            "The client must provide final copy, logos, and official photography.",
            "Annual domain name and cloud hosting costs are paid directly by the client.",
            "Complex transactional payment gateways are quoted as an additional module.",
          ],
          howToQuote:
            "Select 'Web Development' in our contact form or message us via WhatsApp with your reference links and required sections.",
        },
        {
          id: "app-development",
          num: "02",
          title: "Web & Mobile Applications",
          shortDesc: "Interactive platforms and mobile applications engineered to solve concrete problems.",
          whatWeBuild:
            "Progressive Web Apps (PWA), custom user dashboards, and mobile clients built with modern technologies such as Next.js, React, and Flutter.",
          needSolved:
            "Empowers businesses and startups to launch minimum viable products (MVPs) or internal operational tools without bloated, over-engineered architectures.",
          included: [
            "Secure user authentication flows (Email/Password, OAuth)",
            "Interactive UI design with dedicated loading and error states",
            "Relational database modeling and RESTful API / Server Actions design",
            "Functional testing across critical application user journeys",
            "Automated staging and production deployment configuration",
          ],
          limitationsAndDependencies: [
            "Developer accounts on Apple App Store and Google Play Store must be provided by the client.",
            "Third-party database or file storage services (AWS, Supabase, Cloudinary) are paid directly to the provider.",
          ],
          howToQuote:
            "Send us an overview of expected user roles and the 3-4 primary screens of your workflow for a milestone-based estimate.",
        },
        {
          id: "custom-systems",
          num: "03",
          title: "Custom Software Systems",
          shortDesc: "Bespoke software for operational workflows, data synchronization, and private platforms.",
          whatWeBuild:
            "Internal management tools, custom billing and inventory systems, calculation engines, platform bridges, and backend services with relational databases.",
          needSolved:
            "Eliminates the limitations, vendor lock-in, and recurring seat costs of generic SaaS tools that fail to match your actual business operations.",
          included: [
            "Technical specification blueprint and relational data architecture",
            "Concurrency handling, atomic transactions, and strict data security",
            "Reporting dashboards with structured data export capabilities",
            "Granular roles, user permissions, and tamper-resistant audit logs",
            "Technical architecture documentation and administrative handbook",
          ],
          limitationsAndDependencies: [
            "Requires client team availability during discovery sessions to define business logic.",
            "Post-warranty corrective or evolutionary maintenance is contracted through monthly service level agreements (SLAs).",
          ],
          howToQuote:
            "Schedule an initial discovery session via our contact form detailing the operational bottleneck you need to resolve.",
        },
        {
          id: "automation-ai",
          num: "04",
          title: "AI Integration & Automation",
          shortDesc: "Automated pipelines and intelligent assistants to streamline repetitive operational tasks.",
          whatWeBuild:
            "Integrations with large language models (OpenAI, Anthropic, or open-source LLMs), contextual assistants for customer inquiry triage, document data extraction agents, and cross-application workflows.",
          needSolved:
            "Drastically cuts down staff hours spent on repetitive classification, repetitive FAQs, or manual data transcription.",
          included: [
            "Structured prompt engineering and secure data pipelines to models",
            "Vector database storage and semantic retrieval for RAG implementations",
            "Webhooks to trigger automated pipelines on business or messaging events",
            "Robust exception handling, retries, and token limits for cost control",
          ],
          limitationsAndDependencies: [
            "AI model token consumption is billed directly by model providers (OpenAI, Anthropic) to the client.",
            "AI models carry uncertainty margins ('hallucinations'); safeguards are implemented, but they do not replace critical human oversight in legal or medical contexts.",
          ],
          howToQuote:
            "Tell us what repetitive process you wish to automate and which tools you currently use (WhatsApp, email, spreadsheets, CRM).",
        },
      ],
    },
    lab: {
      badge: "KYVORA LAB · R&D & Experimentation",
      visionClaim: "Technology for ideas that do not exist yet.",
      featuredLabel: "Featured Laboratory Initiative",
      title: "In-House Product Laboratory",
      subtitle:
        "Research, experimentation, and original software initiatives conceived inside KYVORA. We only showcase real, code-backed engineering.",
      repoBtn: "Repository",
      internalPrototype: "Internal Prototype",
      purposeLabel: "Technical Purpose:",
      contributionText:
        "Want to support sensor development in QuakeNet or Pulso's infrastructure?",
      contributionBtn: "Contribute to a Project in Donate Us",
      resourcesPrompt: "Looking for practical engineering guides?",
      resourcesBtn: "Explore Guides in /recursos",
      projects: {
        pulso: {
          tagline: "Experimental social network focused on real-time interaction.",
          purpose:
            "Exploring community dynamics and instant mobile/web communication with reduced latency and controlled data usage.",
          status: "Beta Phase",
        },
        quakenet: {
          tagline: "Distributed seismic detection and monitoring system.",
          purpose:
            "Building a seismic event monitoring network using micro-sensors and real-time signal aggregation for preliminary geospatial analysis.",
          status: "Experimental",
        },
        "kyvora-studio": {
          tagline: "Multi-track non-linear video editor (NLE) for desktop and web.",
          purpose:
            "Video editing and post-production suite in development on a monorepo architecture with native Windows streaming. Includes multi-track timeline (video, audio, and text), .XTP projects, 1080p 60fps monitor, clip splitting, duplication, and multi-codec rendering with FFmpeg 7.",
          status: "In Development",
        },
        pulsai: {
          tagline: "Analytical assistant connected to local models with web search, documents, and voice.",
          purpose:
            "Experimental prototype of PulsAI Analytics connected to the local gemma4:e2b model via Ollama, with integrated web search, document reading, image input, and voice support.",
          status: "Experimental",
        },
        voicetranslate: {
          tagline: "Real-time bidirectional voice translator with AI and speech synthesis.",
          purpose:
            "Web tool for continuous speech transcription and low-latency contextual translation powered by Web Speech API and Gemini 2.5 Flash, with automatic echo prevention and live conversation mode.",
          status: "Beta Phase",
        },
      },
    },
    pricing: {
      badge: "Commercial Transparency",
      title: "Pricing & Estimates",
      subtitle:
        "Mixed model: standardized rates for scoped deliverables and custom estimates based on required architecture.",
      deliverablesLabel: "Included deliverables:",
      scopeFactorsTitle: "Factors that determine cost in custom projects",
      disclaimer:
        "Reference prices in Colombian Pesos (COP). Final costs are formalized in a commercial proposal and service contract according to technical scope, integration requirements, and agreed milestones.",
      contractConditionsLink: "Contracting Conditions",
      tiers: [
        {
          id: "landing-page",
          title: "Professional Landing Page",
          badge: "Standardized Base",
          description:
            "Design and development of a high-converting website, mobile-responsive, optimized for speed and search engine rankings.",
          priceNote: "From $850,000 COP depending on sections and content",
          deliveryTimeEstimated: "5 to 10 business days",
          deliverables: [
            "Responsive layout across mobile, tablet, and desktop",
            "Up to 5 structured content sections",
            "Contact form with validation and email forwarding",
            "Technical loading performance and foundational SEO optimization",
            "SEO metadata and Open Graph cards for social media",
            "WhatsApp button and basic analytics integration",
          ],
          limitations: [
            "Does not include payment gateways or transactional e-commerce",
            "Client provides final copy, photography, and brand assets",
            "Annual hosting and domain registration covered by the client",
          ],
          ctaText: "Request Landing Page",
        },
        {
          id: "mvp-web-app",
          title: "Web Application / Initial MVP",
          badge: "Digital Product",
          description:
            "Development of an interactive application with user authentication, database, and business logic to validate a product.",
          priceNote: "From $2,800,000 COP depending on modules and flows",
          deliveryTimeEstimated: "3 to 6 weeks",
          deliverables: [
            "Frontend in Next.js / React and backend in Node.js or Supabase",
            "Secure authentication (Email/Password, OAuth)",
            "Relational database modeling (PostgreSQL)",
            "Basic admin panel or user dashboard",
            "Unit tests for critical user flows",
            "Production deployment configured on Vercel / Cloud",
          ],
          limitations: [
            "Additional modules or payment gateways are quoted separately",
            "Cloud infrastructure costs covered directly by the client",
            "Post-launch maintenance formalized via optional SLA",
          ],
          ctaText: "Quote MVP",
        },
        {
          id: "custom-system",
          title: "Custom System / AI & Automation",
          badge: "Full Solution",
          description:
            "Architecture and development of end-to-end platforms, operational process automations, and large language model integrations.",
          priceNote: "Custom quote based on technical specification",
          deliveryTimeEstimated: "Estimated after discovery sessions",
          deliverables: [
            "Functional specification and software architecture document",
            "Frontend, backend, RESTful APIs, and WebSockets development",
            "Integration with AI models (OpenAI, Anthropic, open-source)",
            "Automated data pipelines and scheduled background jobs",
            "Staging and production environments with automated CI/CD",
            "Technical warranty for stability and dedicated support",
          ],
          limitations: [
            "Requires technical discovery phase to define scope",
            "AI API tokens and dedicated servers are provided by the client",
          ],
          ctaText: "Schedule Discovery Session",
        },
      ],
      scopeFactors: [
        {
          title: "Flow volume & complexity",
          description:
            "Systems with multiple states, user roles, or approval hierarchies require more architectural planning and verification time.",
        },
        {
          title: "Third-party integrations",
          description:
            "Connecting payment gateways (Wompi, PSE), CRMs, ERPs, or external APIs requires adapting schemas, webhooks, and idempotency.",
        },
        {
          title: "Infrastructure & persistence",
          description:
            "Database engine choice, low-latency servers, or file storage requirements impact backend engineering demands.",
        },
        {
          title: "Artificial intelligence",
          description:
            "Agents, RAG pipelines, or natural language processing require reliability benchmarks, prompt refinement, and inference cost controls.",
        },
      ],
    },
    process: {
      badge: "KYVORA Methodology",
      title: "5-Stage Progressive Process",
      subtitle:
        "A clear, direct engineering workflow from exploration to evolution, built on tangible checkpoints before advancing.",
      phasePrefix: "Stage",
      steps: [
        {
          num: "01",
          title: "Exploration",
          desc: "We understand your operational or commercial problem, technical constraints, and real context before writing a line of code.",
        },
        {
          num: "02",
          title: "Design",
          desc: "We structure software architecture, data models, key user flows, and visual identity with clarity and intent.",
        },
        {
          num: "03",
          title: "Development",
          desc: "We build with clean, strongly typed, modular code while providing testable progress checkpoints.",
        },
        {
          num: "04",
          title: "Validation",
          desc: "We run security, accessibility, performance, and multi-device responsiveness checks prior to release.",
        },
        {
          num: "05",
          title: "Evolution",
          desc: "We deploy cleanly and hand over a documented, maintainable foundation ready to scale and iterate intentionally.",
        },
      ],
    },
    human: {
      badge: "Human Approach",
      title: "An independent technology studio built on clarity and direct collaboration",
      subtitle:
        "We believe in transparent engineering partnerships: direct dialogue with the people designing and building your product, honest scope boundaries, and technology built to serve real users.",
      pillars: [
        {
          num: "01",
          title: "Direct collaboration",
          desc: "Work directly with the engineering mind designing the architecture and writing your production software.",
        },
        {
          num: "02",
          title: "Clear dialogue",
          desc: "We align on goals, dependencies, and tangible milestones without sales layers or vague buzzwords.",
        },
        {
          num: "03",
          title: "Intentional engineering",
          desc: "We favor proven stacks and maintainable patterns over bloated templates or fragile short-term hacks.",
        },
        {
          num: "04",
          title: "Built for real operations",
          desc: "From crisp websites to custom inventory/management tools, process automation, and thoughtful AI integrations.",
        },
      ],
      closingNote:
        "Operating independently from Valle del Cauca, Colombia — always open to talking through your project or sharing practical guides.",
      resourcesCta: "Explore Guides in /recursos",
      contactCta: "Let's discuss your project",
    },
    donate: {
      badge: "Patronage & Voluntary Contributions",
      title: "Donate Us · Support the Lab",
      subtitle:
        "Fuel the development of open tools, IoT sensors, and experimental software conceived in Colombia.",
      step1Title: "1. Select destination of your contribution",
      step1Badge: "transparent & verifiable",
      targets: [
        {
          id: "general",
          title: "KYVORA General Laboratory Fund",
          description:
            "Open support for research, servers, prototyping, and open-source tool maintenance.",
        },
        {
          id: "quakenet",
          title: "QuakeNet Project (Seismic Detection)",
          description:
            "Resources dedicated to IoT test sensors, calibration, and real-time map servers.",
        },
        {
          id: "pulso",
          title: "Pulso Project (Experimental Social Network)",
          description:
            "Resources for stress testing, WebSocket infrastructure, and latency optimization in beta.",
        },
        {
          id: "pulsai",
          title: "PulsAI Project (Experimental AI)",
          description:
            "Resources for token consumption in LLM APIs and autonomous agent research.",
        },
      ],
      step2Title: "2. Choose or enter amount (in Colombian Pesos - COP)",
      popularBadge: "Suggested",
      customAmountLabel: "Custom COP Amount:",
      customMinText: "Min: $10,000 COP",
      step3Title: "3. Contributor Details (Optional)",
      donorNamePlaceholder: "Name or pseudonym (Optional)",
      donorEmailPlaceholder: "Email address for receipt (Optional)",
      totalLabel: "Total Voluntary Contribution:",
      targetAssignedLabel: "Assigned Project:",
      gatewayLabel: "Payment Gateway:",
      gatewayName: "Wompi Colombia (Bancolombia)",
      proceedBtn: "Continue to Payment with Wompi",
      loadingBtn: "Generating secure Wompi transaction...",
      legalNotice:
        "Contributions are voluntary transfers to an independent natural person in Colombia for the maintenance of technical projects and open-source software. They do not constitute charitable donations (ESAL) or tax-deductible gifts.",
      donateConditionsLink: "Donate Us Legal Terms",
      reversalsPolicyLink: "Payment & Reversal Policy",
      errorMinAmount: "The minimum contribution amount is $10,000 COP.",
      errorMaxAmount: "The contribution amount cannot exceed $50,000,000 COP.",
      errorGeneric: "Error connecting to the payment gateway.",
    },
    contact: {
      badge: "Direct Contact",
      title: "Have something to build?",
      subtitle:
        "Tell us what you have in mind. You don't need a complete spec from day one: we help you shape the technical architecture and scope.",
      channelsTitle: "Official verified channels",
      form: {
        nameLabel: "Full name *",
        namePlaceholder: "E.g.: Daniel Morales",
        emailLabel: "Contact email *",
        emailPlaceholder: "you@company.com",
        serviceLabel: "Service type *",
        serviceDefaultOption: "Select a category",
        serviceOptions: [
          { value: "Landing Page / Web", label: "Web Development & Landing Page" },
          { value: "Aplicación Web/Móvil", label: "Web or Mobile App (MVP)" },
          { value: "Sistema a Medida", label: "Custom Software System" },
          { value: "Automatización / IA", label: "AI Integration & Automation" },
          { value: "Otro", label: "Other technical requirement" },
        ],
        budgetLabel: "Estimated budget (Optional)",
        budgetPlaceholder: "E.g.: $2,000,000 COP or $1,000 USD",
        descLabel: "Project description or need *",
        descPlaceholder:
          "Tell us about your project's goal, key features you envision, or the operational bottleneck you need solved...",
        termsLabel:
          "I authorize KYVORA to process my contact details exclusively to respond to this commercial inquiry, in compliance with the",
        termsLinkText: "Personal Data Protection Policy (Colombian Law 1581 of 2012).",
        submitBtn: "Send Message",
        loadingBtn: "Transmitting message...",
        successTitle: "Message successfully received",
        successDesc:
          "We will review your requirements and reach out to you as quickly as possible.",
        newMsgBtn: "Send another message",
        errorRequiredTerms:
          "You must authorize personal data processing to submit your inquiry.",
        errorGeneric: "An error occurred while submitting your inquiry.",
      },
    },
    footer: {
      description:
        "Independent technology studio in Colombia. We develop modern web solutions, scalable applications, custom software systems, and AI automation.",
      operatingNote: "Operated in Colombia by Independent Natural Person.",
      infraNote: "Infrastructure prepared for Vercel & Wompi.",
      navTitle: "Navigation",
      legalTitle: "Legal Framework Colombia",
      channelsTitle: "Verified Channels",
      sicText: "Superintendence of Industry and Commerce (SIC)",
      allRightsReserved: "All rights reserved. KYVORA Studio & Software.",
      legalNav: [
        { label: "Personal Data", href: "/legal/datos-personales" },
        { label: "Privacy Notice", href: "/legal/privacidad" },
        { label: "Terms of Use", href: "/legal/terminos" },
        { label: "Contracting Conditions", href: "/legal/contratacion" },
        { label: "Payments & Reversals", href: "/legal/pagos-reversiones" },
        { label: "PQRS Channel", href: "/legal/pqrs" },
        { label: "Cookie Policy", href: "/legal/cookies" },
        { label: "Donate Us Terms", href: "/legal/donate" },
      ],
    },
  },
};

