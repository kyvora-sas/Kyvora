"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import {
  KineticHeadline,
  MotionItem,
  MotionReveal,
  MotionStagger,
} from "@/components/motion/MotionPrimitives";

export default function HumanSection() {
  const { language, t } = useLanguage();
  const recursosHref = language === "en" ? "/recursos/en" : "/recursos";

  return (
    <section
      id="enfoque"
      aria-labelledby="human-heading"
      className="relative bg-[#0D121D] py-20 md:py-28 border-t border-[#252D3A]/80"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-14">
          <MotionReveal className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#2B85FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2B85FF]" />
              {t.human.badge}
            </span>
            <KineticHeadline
              as="h2"
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.14]"
            >
              <span id="human-heading">{t.human.title}</span>
            </KineticHeadline>
          </MotionReveal>

          <MotionReveal delay={0.08} className="lg:col-span-7 lg:pt-8 space-y-6">
            <p className="text-base md:text-lg text-[#AFC4E8] leading-relaxed font-light max-w-2xl">
              {t.human.subtitle}
            </p>
            <p className="text-xs font-mono text-[#9AA5B8] border-l border-[#252D3A] pl-4 leading-relaxed">
              {t.human.closingNote}
            </p>
          </MotionReveal>
        </div>

        {/* 4 pilares sin caras ni métricas inventadas */}
        <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {t.human.pillars.map((pillar) => (
            <MotionItem key={pillar.num}>
              <div className="h-full rounded-2xl bg-[#080B12] border border-[#252D3A] hover:border-[#1677FF]/50 transition-colors p-6 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <span className="inline-block font-mono text-xs text-[#2B85FF] tracking-[0.14em]">
                    {pillar.num}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#9AA5B8] leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
                <div className="h-px w-10 bg-[#252D3A]" aria-hidden="true" />
              </div>
            </MotionItem>
          ))}
        </MotionStagger>

        {/* Puente natural hacia /recursos y contacto */}
        <MotionReveal delay={0.12}>
          <div className="rounded-2xl bg-[#141B2B]/70 border border-[#252D3A] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#2B85FF]">
                {t.lab.resourcesPrompt}
              </span>
              <p className="text-sm sm:text-base text-[#AFC4E8] font-light">
                {language === "en"
                  ? "Read honest technical guides before quoting software, websites, or AI workflows."
                  : "Consulta nuestras guías prácticas antes de cotizar un sitio web, sistema a medida o flujo con IA."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href={recursosHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#252D3A] bg-[#080B12] px-5 py-3 text-xs font-mono uppercase tracking-wider text-white hover:border-[#2B85FF] hover:text-[#AFC4E8] transition-colors"
              >
                <BookOpen className="h-4 w-4 text-[#2B85FF]" />
                <span>{t.human.resourcesCta}</span>
              </Link>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-5 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#2B85FF] transition-colors"
              >
                <span>{t.human.contactCta}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}

