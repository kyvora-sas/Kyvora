import type { Metadata } from "next";
import PqrsContent from "@/components/legal/PqrsContent";

export const metadata: Metadata = {
  title: "Canal Oficial de Reclamaciones y PQRS",
  description:
    "Sistema operativo de radicación, trazabilidad y gestión formal de Peticiones, Quejas, Reclamos (PQRS) y Reversión de Pago en Colombia conforme a la Ley 1755 de 2015, Ley 1480 de 2011 y Decreto 587 de 2016.",
  alternates: {
    canonical: "/legal/pqrs",
    languages: {
      es: "/legal/pqrs",
      en: "/legal/pqrs?lang=en",
    },
  },
};

export default function PqrsPage() {
  return <PqrsContent />;
}
