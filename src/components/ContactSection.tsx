"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { MessageCircle, Mail, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { GithubIcon, InstagramIcon } from "@/components/SocialIcons";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import {
  getSelectedContactServiceServerSnapshot,
  getSelectedContactServiceSnapshot,
  setSelectedContactService,
  subscribeContactService,
  type ContactServiceOption,
} from "@/lib/service-selection";

export default function ContactSection() {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const selectedService = useSyncExternalStore(
    subscribeContactService,
    getSelectedContactServiceSnapshot,
    getSelectedContactServiceServerSnapshot
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      tipoProyecto: formData.get("tipoProyecto"),
      descripcion: formData.get("descripcion"),
      presupuesto: formData.get("presupuesto"),
      website_hp: formData.get("website_hp"), // Honeypot field
      aceptaPolitica: formData.get("aceptaPolitica") === "on",
    };

    if (!payload.aceptaPolitica) {
      setStatus("error");
      setErrorMessage(t.contact.form.errorRequiredTerms);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t.contact.form.errorGeneric);
      }

      setStatus("success");
      form.reset();
      setSelectedContactService("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.contact.form.errorGeneric;
      setStatus("error");
      setErrorMessage(msg);
    }
  };

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="py-20 md:py-28 bg-[#0D121D] border-t border-[#252D3A] relative"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct info & channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.18em] uppercase text-[#2B85FF]">
                <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
                <span>{t.contact.badge}</span>
              </div>
              <h2
                id="contact-heading"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]"
              >
                {t.contact.title}
              </h2>
              <p className="text-[#9AA5B8] text-base sm:text-lg font-light leading-relaxed">
                {t.contact.subtitle}
              </p>
            </div>

            {/* Direct Verified Channels */}
            <div className="space-y-3.5 pt-6 border-t border-[#252D3A]">
              <h3 className="text-xs font-mono uppercase tracking-[0.16em] text-[#AFC4E8]">
                {t.contact.channelsTitle}
              </h3>

              <div className="space-y-3 font-mono text-sm">
                <a
                  href={siteConfig.contacts.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#080B12] border border-[#252D3A] hover:border-[#1677FF]/60 transition-colors flex items-center gap-3 text-white group"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform" aria-hidden="true" />
                  <span>{siteConfig.contacts.whatsappNumber}</span>
                  <span className="ml-auto text-[10px] text-emerald-400 uppercase tracking-widest font-sans">
                    WhatsApp
                  </span>
                </a>

                <a
                  href={`mailto:${siteConfig.contacts.email}`}
                  className="p-3.5 rounded-xl bg-[#080B12] border border-[#252D3A] hover:border-[#1677FF]/60 transition-colors flex items-center gap-3 text-white group"
                >
                  <Mail className="w-5 h-5 text-[#2B85FF] group-hover:scale-105 transition-transform" aria-hidden="true" />
                  <span>{siteConfig.contacts.email}</span>
                  <span className="ml-auto text-[10px] text-[#5CA8FF] uppercase tracking-widest font-sans">
                    Email
                  </span>
                </a>

                <a
                  href={siteConfig.contacts.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#080B12] border border-[#252D3A] hover:border-[#2B85FF]/50 transition-colors flex items-center gap-3 text-[#AFC4E8] hover:text-white group"
                >
                  <GithubIcon className="w-5 h-5 group-hover:scale-105 transition-transform" />
                  <span>github.com/Kyvora-org</span>
                  <span className="ml-auto text-[10px] text-[#9AA5B8] uppercase tracking-widest font-sans">
                    GitHub
                  </span>
                </a>

                <a
                  href={siteConfig.contacts.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#080B12] border border-[#252D3A] hover:border-[#2B85FF]/50 transition-colors flex items-center gap-3 text-[#AFC4E8] hover:text-white group"
                >
                  <InstagramIcon className="w-5 h-5 text-[#AFC4E8] group-hover:scale-105 transition-transform" />
                  <span>@_kyvora_</span>
                  <span className="ml-auto text-[10px] text-[#9AA5B8] uppercase tracking-widest font-sans">
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Functional Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-[#141B2B]/85 border border-[#252D3A] shadow-2xl shadow-black/60">
              {status === "success" ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                      {t.contact.form.successTitle}
                    </h3>
                    <p className="text-foreground-muted text-sm max-w-md mx-auto leading-relaxed">
                      {t.contact.form.successDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
                  >
                    {t.contact.form.newMsgBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Honeypot field (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">
                      {language === "en" ? "Do not fill if human" : "No llenar este campo si eres humano"}
                    </label>
                    <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        {t.contact.form.nameLabel}
                      </label>
                      <input
                        required
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder={t.contact.form.namePlaceholder}
                        disabled={status === "loading"}
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        {t.contact.form.emailLabel}
                      </label>
                      <input
                        required
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.contact.form.emailPlaceholder}
                        disabled={status === "loading"}
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="tipoProyecto" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        {t.contact.form.serviceLabel}
                      </label>
                      <select
                        required
                        id="tipoProyecto"
                        name="tipoProyecto"
                        disabled={status === "loading"}
                        value={selectedService}
                        onChange={(e) => setSelectedContactService(e.target.value as ContactServiceOption)}
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors cursor-pointer"
                      >
                        <option value="" disabled>
                          {t.contact.form.serviceDefaultOption}
                        </option>
                        {t.contact.form.serviceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="presupuesto" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        {t.contact.form.budgetLabel}
                      </label>
                      <input
                        id="presupuesto"
                        name="presupuesto"
                        type="text"
                        placeholder={t.contact.form.budgetPlaceholder}
                        disabled={status === "loading"}
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="descripcion" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                      {t.contact.form.descLabel}
                    </label>
                    <textarea
                      required
                      id="descripcion"
                      name="descripcion"
                      rows={4}
                      placeholder={t.contact.form.descPlaceholder}
                      disabled={status === "loading"}
                      className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors resize-y min-h-[120px]"
                    ></textarea>
                  </div>

                  {/* Mandatory Colombian Data Protection Checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      required
                      type="checkbox"
                      id="aceptaPolitica"
                      name="aceptaPolitica"
                      disabled={status === "loading"}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-background text-[var(--color-accent)] focus:ring-[var(--color-accent-cyan)] cursor-pointer"
                    />
                    <label htmlFor="aceptaPolitica" className="text-xs text-foreground-muted leading-relaxed cursor-pointer font-light">
                      {t.contact.form.termsLabel}{" "}
                      <Link href="/legal/datos-personales" target="_blank" className="text-[var(--color-accent-cyan)] underline">
                        {t.contact.form.termsLinkText}
                      </Link>{" "}
                      (Ley 1581 de 2012).
                    </label>
                  </div>

                  {status === "error" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{status === "loading" ? t.contact.form.loadingBtn : t.contact.form.submitBtn}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
