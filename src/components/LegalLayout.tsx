"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, ExternalLink, ChevronRight } from "lucide-react";
import KyvoraLogo from "@/components/brand/KyvoraLogo";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import PrintButton from "@/components/PrintButton";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  normativeBase: string;
  children: React.ReactNode;
}

const legalNavMap: Record<string, { es: string; en: string }> = {
  "/legal/terminos": { es: "Términos y Condiciones", en: "Terms & Conditions" },
  "/legal/privacidad": { es: "Aviso de Privacidad", en: "Privacy Notice" },
  "/legal/datos-personales": { es: "Tratamiento de Datos", en: "Data Processing" },
  "/legal/cookies": { es: "Cookies y Tecnologías", en: "Cookies & Tracking" },
  "/legal/contratacion": { es: "Condiciones de Contratación", en: "Contract Terms" },
  "/legal/pagos-reversiones": { es: "Pagos y Reversiones", en: "Payments & Reversals" },
  "/legal/donate": { es: "Condiciones Donate Us", en: "Donate Us Terms" },
  "/legal/pqrs": { es: "Canal de PQRS", en: "PQRS Claims" },
};

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  normativeBase,
  children,
}: LegalLayoutProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[var(--color-accent)] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-surface/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] rounded-lg p-1" aria-label="KYVORA - Inicio">
            <KyvoraLogo variant="lockup" size="sm" />
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 text-sm">
            <LanguageToggle />
            <PrintButton
              label={isEn ? "Print / Save PDF" : "Imprimir / Guardar PDF"}
              ariaLabel={
                isEn
                  ? "Print this legal document or save it as PDF"
                  : "Imprimir este documento legal o guardarlo en PDF"
              }
            />
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground-muted hover:text-white transition-colors text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? "Home" : "Inicio"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Legal Sub-Navigation Bar (Sticky underneath on desktop) */}
      <nav
        aria-label={isEn ? "Legal documents navigation" : "Navegación entre documentos legales"}
        className="border-b border-white/5 bg-background/90 backdrop-blur-sm px-4 sm:px-6 py-2.5 no-print"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 text-xs font-mono whitespace-nowrap overflow-x-auto lg:overflow-visible lg:flex-wrap lg:whitespace-normal [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-foreground-muted/60 uppercase tracking-widest mr-2 hidden sm:inline">
            {isEn ? "Sections:" : "Apartados:"}
          </span>
          {siteConfig.legalNav.map((item) => {
            const label = legalNavMap[item.href]?.[language] || item.label;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-2.5 py-1 rounded-md text-foreground-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 md:py-16">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label={isEn ? "Breadcrumbs" : "Miga de pan"}
          className="mb-6 flex items-center gap-2 text-xs font-mono text-foreground-muted no-print"
        >
          <Link href="/" className="hover:text-white transition-colors">
            {isEn ? "Home" : "Inicio"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-foreground-muted/40" />
          <span className="text-foreground-muted/70">{isEn ? "Legal Framework" : "Marco Legal"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-foreground-muted/40" />
          <span className="text-[var(--color-accent-cyan)] font-medium truncate max-w-xs">{title}</span>
        </nav>

        {/* Print-only Header */}
        <div className="hidden print:block mb-8 pb-4 border-b border-gray-300">
          <h2 className="text-xl font-bold text-black uppercase">KYVORA — {isEn ? "Official Site" : "Sitio Oficial"} (www.kyvora.net.co)</h2>
          <p className="text-xs text-gray-700">
            {isEn ? "Operated in Colombia by an Independent Natural Person" : "Operado en Colombia por Persona Natural Independiente"}
          </p>
          <p className="text-xs text-gray-700">
            {isEn ? "Official legal document · Consultation and print date:" : "Documento legal oficial · Fecha de consulta e impresión:"}{" "}
            {new Date().toLocaleDateString(isEn ? "en-US" : "es-CO")}
          </p>
        </div>

        <div className="mb-10 pb-8 border-b border-white/10 print:border-gray-300">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] print:text-gray-700 mb-3">
            <Scale className="w-4 h-4 print:hidden" />
            <span>
              {isEn ? `Colombian Legal Framework · ${normativeBase}` : `Marco Legal Colombia · ${normativeBase}`}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white print:text-black mb-4">
            {title}
          </h1>
          <p className="text-lg text-foreground-muted print:text-gray-800 leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-foreground-muted/70 print:text-gray-600">
            <span>{isEn ? "Last updated:" : "Última actualización:"} {lastUpdated}</span>
            <span>·</span>
            <span>{isEn ? "Operator:" : "Operador:"} {isEn ? "Independent Natural Person (Colombia)" : legalConfig.owner.legalStatus}</span>
            <span className="no-print">·</span>
            <span className="no-print text-[var(--color-accent-cyan)]">
              {isEn ? "Printable Version Available" : "Versión Imprimible Disponible"}
            </span>
          </div>
        </div>

        {/* Legal Document Content */}
        <article className="prose prose-invert max-w-none space-y-8 text-foreground/90 leading-relaxed font-light text-base md:text-lg">
          {children}
        </article>

        {/* SIC Advisory Box */}
        <div className="mt-16 p-6 rounded-lg bg-surface border border-white/10 space-y-4">
          <div className="flex items-center gap-3 text-white font-medium">
            <ShieldCheck className="w-5 h-5 text-[var(--color-accent-cyan)]" />
            <span>Superintendencia de Industria y Comercio (SIC)</span>
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed">
            {isEn
              ? "In compliance with the Consumer Protection Statute (Law 1480 of 2011) and Law 2439 of 2024, please note that the Superintendence of Industry and Commerce (SIC) is the national supervisory authority in Colombia responsible for protecting consumer rights and supervising personal data processing."
              : "En cumplimiento del Estatuto del Consumidor (Ley 1480 de 2011) y la Ley 2439 de 2024, se informa que la Superintendencia de Industria y Comercio es la autoridad nacional encargada de velar por la protección de los derechos de los consumidores y el debido tratamiento de los datos personales en Colombia."}
          </p>
          <a
            href={legalConfig.supervisoryAuthority.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-accent-cyan)] hover:underline"
          >
            <span>{isEn ? "Visit official SIC portal (www.sic.gov.co)" : "Ir al portal de la SIC (www.sic.gov.co)"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      {/* Footer Legal Sub-Navigation */}
      <footer className="border-t border-white/10 bg-surface/50 py-10 px-6 mt-12 text-xs text-foreground-muted">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {siteConfig.legalNav.map((item) => {
              const label = legalNavMap[item.href]?.[language] || item.label;
              return (
                <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
                  {label}
                </Link>
              );
            })}
          </div>
          <div className="font-mono text-center md:text-right">
            © {new Date().getFullYear()} {siteConfig.name}. {isEn ? "All rights reserved." : "Todos los derechos reservados."}
          </div>
        </div>
      </footer>
    </div>
  );
}
