import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResourcesHubClient } from "@/components/recursos/ResourcesHubClient";
import { getPublishedArticles } from "@/content/recursos/helpers";

export const metadata: Metadata = {
  title: "Recursos y Guías Técnicas",
  description:
    "Guías prácticas de KYVORA sobre desarrollo web en Colombia, costos reales, arquitectura de aplicaciones e integración de IA con criterio.",
  alternates: {
    canonical: "/recursos",
    languages: {
      es: "/recursos",
      en: "/recursos/en",
    },
  },
  openGraph: {
    title: "Recursos y Guías Técnicas | KYVORA",
    description:
      "Guías técnicas honestas sobre costos reales de desarrollo web en Colombia, arquitectura de software y criterio al integrar IA.",
    url: "/recursos",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "KYVORA — Tecnología con intención",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos y Guías Técnicas | KYVORA",
    images: ["/twitter-image"],
  },
};

export default function RecursosPage() {
  const articles = getPublishedArticles();

  return (
    <>
      <Navbar />
      <ResourcesHubClient articles={articles} lang="es" />
      <Footer />
    </>
  );
}

