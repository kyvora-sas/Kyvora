"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Selector de idioma / Language selector"
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-surface/80 border border-white/10 backdrop-blur-md font-mono text-xs ${className}`}
    >
      <div className="pl-1.5 pr-0.5 text-foreground-muted/60 flex items-center">
        <Globe className="w-3.5 h-3.5 text-[var(--color-accent-cyan)]" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={() => setLanguage("es")}
        aria-pressed={language === "es"}
        aria-label="Cambiar a Español"
        className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
          language === "es"
            ? "bg-[var(--color-accent)]/20 text-[var(--color-accent-cyan)] border border-[var(--color-accent)]/40 shadow-sm"
            : "text-foreground-muted hover:text-white border border-transparent"
        }`}
      >
        ES
      </button>

      <span className="text-white/20 select-none text-[10px]">/</span>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
        className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
          language === "en"
            ? "bg-[var(--color-accent)]/20 text-[var(--color-accent-cyan)] border border-[var(--color-accent)]/40 shadow-sm"
            : "text-foreground-muted hover:text-white border border-transparent"
        }`}
      >
        EN
      </button>
    </div>
  );
}

