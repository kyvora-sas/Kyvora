"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Translations, translations } from "@/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    try {
      // 1. Check URL query param ?lang=en / ?lang=es
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      if (urlLang === "en" || urlLang === "es") {
        setLanguageState(urlLang);
        document.documentElement.lang = urlLang;
        return;
      }

      // 2. Check localStorage
      const savedLang = localStorage.getItem("kyvora_lang") as Language | null;
      if (savedLang === "en" || savedLang === "es") {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
        return;
      }

      // 3. Fallback to browser preference if English
      if (navigator.language && navigator.language.toLowerCase().startsWith("en")) {
        setLanguageState("en");
        document.documentElement.lang = "en";
      } else {
        document.documentElement.lang = "es";
      }
    } catch {
      // Ignore in restricted environments
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("kyvora_lang", lang);
      document.documentElement.lang = lang;

      // Update URL query param cleanly without reloading
      const url = new URL(window.location.href);
      if (lang === "es") {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", lang);
      }
      window.history.replaceState({}, "", url.toString());
    } catch {
      // Ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

