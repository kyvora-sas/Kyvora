import type { Metadata } from "next";
import PaymentsReversalsContent from "@/components/legal/PaymentsReversalsContent";

export const metadata: Metadata = {
  title: "Pagos, Retracto y Reversión del Pago",
  description:
    "Información legal integral sobre medios de pago, confirmación de transacciones, derecho de retracto y procedimiento de reversión del pago en Colombia según la Ley 1480 de 2011, Ley 2439 de 2024 y Decreto 587 de 2016.",
  alternates: {
    canonical: "/legal/pagos-reversiones",
    languages: { es: "/legal/pagos-reversiones", en: "/legal/pagos-reversiones?lang=en" },
  },
};

export default function PagosReversionesPage() {
  return <PaymentsReversalsContent />;
}
