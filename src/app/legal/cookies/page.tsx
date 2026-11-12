import type { Metadata } from "next";
import CookiesContent from "@/components/legal/CookiesContent";

export const metadata: Metadata = {
  title: "Política de Cookies y Tecnologías Similares",
  description:
    "Política técnica sobre el uso exclusivo de cookies esenciales, almacenamiento local y ausencia de rastreadores publicitarios en KYVORA conforme a la normativa colombiana.",
  alternates: {
    canonical: "/legal/cookies",
    languages: { es: "/legal/cookies", en: "/legal/cookies?lang=en" },
  },
};

export default function CookiesPage() {
  return <CookiesContent />;
}
