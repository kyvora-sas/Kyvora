"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { Language, Translations, translations } from "@/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const LANG_EVENT = "kyvora:lang-change";

function subscribeLanguage(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onChange = () => listener();
  window.addEventListener(LANG_EVENT, onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LANG_EVENT, onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getLanguageSnapshot(): Language {
  if (typeof window === "undefined") {
    return "es";
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang === "en" || urlLang === "es") {
      return urlLang;
    }

    const savedLang = localStorage.getItem("kyvora_lang");
    if (savedLang === "en" || savedLang === "es") {
      return savedLang;
    }

    if (navigator.language && navigator.language.toLowerCase().startsWith("en")) {
      return "en";
    }
  } catch {
    // Ignorar en entornos restringidos
  }
  return "es";
}

function getServerLanguageSnapshot(): Language {
  return "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const storedLanguage = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );

  // En rutas editoriales con URL por idioma (/recursos vs /recursos/en), la ruta determina el idioma efectivo
  const isRecursosEn = pathname === "/recursos/en" || pathname?.startsWith("/recursos/en/");
  const isRecursosEs =
    (pathname === "/recursos" || pathname?.startsWith("/recursos/")) && !isRecursosEn;

  const language: Language = isRecursosEn ? "en" : isRecursosEs ? "es" : storedLanguage;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem("kyvora_lang", lang);
      document.documentElement.lang = lang;

      if (!pathname?.startsWith("/recursos")) {
        const url = new URL(window.location.href);
        if (lang === "es") {
          url.searchParams.delete("lang");
        } else {
          url.searchParams.set("lang", lang);
        }
        window.history.replaceState({}, "", url.toString());
      }

      window.dispatchEvent(new Event(LANG_EVENT));
    } catch {
      // Ignorar en entornos restringidos
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
        {children}
      </LanguageContext.Provider>
    </MotionConfig>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
