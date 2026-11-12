import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { LanguageProvider } from "@/context/LanguageContext";

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
    default: "KYVORA — Tecnología con intención | Estudio Tecnológico y Lab en Colombia",
    template: "%s | KYVORA",
  },
  description: siteConfig.description,
  keywords: [
    "KYVORA",
    "KYVORA Studio",
    "KYVORA Lab",
    "Desarrollo web Colombia",
    "Desarrollo de software a la medida Colombia",
    "Aplicaciones web Next.js Colombia",
    "Automatización e Inteligencia Artificial",
    "Estudio tecnológico Valle del Cauca",
    "QuakeNet",
    "Pulso",
    "VoiceTranslate",
  ],
  authors: [{ name: "KYVORA", url: siteConfig.url }],
  creator: "KYVORA",
  publisher: "KYVORA",
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/?lang=en",
    },
  },
  openGraph: {
    title: "KYVORA — Tecnología con intención | Studio & Lab",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "KYVORA",
    locale: "es_CO",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KYVORA — Tecnología con intención | Estudio Tecnológico",
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
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: "KYVORA",
        description: siteConfig.description,
        inLanguage: ["es-CO", "en"],
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: "KYVORA",
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/icon.svg`,
        },
        description: siteConfig.description,
        email: siteConfig.contacts.email,
        sameAs: [
          siteConfig.contacts.githubUrl,
          siteConfig.contacts.instagramUrl,
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: siteConfig.contacts.whatsappNumber,
          email: siteConfig.contacts.email,
          contactType: "customer service",
          areaServed: ["CO", "Valle del Cauca"],
          availableLanguage: ["Spanish", "English"],
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#service`,
        name: "KYVORA Studio",
        url: siteConfig.url,
        description: siteConfig.description,
        priceRange: "$$",
        areaServed: [
          { "@type": "Country", name: "Colombia" },
          { "@type": "AdministrativeArea", name: "Valle del Cauca" },
        ],
        address: {
          "@type": "PostalAddress",
          addressRegion: "Valle del Cauca",
          addressCountry: "CO",
        },
        provider: {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
    ],
  };

  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
