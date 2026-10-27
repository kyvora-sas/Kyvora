import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Scale, ExternalLink, ChevronRight } from "lucide-react";
import logoImg from "@/img/logo.png";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import PrintButton from "@/components/PrintButton";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  normativeBase: string;
  children: React.ReactNode;
}

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  normativeBase,
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[var(--color-accent)] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-surface/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            <Image src={logoImg} alt="KYVORA Logo" width={110} height={36} className="object-contain" priority />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <PrintButton />
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground-muted hover:text-white transition-colors text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Legal Sub-Navigation Bar (Sticky underneath on desktop) */}
      <nav aria-label="Navegación entre documentos legales" className="border-b border-white/5 bg-background/90 backdrop-blur-sm px-6 py-2.5 overflow-x-auto no-print">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-mono whitespace-nowrap scrollbar-none">
          <span className="text-foreground-muted/60 uppercase tracking-widest mr-2 hidden sm:inline">Apartados:</span>
          {siteConfig.legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2.5 py-1 rounded-md text-foreground-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 md:py-16">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Miga de pan" className="mb-6 flex items-center gap-2 text-xs font-mono text-foreground-muted no-print">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-foreground-muted/40" />
          <span className="text-foreground-muted/70">Marco Legal</span>
          <ChevronRight className="w-3.5 h-3.5 text-foreground-muted/40" />
          <span className="text-[var(--color-accent-cyan)] font-medium truncate max-w-xs">{title}</span>
        </nav>

        {/* Print-only Header */}
        <div className="hidden print:block mb-8 pb-4 border-b border-gray-300">
          <h2 className="text-xl font-bold text-black uppercase">KYVORA — Sitio Oficial (www.kyvora.net.co)</h2>
          <p className="text-xs text-gray-700">Operado en Colombia por Persona Natural Independiente</p>
          <p className="text-xs text-gray-700">Documento legal oficial · Fecha de consulta e impresión: {new Date().toLocaleDateString("es-CO")}</p>
        </div>

        <div className="mb-10 pb-8 border-b border-white/10 print:border-gray-300">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] print:text-gray-700 mb-3">
            <Scale className="w-4 h-4 print:hidden" />
            <span>Marco Legal Colombia · {normativeBase}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white print:text-black mb-4">
            {title}
          </h1>
          <p className="text-lg text-foreground-muted print:text-gray-800 leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-foreground-muted/70 print:text-gray-600">
            <span>Última actualización: {lastUpdated}</span>
            <span>·</span>
            <span>Operador: {legalConfig.owner.legalStatus}</span>
            <span className="no-print">·</span>
            <span className="no-print text-[var(--color-accent-cyan)]">Versión Imprimible Disponible</span>
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
            En cumplimiento del Estatuto del Consumidor (Ley 1480 de 2011) y la Ley 2439 de 2024, se informa que la Superintendencia de Industria y Comercio es la autoridad nacional encargada de velar por la protección de los derechos de los consumidores y el debido tratamiento de los datos personales en Colombia.
          </p>
          <a
            href={legalConfig.supervisoryAuthority.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-accent-cyan)] hover:underline"
          >
            <span>Ir al portal de la SIC (www.sic.gov.co)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      {/* Footer Legal Sub-Navigation */}
      <footer className="border-t border-white/10 bg-surface/50 py-10 px-6 mt-12 text-xs text-foreground-muted">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {siteConfig.legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="font-mono text-center md:text-right">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
