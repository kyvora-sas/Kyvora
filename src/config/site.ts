export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "KYVORA",
  legalName: "KYVORA",
  tradeName: "KYVORA Studio & Software",
  operatorType: "Persona Natural Independiente en Colombia",
  tagline: "Tecnología para ideas que todavía no existen.",
  description:
    "Estudio tecnológico independiente en Colombia. Desarrollamos soluciones web modernas, aplicaciones escalables, sistemas a medida y automatizaciones con IA.",
  url: "https://www.kyvora.net.co",
  country: "Colombia",
  currency: "COP",

  contacts: {
    whatsappNumber: "+57 315 201 1203 - +57 318 324 8279",
    whatsappUrl: "https://wa.me/573152011203?text=Hola%20Kyvora,%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto",
    email: "kyvorasas@gmail.com",
    githubUrl: "https://github.com/Kyvora-org",
    instagramUrl: "https://www.instagram.com/_kyvora_/",
    sicUrl: "https://www.sic.gov.co/",
  },

  navigation: [
    { label: "Servicios", href: "#servicios" },
    { label: "Laboratorio", href: "#laboratorio" },
    { label: "Precios", href: "#precios" },
    { label: "Proceso", href: "#proceso" },
    { label: "Donate Us", href: "#donate" },
    { label: "Contacto", href: "#contacto" },
  ] as NavItem[],

  legalNav: [
    { label: "Datos Personales", href: "/legal/datos-personales" },
    { label: "Aviso de Privacidad", href: "/legal/privacidad" },
    { label: "Términos de Uso", href: "/legal/terminos" },
    { label: "Condiciones de Contratación", href: "/legal/contratacion" },
    { label: "Pagos y Reversiones", href: "/legal/pagos-reversiones" },
    { label: "Canal PQRS", href: "/legal/pqrs" },
    { label: "Política de Cookies", href: "/legal/cookies" },
    { label: "Condiciones Donate Us", href: "/legal/donate" },
  ] as NavItem[],
};
