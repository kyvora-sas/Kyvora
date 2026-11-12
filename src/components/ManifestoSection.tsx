"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import { BlueprintDivider, KineticHeadline, MotionReveal } from "@/components/motion/MotionPrimitives";

export default function ManifestoSection() {
  const { t } = useLanguage();

  return (
    <section
      id="manifiesto"
      aria-labelledby="manifesto-heading"
      className="relative bg-[#080B12] py-20 md:py-28 border-t border-b border-[#252D3A]/80 overflow-hidden"
    >
      {/* Trazo geométrico de fondo muy sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(22,119,255,0.08),transparent)]"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Columna izquierda: Índice editorial y claim secundario */}
          <MotionReveal className="lg:col-span-4 space-y-5">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.2em] text-[#AFC4E8]">
              <span className="h-2 w-2 rotate-45 bg-[#1677FF] shrink-0" />
              <span>{t.manifesto.badge}</span>
            </div>

            <div className="border-l-2 border-[#1677FF] pl-4 space-y-2">
              <p className="font-display text-lg md:text-xl font-semibold text-white tracking-tight">
                {t.manifesto.subClaim}
              </p>
              <p className="text-xs font-mono uppercase tracking-wider text-[#9AA5B8]">
                Studio · Lab · Colombia
              </p>
            </div>
          </MotionReveal>

          {/* Columna derecha: Declaración tipográfica protagonista */}
          <div className="lg:col-span-8 space-y-8">
            <KineticHeadline
              as="h2"
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.16] text-white"
            >
              <span id="manifesto-heading">&ldquo;{t.manifesto.statement}&rdquo;</span>
            </KineticHeadline>

            <MotionReveal delay={0.08}>
              <p className="text-base md:text-lg text-[#AFC4E8] leading-relaxed font-light max-w-2xl">
                {t.manifesto.supporting}
              </p>
            </MotionReveal>

            <BlueprintDivider />

            <MotionReveal delay={0.14}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
                {t.manifesto.pillars.map((pillar) => (
                  <div key={pillar.label} className="space-y-1.5">
                    <span className="block text-[11px] font-mono uppercase tracking-[0.16em] text-[#2B85FF]">
                      {pillar.label}
                    </span>
                    <p className="text-sm font-medium text-white/95">{pillar.value}</p>
                  </div>
                ))}
              </div>
            </MotionReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

