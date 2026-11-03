import type { Metadata } from "next";
import ContractContent from "@/components/legal/ContractContent";

export const metadata: Metadata = {
  title: "Condiciones Generales de Contratación — KYVORA",
  description:
    "Condiciones generales de contratación y prestación de servicios de software, desarrollo web y sistemas a la medida de KYVORA en Colombia.",
};

export default function ContratacionPage() {
  return <ContractContent />;
}
