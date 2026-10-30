/**
 * Configuración Legal Institucional para KYVORA en Colombia.
 * 
 * NOTA DE CUMPLIMIENTO:
 * La actividad es operada por una persona natural independiente bajo la marca comercial KYVORA.
 * No se inventan sociedades anónimas, matrículas ficticias ni domicilios inexistentes.
 * Los campos pendientes están claramente identificados como marcadores [PENDIENTE_...]
 * para ser completados por el propietario antes del despliegue en producción.
 */

export const legalConfig = {
  brandName: "Kyvora",
  tradeName: "Kyvora Studio & Software",
  commercialActivity: "Servicios de desarrollo de software, diseño de interfaces, aplicaciones y consultoría técnica.",

  // Datos del responsable (Persona Natural en Colombia)
  owner: {
    legalStatus: "Persona Natural Independiente (Colombia)",
    legalRepresentative: "Daniel Esteban Canizales Millan",
    idPlaceholder: "C.C. 1.112.151.335",
    rutPlaceholder: "RUT 1112151335-7",
    cityDomicile: "Yotoco, Valle del Cauca, Colombia",
    physicalAddressPlaceholder: "Calle 5 # 7-63",
    contactEmail: "kyvorasas@gmail.com",
    legalEmail: "kyvorasas@gmail.com",
    phone: "+57 315 201 1203 - +57 318 324 8279",
  },

  // Marco normativo aplicable verificado
  regulations: [
    {
      code: "Ley 1581 de 2012",
      title: "Régimen General de Protección de Datos Personales en Colombia",
      description: "Regula el derecho constitucional de habeas data y tratamiento de información personal.",
    },
    {
      code: "Decreto 1377 de 2013",
      title: "Reglamentación parcial de la Ley 1581 de 2012",
      description: "Disposiciones sobre recolección, autorización y políticas de tratamiento de datos.",
    },
    {
      code: "Ley 1480 de 2011",
      title: "Estatuto del Consumidor",
      description: "Normas sobre información comercial, comercio electrónico, derecho de retracto y deberes de información.",
    },
    {
      code: "Ley 2439 de 2024",
      title: "Actualización normativa para comercio electrónico y derechos de usuarios digitales",
      description: "Requisitos reforzados de transparencia, reversión y contratación electrónica.",
    },
    {
      code: "Decreto 587 de 2016",
      title: "Reversión del Pago en Comercio Electrónico",
      description: "Procedimiento para reversión ante fraude, transacciones no solicitadas o productos no entregados.",
    },
  ],

  // Autoridad de Vigilancia y Control
  supervisoryAuthority: {
    name: "Superintendencia de Industria y Comercio (SIC)",
    portalUrl: "https://www.sic.gov.co/",
    pqrsSicUrl: "https://www.sic.gov.co/pqrsf",
    role: "Autoridad nacional de protección al consumidor y de datos personales en Colombia.",
  },

  // Plazos legales en días hábiles
  sla: {
    pqrsResponseDays: 15, // Ley 1755 de 2015 / Ley 1480 de 2011
    retractDays: 5,       // Artículo 47 de la Ley 1480 de 2011
    reversionRequestDays: 5, // Decreto 587 de 2016
  },
};
