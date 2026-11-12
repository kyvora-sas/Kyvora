import type { Metadata } from "next";
import DonateLegalContent from "@/components/legal/DonateLegalContent";

export const metadata: Metadata = {
  title: "Condiciones Legales de Aportes Voluntarios (Donate Us)",
  description:
    "Términos jurídicos, marco tributario y condiciones de transparencia de los aportes económicos voluntarios al laboratorio tecnológico de KYVORA en Colombia.",
  alternates: {
    canonical: "/legal/donate",
    languages: { es: "/legal/donate", en: "/legal/donate?lang=en" },
  },
};

export default function DonateLegalPage() {
  return <DonateLegalContent />;
}
