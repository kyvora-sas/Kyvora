"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import logoImg from "@/img/logo.png";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-surface/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/50"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label="KYVORA - Inicio"
          >
            <Image
              src={logoImg}
              alt="KYVORA Logo"
              width={125}
              height={40}
              className="object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium" aria-label="Navegación principal">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground-muted hover:text-white transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="#contacto"
              className="px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Iniciar Proyecto</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground-muted hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 pt-24"
          role="dialog"
          aria-modal="true"
          aria-label="Menú móvil"
        >
          <div className="space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-foreground-muted border-b border-white/10 pb-3">
              Navegación
            </div>
            <nav className="flex flex-col space-y-4">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold tracking-tight text-white hover:text-[var(--color-accent-cyan)] transition-colors py-2 flex items-center justify-between border-b border-white/5"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-5 h-5 text-foreground-muted" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <Link
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-[var(--color-accent)] text-white text-center text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Iniciar Proyecto</span>
            </Link>
            <div className="text-center text-xs text-foreground-muted font-mono">
              Operando desde Colombia · {siteConfig.contacts.whatsappNumber}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
