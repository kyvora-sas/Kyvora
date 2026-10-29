import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { GithubIcon, InstagramIcon } from "@/components/SocialIcons";
import logoImg from "@/img/logo.png";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/10 pt-16 pb-12 text-sm text-foreground-muted font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Info (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block" aria-label="KYVORA - Inicio">
              <Image src={logoImg} alt="KYVORA Logo" width={130} height={42} className="object-contain" />
            </Link>
            <p className="text-foreground-muted text-sm font-light leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
            <div className="text-xs font-mono text-foreground-muted/70 space-y-1">
              <div>Operado en Colombia por Persona Natural Independiente.</div>
              <div>Infraestructura preparada para Vercel & Wompi.</div>
            </div>
          </div>

          {/* Navigation Links (Cols 5-6) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Pages (Cols 7-9) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Marco Legal Colombia
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              {siteConfig.legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[var(--color-accent-cyan)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Channels & SIC (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Canales Verificados
            </h4>
            <div className="flex flex-wrap gap-3">
              <a
                href={siteConfig.contacts.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="WhatsApp oficial de KYVORA"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </a>
              <a
                href={siteConfig.contacts.emailHref}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="Correo de contacto de KYVORA"
              >
                <Mail className="w-4 h-4 text-blue-400" />
              </a>
              <a
                href={siteConfig.contacts.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="GitHub oficial de KYVORA"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contacts.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="Instagram oficial de KYVORA"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
              </a>
            </div>

            {/* SIC Required Badge */}
            <div className="p-3.5 rounded-xl bg-background/60 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-white">
                <ShieldCheck className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                <span>Superintendencia de Industria y Comercio</span>
              </div>
              <p className="text-[11px] text-foreground-muted leading-tight font-light">
                Protección al consumidor y datos personales (Ley 1480 de 2011).
              </p>
              <a
                href={siteConfig.contacts.sicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-accent-cyan)] hover:underline"
              >
                <span>Portal oficial SIC</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-foreground-muted/70">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <span>·</span>
            <Link href="/legal/terminos" className="hover:text-white transition-colors">
              Términos
            </Link>
            <span>·</span>
            <Link href="/legal/pqrs" className="hover:text-white transition-colors">
              Radicar PQRS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
