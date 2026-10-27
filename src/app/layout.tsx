import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "KYVORA — Estudio Tecnológico y de Software en Colombia",
    template: "%s | KYVORA",
  },
  description: siteConfig.description,
  keywords: [
    "Desarrollo web Colombia",
    "Desarrollo de software a la medida",
    "Aplicaciones Next.js Colombia",
    "Automatización e Inteligencia Artificial",
    "Estudio tecnológico independiente",
    "KYVORA",
    "QuakeNet",
    "Pulso",
  ],
  authors: [{ name: "KYVORA", url: siteConfig.url }],
  creator: "KYVORA",
  publisher: "KYVORA",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KYVORA — Software Real para Ideas Complejas",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KYVORA — Estudio Tecnológico y de Software",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/img/logo.png`,
        description: siteConfig.description,
        sameAs: [
          siteConfig.contacts.githubUrl,
          siteConfig.contacts.instagramUrl,
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: siteConfig.contacts.whatsappNumber,
          contactType: "customer service",
          areaServed: "CO",
          availableLanguage: ["Spanish"],
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#service`,
        name: siteConfig.name,
        url: siteConfig.url,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressCountry: "CO",
        },
      },
    ],
  };

  return (
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
