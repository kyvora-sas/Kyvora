import type { Metadata } from "next";
import DonateLegalContent from "@/components/legal/DonateLegalContent";

export const metadata: Metadata = {
  title: "Condiciones Legales de Aportes Voluntarios (Donate Us) — KYVORA",
  description:
    "Términos jurídicos, marco tributario y condiciones de transparencia de los aportes económicos voluntarios al laboratorio tecnológico de KYVORA en Colombia.",
};

export default function DonateLegalPage() {
  return <DonateLegalContent />;
}
