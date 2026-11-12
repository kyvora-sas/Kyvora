"use client";

import { Compass, Layers, Code2, ShieldCheck, GitBranch, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import {
  KineticHeadline,
  MotionItem,
  MotionReveal,
  MotionStagger,
  SignalTrace,
} from "@/components/motion/MotionPrimitives";

const stepIcons: Record<string, LucideIcon> = {
  "01": Compass,
  "02": Layers,
  "03": Code2,
  "04": ShieldCheck,
  "05": GitBranch,
};

export default function ProcessSection() {
  const { t } = useLanguage();

  return (
    <section
      id="proceso"
      aria-labelledby="process-heading"
      className="py-20 md:py-28 bg-[#080B12] border-t border-[#252D3A] relative overflow-hidden"
    >
      <Container>
        {/* Encabezado */}
        <div className="mb-14 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#252D3A] pb-8">
          <MotionReveal className="space-y-3">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.18em] uppercase text-[#2B85FF]">
              <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
              <span>{t.process.badge}</span>
            </div>
            <KineticHeadline
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              <span id="process-heading">{t.process.title}</span>
            </KineticHeadline>
          </MotionReveal>

          <MotionReveal delay={0.08} className="lg:max-w-md">
            <p className="text-[#9AA5B8] text-sm sm:text-base font-light leading-relaxed">
              {t.process.subtitle}
            </p>
          </MotionReveal>
        </div>

        {/* Riel de señal progresiva (Desktop xl con 5 columnas alineadas) */}
        <div className="hidden xl:block mb-5 px-8">
          <SignalTrace
            viewBox="0 0 1000 24"
            d="M 10 12 L 990 12"
            strokeWidth={1.5}
            className="w-full h-6"
          />
        </div>

        {/* 5 Etapas progresivas: Exploración -> Diseño -> Desarrollo -> Validación -> Evolución */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 items-stretch">
          {t.process.steps.map((step) => {
            const Icon = stepIcons[step.num] || Compass;
            return (
              <MotionItem key={step.num} className="flex">
                <div className="w-full p-6 rounded-2xl bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 transition-colors flex flex-col justify-between space-y-5 group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#252D3A] text-[#2B85FF] group-hover:text-white group-hover:bg-[#1677FF] transition-colors">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#9AA5B8]">
                        {t.process.phasePrefix} {step.num}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9AA5B8] font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="h-[2px] w-8 bg-[#252D3A] group-hover:w-14 group-hover:bg-[#1677FF] transition-all duration-300" />
                </div>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </Container>
    </section>
  );
}
