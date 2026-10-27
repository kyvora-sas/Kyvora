export interface DonationOption {
  amountCOP: number;
  label: string;
  popular?: boolean;
}

export const wompiConfig = {
  environment: (process.env.WOMPI_ENVIRONMENT || "sandbox") as "sandbox" | "production",
  currency: "COP",
  minAmountCOP: 10000, // Límite mínimo legal/operativo en Wompi COP ($10.000 COP)
  maxAmountCOP: 50000000, // Límite máximo de control anti-abuso ($50.000.000 COP)
  
  // URLs oficiales de la pasarela Wompi
  checkoutUrl: "https://checkout.wompi.co/p/",
  widgetScriptUrl: "https://checkout.wompi.co/widget.js",
  apiBaseUrl: {
    sandbox: "https://sandbox.wompi.co/v1",
    production: "https://production.wompi.co/v1",
  },

  // Montos sugeridos en COP para Donate Us
  suggestedAmounts: [
    { amountCOP: 20000, label: "$20.000 COP" },
    { amountCOP: 50000, label: "$50.000 COP", popular: true },
    { amountCOP: 100000, label: "$100.000 COP" },
    { amountCOP: 250000, label: "$250.000 COP" },
  ] as DonationOption[],

  // Destinos de aportes admitidos
  targets: [
    {
      id: "general",
      title: "Fondo General del Laboratorio KYVORA",
      description: "Apoyo libre para investigación, servidores, prototipado y mantenimiento de herramientas de acceso abierto.",
    },
    {
      id: "quakenet",
      title: "Proyecto QuakeNet (Detección Sísmica)",
      description: "Recursos destinados a adquisición de sensores IoT de prueba, calibración y servidores para el mapa en tiempo real.",
    },
    {
      id: "pulso",
      title: "Proyecto Pulso (Red Social Experimental)",
      description: "Recursos orientados a pruebas de estrés, infraestructura de WebSockets y optimización de latencia en la beta.",
    },
    {
      id: "pulsai",
      title: "Proyecto PulsAI (IA Experimental)",
      description: "Recursos para cobertura de tokens en APIs de modelos de lenguaje e investigación en agentes autónomos.",
    },
  ],
};
