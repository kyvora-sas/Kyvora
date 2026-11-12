import type { Metadata } from "next";
import PrivacyContent from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de privacidad comercial e institucional de Kyvora de conformidad con los artículos 14 y 15 del Decreto 1377 de 2013 en Colombia.",
  alternates: {
    canonical: "/legal/privacidad",
    languages: { es: "/legal/privacidad", en: "/legal/privacidad?lang=en" },
  },
};

export default function PrivacidadPage() {
  return <PrivacyContent />;
}
