import type { Metadata } from "next";
import TermsContent from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso — KYVORA",
  description:
    "Términos y condiciones generales de acceso, navegación y uso del portal oficial de KYVORA de conformidad con la legislación colombiana.",
};

export default function TerminosPage() {
  return <TermsContent />;
}
