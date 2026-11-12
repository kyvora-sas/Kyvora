"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { resolveAlternateRecursosPath } from "@/content/recursos/helpers";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const handleSelect = (targetLang: "es" | "en") => {
    setLanguage(targetLang);
    if (pathname?.startsWith("/recursos")) {
      const nextRoute = resolveAlternateRecursosPath(pathname, targetLang);
      if (nextRoute !== pathname) {
        router.push(nextRoute);
      }
    }
  };

  return (
    <div
      role="group"
      aria-label="Selector de idioma / Language selector"
      className={`inline-flex items-center gap-0.5 min-[360px]:gap-1 p-0.5 min-[360px]:p-1 rounded-xl bg-[#0D121D]/90 border border-[rgba(175,196,232,0.14)] backdrop-blur-md font-mono text-xs ${className}`}
    >
      <div className="hidden min-[360px]:flex pl-1.5 pr-0.5 text-[#8F9BB3] items-center">
        <Globe className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={() => handleSelect("es")}
        aria-pressed={language === "es"}
        aria-label="Cambiar a Español"
        className={`px-2 py-1.5 min-h-[34px] sm:min-h-0 rounded-lg font-bold transition-all cursor-pointer ${
          language === "es"
            ? "bg-[#1677FF]/20 text-white border border-[#1677FF]/55 shadow-sm"
            : "text-[#8F9BB3] hover:text-white border border-transparent"
        }`}
      >
        ES
      </button>

      <span className="text-[#252D3A] select-none text-[10px]">/</span>

      <button
        type="button"
        onClick={() => handleSelect("en")}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
        className={`px-2 py-1.5 min-h-[34px] sm:min-h-0 rounded-lg font-bold transition-all cursor-pointer ${
          language === "en"
            ? "bg-[#1677FF]/20 text-white border border-[#1677FF]/55 shadow-sm"
            : "text-[#8F9BB3] hover:text-white border border-transparent"
        }`}
      >
        EN
      </button>
    </div>
  );
}
