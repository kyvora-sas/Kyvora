import type { Metadata } from "next";
import TermsContent from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
  description:
    "Términos y condiciones generales de acceso, navegación y uso del portal oficial de KYVORA de conformidad con la legislación colombiana.",
  alternates: {
    canonical: "/legal/terminos",
    languages: { es: "/legal/terminos", en: "/legal/terminos?lang=en" },
  },
};

export default function TerminosPage() {
  return <TermsContent />;
}
