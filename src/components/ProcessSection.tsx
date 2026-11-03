"use client";

import { Search, FileCode2, CheckSquare, Code2, ShieldAlert, LifeBuoy, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const stepIcons: Record<string, LucideIcon> = {
  "01": Search,
  "02": FileCode2,
  "03": CheckSquare,
  "04": Code2,
  "05": ShieldAlert,
  "06": LifeBuoy,
};

export default function ProcessSection() {
  const { t, language } = useLanguage();

  return (
    <section id="proceso" className="py-24 md:py-36 bg-background border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              <span>{t.process.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {t.process.title}
            </h2>
          </div>
          <p className="text-foreground-muted text-base max-w-md font-light">
            {t.process.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.process.steps.map((step) => {
            const Icon = stepIcons[step.num] || Search;
            return (
              <div
                key={step.num}
                className="p-6 md:p-8 rounded-2xl bg-surface/60 border border-white/10 hover:border-[var(--color-accent)]/40 transition-all duration-300 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-accent-cyan)] px-2.5 py-1 rounded bg-white/5 border border-white/5">
                    {t.process.phasePrefix} {step.num}
                  </span>
                  <Icon className="w-5 h-5 text-foreground-muted group-hover:text-[var(--color-accent-cyan)] transition-colors" />
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-foreground-muted font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Advisory Note */}
        <div className="mt-12 text-center text-xs text-foreground-muted/70 font-mono">
          * {language === "en"
            ? "Project timelines and specific technical terms are formalized individually in each proposal or service agreement."
            : "Los plazos de desarrollo y condiciones técnicas particulares se formalizan individualmente en cada propuesta o contrato de servicios."}
        </div>
      </div>
    </section>
  );
}
