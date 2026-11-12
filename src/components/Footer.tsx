"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { GithubIcon, InstagramIcon } from "@/components/SocialIcons";
import KyvoraLogo from "@/components/brand/KyvoraLogo";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const resolveHref = (rawHref: string) => {
    if (rawHref === "/recursos") {
      return language === "en" ? "/recursos/en" : "/recursos";
    }
    if (rawHref.startsWith("#") && !isHome) {
      return `/${rawHref}`;
    }
    return rawHref;
  };

  const navLinks = [
    { href: "#servicios", label: t.nav.services },
    { href: "#laboratorio", label: t.nav.lab },
    { href: "#precios", label: t.nav.pricing },
    { href: "#proceso", label: t.nav.process },
    { href: "/recursos", label: t.nav.resources },
    { href: "#donate", label: t.nav.donate },
    { href: "#contacto", label: t.nav.contact },
  ];

  return (
    <footer className="bg-[#080B12] border-t border-[#252D3A] pt-16 pb-12 text-sm text-[#9AA5B8] font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-14">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Info (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
              aria-label="KYVORA - Inicio"
            >
              <KyvoraLogo variant="lockup" size="md" />
            </Link>
            <p className="text-[#AFC4E8] text-xs font-mono uppercase tracking-[0.16em]">
              {language === "en" ? "Technology with intent." : "Tecnología con intención."}
            </p>
            <p className="text-[#9AA5B8] text-sm font-light leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            <div className="text-xs font-mono text-[#AFC4E8]/75 space-y-1 border-l border-[#252D3A] pl-3">
              <div>{t.footer.operatingNote}</div>
              <div>{t.footer.infraNote}</div>
            </div>
          </div>

          {/* Navigation Links (Cols 5-6) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              {t.footer.navTitle}
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={resolveHref(item.href)} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Pages (Cols 7-9) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              {t.footer.legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#2B85FF] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Channels & SIC (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              {t.footer.channelsTitle}
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div>{siteConfig.contacts.whatsappNumber}</div>
              <div>{siteConfig.contacts.email}</div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={siteConfig.contacts.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 text-white transition-colors"
                aria-label="WhatsApp oficial de KYVORA"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${siteConfig.contacts.email}`}
                className="p-2.5 rounded-lg bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 text-white transition-colors"
                aria-label="Correo de contacto de KYVORA"
              >
                <Mail className="w-4 h-4 text-[#2B85FF]" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.contacts.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 text-white transition-colors"
                aria-label="GitHub oficial de KYVORA"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contacts.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 text-white transition-colors"
                aria-label="Instagram oficial de KYVORA"
              >
                <InstagramIcon className="w-4 h-4 text-[#AFC4E8]" />
              </a>
            </div>

            {/* SIC Required Badge */}
            <div className="p-3.5 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-white">
                <ShieldCheck className="w-4 h-4 text-[#2B85FF]" aria-hidden="true" />
                <span>Superintendencia de Industria y Comercio</span>
              </div>
              <p className="text-[11px] text-[#9AA5B8] leading-tight font-light">
                {t.footer.sicText}
              </p>
              <a
                href={siteConfig.contacts.sicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5CA8FF] hover:underline"
              >
                <span>{language === "en" ? "Official SIC Portal" : "Portal oficial SIC"}</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-[#252D3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9AA5B8]/80 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} KYVORA. {t.footer.allRightsReserved}
          </div>
          <div>
            {language === "en"
              ? "Engineering Studio & Product Lab · Valle del Cauca, Colombia"
              : "Estudio de Ingeniería y Laboratorio · Valle del Cauca, Colombia"}
          </div>
        </div>
      </div>
    </footer>
  );
}
