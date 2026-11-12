"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Server,
  Bot,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { triggerContactServiceSelection } from "@/lib/service-selection";
import { Container } from "@/components/ui";
import { KineticHeadline, MotionReveal } from "@/components/motion/MotionPrimitives";
import { KYVORA_DURATION, KYVORA_EASE } from "@/lib/motion";
import type { Translations } from "@/i18n/translations";

const serviceIcons: Record<string, LucideIcon> = {
  "web-development": Globe,
  "app-development": Smartphone,
  "custom-systems": Server,
  "automation-ai": Bot,
};

type ServiceItem = Translations["services"]["items"][number];

function ServiceDetailBody({
  service,
  t,
}: {
  service: ServiceItem;
  t: Translations;
}) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6 text-sm">
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2B85FF]">
            {t.services.whatWeBuildLabel}
          </h4>
          <p className="text-[#AFC4E8]/90 leading-relaxed font-light">
            {service.whatWeBuild}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2B85FF]">
            {t.services.needSolvedLabel}
          </h4>
          <p className="text-[#AFC4E8]/90 leading-relaxed font-light">
            {service.needSolved}
          </p>
        </div>
      </div>

      {/* Entregables incluidos */}
      <div className="space-y-3 pt-4 border-t border-[#252D3A]">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-400">
          {t.services.includedLabel}
        </h4>
        <div className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-white/90 font-light">
          {service.included.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Limitaciones y dependencias */}
      <div className="p-4 rounded-xl bg-[#080B12] border border-amber-500/25 space-y-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px] uppercase tracking-wider font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.services.limitationsLabel}</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[#9AA5B8] font-light">
          {service.limitationsAndDependencies.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      </div>

      {/* Footer de cotización y preselección directa en Contacto */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#252D3A]">
        <p className="text-xs text-[#9AA5B8] leading-relaxed">
          <strong className="text-white">{t.services.howToQuoteLabel} </strong>
          {service.howToQuote}
        </p>
        <Link
          href="#contacto"
          onClick={() => triggerContactServiceSelection(service.id)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#2B85FF] text-white text-xs font-mono uppercase tracking-wider transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
        >
          <span>{t.services.requestQuoteBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const prefersReduced = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string>("web-development");
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>("web-development");

  const activeService =
    t.services.items.find((item) => item.id === selectedId) || t.services.items[0];
  const ActiveIcon = serviceIcons[activeService.id] || Globe;

  return (
    <section
      id="servicios"
      aria-labelledby="services-heading"
      className="py-20 md:py-28 bg-[#0D121D] border-t border-[#252D3A]/80 relative"
    >
      <Container>
        {/* Header Studio */}
        <div className="mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#252D3A] pb-8">
          <MotionReveal className="space-y-3">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.18em] uppercase text-[#2B85FF]">
              <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
              <span>{t.services.badge}</span>
            </div>
            <KineticHeadline
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              <span id="services-heading">{t.services.title}</span>
            </KineticHeadline>
          </MotionReveal>

          <MotionReveal delay={0.08} className="lg:max-w-md">
            <p className="text-[#9AA5B8] text-sm sm:text-base font-light leading-relaxed">
              {t.services.subtitle}
            </p>
          </MotionReveal>
        </div>

        {/* Matriz de áreas clave de KYVORA STUDIO */}
        <MotionReveal delay={0.1} className="mb-10 flex flex-wrap gap-2">
          {t.services.focusAreas.map((area) => (
            <span
              key={area}
              className="px-3 py-1.5 rounded-full bg-[#080B12] border border-[#252D3A] text-xs font-mono text-[#AFC4E8]"
            >
              {area}
            </span>
          ))}
        </MotionReveal>

        {/* COMPOSICIÓN DESKTOP (lg+): Selector izquierdo + Inspector detallado derecho */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
          <div
            role="tablist"
            aria-label={t.services.title}
            className="lg:col-span-5 space-y-3"
          >
            {t.services.items.map((service) => {
              const Icon = serviceIcons[service.id] || Globe;
              const isSelected = service.id === activeService.id;

              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(service.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] ${
                    isSelected
                      ? "bg-[#141B2B] border-[#1677FF]/70 shadow-xl shadow-black/40"
                      : "bg-[#080B12] border-[#252D3A] hover:border-[#2B85FF]/40 hover:bg-[#141B2B]/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                        isSelected
                          ? "bg-[#1677FF] border-[#2B85FF] text-white"
                          : "bg-[#0D121D] border-[#252D3A] text-[#2B85FF]"
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[#9AA5B8]">
                        <span className={isSelected ? "text-[#5CA8FF]" : ""}>{service.num}</span>
                        <span>·</span>
                        <span>{t.services.divisionTag}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-white tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#9AA5B8] font-light leading-relaxed">
                        {service.shortDesc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                role="tabpanel"
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: KYVORA_DURATION.base, ease: KYVORA_EASE.standard }}
                className="rounded-2xl bg-[#141B2B]/90 border border-[#252D3A] p-8 space-y-6 shadow-2xl shadow-black/40"
              >
                <div className="flex items-center justify-between gap-4 border-b border-[#252D3A] pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#252D3A] text-[#2B85FF]">
                      <ActiveIcon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#5CA8FF]">
                        {activeService.num} · KYVORA STUDIO
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <ServiceDetailBody service={activeService} t={t} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* COMPOSICIÓN MOBILE (< lg): Acordeón vertical autónomo */}
        <div className="lg:hidden space-y-4">
          {t.services.items.map((service) => {
            const Icon = serviceIcons[service.id] || Globe;
            const isExpanded = mobileExpandedId === service.id;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  isExpanded
                    ? "bg-[#141B2B]/90 border-[#1677FF]/60"
                    : "bg-[#080B12] border-[#252D3A]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setMobileExpandedId(isExpanded ? null : service.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-5 flex items-start justify-between text-left gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-xs font-mono text-[#2B85FF] pt-1 shrink-0">
                      {service.num}
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#2B85FF] shrink-0" aria-hidden="true" />
                        <h3 className="font-display text-lg font-bold tracking-tight text-white">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-[#9AA5B8] text-xs leading-relaxed font-light">
                        {service.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 p-1.5 rounded-lg bg-[#0D121D] border border-[#252D3A] text-[#AFC4E8]">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-[#2B85FF]" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-6 pt-3 border-t border-[#252D3A]">
                    <ServiceDetailBody service={service} t={t} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
