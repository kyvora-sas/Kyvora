"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Layers, Cpu, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import { KineticHeadline, MotionReveal } from "@/components/motion/MotionPrimitives";
import KyvoraHeroComposition from "@/components/hero/KyvoraHeroComposition";

export default function Hero() {
  const { t } = useLanguage();

  const specs = [
    {
      icon: Terminal,
      title: t.hero.specs.stackTitle,
      value: t.hero.specs.stackValue,
    },
    {
      icon: Layers,
      title: t.hero.specs.systemsTitle,
      value: t.hero.specs.systemsValue,
    },
    {
      icon: Cpu,
      title: t.hero.specs.infraTitle,
      value: t.hero.specs.infraValue,
    },
    {
      icon: ShieldCheck,
      title: t.hero.specs.complianceTitle,
      value: t.hero.specs.complianceValue,
    },
  ];

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#080B12]">
      {/* Retícula tecnológica sutil y foco de luz controlado */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 w-[520px] h-[420px] bg-[#1677FF]/12 rounded-full blur-[120px]"
      />

      <Container className="relative z-10 space-y-14 lg:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna izquierda: Identidad, propuesta de valor y acciones */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow técnico + Claim oficial */}
            <MotionReveal immediate className="mb-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D] border border-[#252D3A] text-xs font-mono text-[#9AA5B8]">
                <span className="w-2 h-2 rounded-full bg-[#2B85FF]" />
                <span className="text-white font-medium">{t.hero.badgeStudio}</span>
                <span className="text-[#252D3A]">|</span>
                <span className="text-[#AFC4E8]">{t.hero.badgeCountry}</span>
              </div>
              <span className="text-xs font-mono tracking-[0.14em] uppercase text-[#AFC4E8]/90">
                {t.hero.primaryClaim}
              </span>
            </MotionReveal>

            {/* Titular editorial limpio (LCP inmediato y legible en mobile & desktop) */}
            <KineticHeadline
              as="h1"
              immediate
              className="font-display text-4xl sm:text-5xl md:text-6xl xl:text-[4.25rem] font-bold tracking-tight leading-[1.04] text-white"
            >
              {t.hero.titlePart1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B85FF] via-[#5CA8FF] to-[#AFC4E8]">
                {t.hero.titleGradient}
              </span>
              <span className="text-[#1677FF]">.</span>
            </KineticHeadline>

            <MotionReveal immediate delay={0.08} className="mt-6 max-w-2xl">
              <p className="text-base sm:text-lg md:text-xl font-light text-[#AFC4E8]/90 leading-relaxed text-balance">
                {t.hero.description}
              </p>
            </MotionReveal>

            {/* CTAs orientados a acción directa sin ruido */}
            <MotionReveal
              immediate
              delay={0.14}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
            >
              <Link
                href="#contacto"
                className="px-7 py-4 bg-[#1677FF] hover:bg-[#2B85FF] text-white font-semibold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#1677FF]/25 hover:shadow-[#1677FF]/40 flex items-center justify-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="#laboratorio"
                className="px-7 py-4 bg-[#0D121D] hover:bg-[#141B2B] text-white font-mono text-sm uppercase tracking-wider rounded-xl transition-colors border border-[#252D3A] hover:border-[#2B85FF]/60 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
              >
                {t.hero.ctaSecondary}
              </Link>
            </MotionReveal>
          </div>

          {/* Columna derecha: Composición modular KYVORA K + Studio/Lab */}
          <MotionReveal immediate delay={0.1} className="lg:col-span-5">
            <KyvoraHeroComposition />
          </MotionReveal>
        </div>

        {/* Matriz de arquitectura y capacidades base */}
        <MotionReveal immediate delay={0.18}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#252D3A] rounded-2xl overflow-hidden border border-[#252D3A]">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.title}
                  className="bg-[#0D121D] p-5 flex items-start gap-3.5 hover:bg-[#141B2B]/90 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#2B85FF] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <span className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#9AA5B8]">
                      {spec.title}
                    </span>
                    <p className="text-sm font-medium text-white">{spec.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
