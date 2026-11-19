"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Layers, Cpu, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import { KineticHeadline, MotionReveal } from "@/components/motion/MotionPrimitives";
import KyvoraHeroComposition from "@/components/hero/KyvoraHeroComposition";
import OrganicHeroCanvas from "@/components/hero/OrganicHeroCanvas";

export default function Hero() {
  const { t } = useLanguage();

  const specs = [
    {
      icon: Terminal,
      title: t.hero.specs.stackTitle,
      value: t.hero.specs.stackValue,
      status: "CORE",
    },
    {
      icon: Layers,
      title: t.hero.specs.systemsTitle,
      value: t.hero.specs.systemsValue,
      status: "SYNC",
    },
    {
      icon: Cpu,
      title: t.hero.specs.infraTitle,
      value: t.hero.specs.infraValue,
      status: "EDGE",
    },
    {
      icon: ShieldCheck,
      title: t.hero.specs.complianceTitle,
      value: t.hero.specs.complianceValue,
      status: "AUDIT",
    },
  ];

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#080B12]">
      {/* 1. Núcleo Orgánico: Canvas 2D nativo ("Tecnología que respira") */}
      <OrganicHeroCanvas className="z-0" />

      {/* 2. Retícula arquitectónica y foco atmosférico sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-35 z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 w-[620px] h-[480px] bg-[radial-gradient(circle,rgba(22,119,255,0.14)_0%,transparent_70%)] blur-[90px] z-0"
      />

      <Container className="relative z-10 space-y-14 lg:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna izquierda: Identidad editorial, propuesta de valor y acciones */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow técnico con pulso orgánico viviente + Claim oficial */}
            <MotionReveal immediate className="mb-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D]/90 backdrop-blur-md border border-[#252D3A] text-xs font-mono text-[#9AA5B8] shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B85FF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B85FF]" />
                </span>
                <span className="text-white font-medium">{t.hero.badgeStudio}</span>
                <span className="text-[#252D3A]">|</span>
                <span className="text-[#AFC4E8]">{t.hero.badgeCountry}</span>
              </div>
              <span className="text-xs font-mono tracking-[0.14em] uppercase text-[#AFC4E8]/90">
                {t.hero.primaryClaim}
              </span>
            </MotionReveal>

            {/* Titular editorial cinemático (LCP inmediato, accesible y renderizado en SSR) */}
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

            {/* Párrafo descriptivo: renderizado semántico SSR directo (LCP inmediato, sin retraso de hidratación) */}
            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl font-light text-[#AFC4E8]/90 leading-relaxed text-balance">
              {t.hero.description}
            </p>

            {/* CTAs cinemáticos con respuesta táctil y resplandor controlado */}
            <MotionReveal
              immediate
              delay={0.14}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
            >
              <Link
                href="#contacto"
                className="relative px-7 py-4 bg-[#1677FF] hover:bg-[#2B85FF] text-white font-semibold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_24px_rgba(22,119,255,0.3)] hover:shadow-[0_0_36px_rgba(43,133,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#laboratorio"
                className="px-7 py-4 bg-[#0D121D]/80 hover:bg-[#141B2B] text-white font-mono text-sm uppercase tracking-wider rounded-xl transition-all duration-300 border border-[#252D3A] hover:border-[#5CA8FF]/60 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
              >
                {t.hero.ctaSecondary}
              </Link>
            </MotionReveal>
          </div>

          {/* Columna derecha: Escultura cinética KYVORA K dimensional + Studio/Lab */}
          <MotionReveal immediate delay={0.1} className="lg:col-span-5">
            <KyvoraHeroComposition />
          </MotionReveal>
        </div>

        {/* Matriz HUD de arquitectura y capacidades base */}
        <MotionReveal immediate delay={0.18}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#252D3A]/85 rounded-2xl overflow-hidden border border-[#252D3A]/90 backdrop-blur-md shadow-2xl shadow-black/40">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.title}
                  className="group relative bg-[#0D121D]/85 p-5 flex items-start gap-3.5 hover:bg-[#141B2B]/95 transition-all duration-300"
                >
                  <div className="relative p-2 rounded-lg bg-[#141B2B] border border-[#252D3A] text-[#2B85FF] group-hover:text-[#5CA8FF] group-hover:border-[#2B85FF]/40 transition-colors">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#9AA5B8]">
                        {spec.title}
                      </span>
                      <span className="text-[9px] font-mono text-[#5CA8FF]/80 tracking-wider">
                        {spec.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">{spec.value}</p>
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
