import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResourcesHubClient } from "@/components/recursos/ResourcesHubClient";
import { getPublishedArticles } from "@/content/recursos/helpers";

export const metadata: Metadata = {
  title: "Technical Guides & Resources",
  description:
    "Practical engineering guides from KYVORA covering website development costs in Colombia, web app architecture, and purposeful AI integration.",
  alternates: {
    canonical: "/recursos/en",
    languages: {
      es: "/recursos",
      en: "/recursos/en",
    },
  },
  openGraph: {
    title: "Technical Guides & Resources | KYVORA",
    description:
      "Honest guides on software scoping, web architecture vs. web apps, and practical AI engineering.",
    url: "/recursos/en",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "KYVORA — Technology with intent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Guides & Resources | KYVORA",
    images: ["/twitter-image"],
  },
};

export default function RecursosEnPage() {
  const articles = getPublishedArticles();

  return (
    <>
      <Navbar />
      <ResourcesHubClient articles={articles} lang="en" />
      <Footer />
    </>
  );
}

