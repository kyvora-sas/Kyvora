"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import KyvoraLogo from "@/components/brand/KyvoraLogo";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { KYVORA_DURATION, KYVORA_EASE } from "@/lib/motion";

const SECTION_HASHES = ["#servicios", "#laboratorio", "#precios", "#proceso", "#donate", "#contacto"];

export default function Navbar() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeDrawerBtnRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";

  const resolveNavHref = (rawHref: string): string => {
    if (rawHref === "/recursos") {
      return language === "en" ? "/recursos/en" : "/recursos";
    }
    if (rawHref.startsWith("#") && !isHome) {
      return `/${rawHref}`;
    }
    return rawHref;
  };

  const navLabels: Record<string, string> = {
    "#servicios": t.nav.services,
    "#laboratorio": t.nav.lab,
    "#precios": t.nav.pricing,
    "#proceso": t.nav.process,
    "/recursos": t.nav.resources,
    "#donate": t.nav.donate,
    "#contacto": t.nav.contact,
  };

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Seguimiento pasivo de sección activa en la portada
  useEffect(() => {
    if (!isHome || typeof IntersectionObserver === "undefined") {
      return;
    }

    const elements = SECTION_HASHES.map((hash) => document.getElementById(hash.slice(1))).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHash(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  // Lock body scroll and set initial focus inside dialog when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        closeDrawerBtnRef.current?.focus();
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key & strict Focus Trap when mobile drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  return (
    <>
      <a href="#contenido-principal" className="skip-link">
        {t.nav.skipLink}
      </a>

      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#080B12]/92 backdrop-blur-xl border-b border-[#252D3A] py-3 shadow-2xl shadow-black/50"
            : "bg-[#080B12]/60 backdrop-blur-sm py-4 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 min-[360px]:px-5 sm:px-6 flex items-center justify-between gap-2 min-[360px]:gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] rounded-lg p-1 shrink-0"
            aria-label="KYVORA - Inicio"
          >
            <KyvoraLogo
              variant="lockup"
              size="md"
              className="transition-transform group-hover:scale-[1.01] max-[359px]:gap-2 max-[359px]:[&>svg]:h-5 max-[359px]:[&>span]:text-sm max-[359px]:[&>span]:tracking-[0.16em]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium"
            aria-label={t.nav.navigationLabel}
          >
            {siteConfig.navigation.map((item) => {
              const targetHref = resolveNavHref(item.href);
              const isRecursos = item.href === "/recursos" && pathname?.startsWith("/recursos");
              const isSectionActive = isHome && item.href.startsWith("#") && activeHash === item.href;
              const isActive = isRecursos || isSectionActive;

              return (
                <Link
                  key={item.href}
                  href={targetHref}
                  className={`transition-colors relative py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] rounded whitespace-nowrap ${
                    isActive ? "text-white font-semibold" : "text-[#9AA5B8] hover:text-white"
                  }`}
                >
                  <span>{navLabels[item.href] || item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#1677FF]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden lg:flex items-center gap-3.5 shrink-0">
            <LanguageToggle />
            <Link
              href={resolveNavHref("#contacto")}
              className="px-4 py-2.5 bg-[#1677FF] hover:bg-[#2B85FF] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-[#1677FF]/25 hover:shadow-[#1677FF]/40 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.nav.startProject}</span>
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2 min-[360px]:gap-3 shrink-0">
            <LanguageToggle />
            <button
              ref={triggerRef}
              type="button"
              onClick={() => (isOpen ? closeMenu() : setIsOpen(true))}
              className="p-2 text-[#AFC4E8] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] rounded-lg border border-[#252D3A] bg-[#0D121D]/90"
              aria-expanded={isOpen}
              aria-controls="kyvora-mobile-drawer"
              aria-label={
                isOpen
                  ? language === "en"
                    ? "Close navigation menu"
                    : "Cerrar menú de navegación"
                  : language === "en"
                  ? "Open navigation menu"
                  : "Abrir menú de navegación"
              }
            >
              {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay con Framer Motion + Backdrop & Focus Trap */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="kyvora-mobile-drawer"
            ref={drawerRef}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeMenu();
            }}
            initial={prefersReduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: KYVORA_DURATION.base, ease: KYVORA_EASE.standard }}
            className="fixed inset-0 z-50 bg-[#080B12]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.mobileNavTitle}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#252D3A] pb-4">
                <div className="flex items-center gap-3">
                  <KyvoraLogo variant="mark" size="sm" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#AFC4E8]">
                    {t.nav.mobileNavTitle}
                  </span>
                </div>
                <button
                  ref={closeDrawerBtnRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label={language === "en" ? "Close menu" : "Cerrar menú"}
                  className="p-2 rounded-lg border border-[#252D3A] bg-[#0D121D] text-[#AFC4E8] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex flex-col space-y-1.5" aria-label={t.nav.mobileNavTitle}>
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={resolveNavHref(item.href)}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-display font-bold tracking-tight text-white hover:text-[#2B85FF] transition-colors py-3 flex items-center justify-between border-b border-[#252D3A]/60"
                  >
                    <span>{navLabels[item.href] || item.label}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#9AA5B8]" aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#252D3A]">
              <Link
                href={resolveNavHref("#contacto")}
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-[#1677FF] hover:bg-[#2B85FF] text-white text-center text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#1677FF]/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>{t.nav.startProject}</span>
              </Link>
              <div className="text-center text-xs text-[#9AA5B8] font-mono">
                {t.nav.operatingFrom} · {siteConfig.contacts.whatsappNumber}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
