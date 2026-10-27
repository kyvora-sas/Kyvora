export interface PricingTier {
  id: string;
  category: "estandar" | "personalizado" | "alcance-variable";
  title: string;
  badge?: string;
  description: string;
  startingPriceCOP?: number;
  priceNote: string;
  deliveryTimeEstimated: string;
  deliverables: string[];
  limitations: string[];
  scopeFactors?: string[];
  ctaText: string;
  ctaAction: "contacto" | "cotizar";
}

export const pricingConfig = {
  currency: "COP",
  currencySymbol: "$",
  disclaimer:
    "Precios referenciales en pesos colombianos (COP). El costo definitivo se formaliza en una propuesta comercial y contrato de servicios de acuerdo con el alcance técnico, requerimientos de integración y plazos acordados.",
  
  tiers: [
    {
      id: "landing-page",
      category: "estandar",
      title: "Landing Page Profesional",
      badge: "Base Estandarizada",
      description: "Diseño y desarrollo de sitio web de alta conversión, adaptado a dispositivos móviles, optimizado para SEO y velocidad.",
      startingPriceCOP: 850000,
      priceNote: "Desde $850.000 COP según secciones y contenido",
      deliveryTimeEstimated: "5 a 10 días hábiles",
      deliverables: [
        "Estructura visual responsive (móvil, tablet, desktop)",
        "Hasta 5 secciones de contenido estructurado",
        "Formulario de contacto con validación y reenvío por correo",
        "Optimización de rendimiento Lighthouse (>90)",
        "Metadatos SEO y tarjetas Open Graph para redes sociales",
        "Integración con WhatsApp y analítica básica",
      ],
      limitations: [
        "No incluye pasarela de pagos ni comercio electrónico transaccional",
        "El cliente provee textos finales, fotografía y activos de marca",
        "Hosting y dominio anual corren por cuenta del cliente",
      ],
      ctaText: "Solicitar Landing Page",
      ctaAction: "contacto",
    },
    {
      id: "mvp-web-app",
      category: "alcance-variable",
      title: "Aplicación Web / MVP Inicial",
      badge: "Producto Digital",
      description: "Desarrollo de aplicación interactiva con autenticación de usuarios, base de datos y lógica de negocio para validar un producto.",
      startingPriceCOP: 2800000,
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
      scopeFactors: [
        "Número de roles de usuario y permisos",
        "Complejidad de consultas y reportes",
        "Integraciones con APIs de terceros",
      ],
      ctaText: "Cotizar MVP",
      ctaAction: "cotizar",
    },
    {
      id: "custom-system",
      category: "personalizado",
      title: "Sistema a Medida / Automatización e IA",
      badge: "Solución Integral",
      description: "Arquitectura y desarrollo de plataformas completas, automatizaciones de procesos operativos e integración de modelos de lenguaje.",
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
      scopeFactors: [
        "Volumen de transacciones esperadas y concurrencia",
        "Nivel de seguridad y cifrado requerido",
        "Flujos de automatización y herramientas a integrar",
      ],
      ctaText: "Agendar Sesión de Descubrimiento",
      ctaAction: "cotizar",
    },
  ] as PricingTier[],

  scopeFactorsExplanation: [
    {
      title: "Volumen y complejidad de flujos",
      description: "Sistemas con múltiples estados, roles de usuario o aprobaciones requieren mayor tiempo de arquitectura y validación.",
    },
    {
      title: "Integraciones de terceros",
      description: "Conectar pasarelas de pago (Wompi, PSE), CRMs, ERPs o APIs externas requiere adaptar esquemas y gestionar webhooks e idempotencia.",
    },
    {
      title: "Infraestructura y persistencia",
      description: "El tipo de base de datos, servidores de baja latencia o almacenamiento de archivos influye en la ingeniería requerida.",
    },
    {
      title: "Inteligencia artificial",
      description: "Agentes, pipelines RAG o procesamiento de lenguaje natural demandan pruebas de fiabilidad, prompts y control de costes por inferencia.",
    },
  ],
};
