"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Compass,
  Layers,
  Code2,
  ShieldCheck,
  GitBranch,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import { KineticHeadline, MotionReveal } from "@/components/motion/MotionPrimitives";
import { ProcessStageVisualizer } from "@/components/process/ProcessVisualizers";

const STAGE_ICONS: Record<string, LucideIcon> = {
  "01": Compass,
  "02": Layers,
  "03": Code2,
  "04": ShieldCheck,
  "05": GitBranch,
};

export default function ProcessSection() {
  const { t } = useLanguage();
  const prefersReduced = useReducedMotion();

  // Etapa 01 seleccionada por defecto conforme al requerimiento
  const [activeNum, setActiveNum] = useState<string>("01");
  const [activeVectorIndex, setActiveVectorIndex] = useState<number | null>(0);
  const tabListRef = useRef<HTMLDivElement>(null);

  const steps = t.process.steps;
  const activeIndex = steps.findIndex((s) => s.num === activeNum);
  const activeStage = steps[activeIndex >= 0 ? activeIndex : 0];

  const handleSelectStage = useCallback((num: string) => {
    setActiveNum(num);
    setActiveVectorIndex(0); // Reinicia al primer vector de la etapa seleccionada
  }, []);

  const handlePrevStage = useCallback(() => {
    if (activeIndex > 0) {
      handleSelectStage(steps[activeIndex - 1].num);
    }
  }, [activeIndex, steps, handleSelectStage]);

  const handleNextStage = useCallback(() => {
    if (activeIndex < steps.length - 1) {
      handleSelectStage(steps[activeIndex + 1].num);
    }
  }, [activeIndex, steps, handleSelectStage]);

  // Manejo accesible de navegación por teclado en la lista de nodos
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let targetIndex = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        targetIndex = (activeIndex + 1) % steps.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        targetIndex = (activeIndex - 1 + steps.length) % steps.length;
      } else if (e.key === "Home") {
        targetIndex = 0;
      } else if (e.key === "End") {
        targetIndex = steps.length - 1;
      }

      if (targetIndex >= 0) {
        e.preventDefault();
        handleSelectStage(steps[targetIndex].num);
        const tabs = tabListRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
        tabs?.[targetIndex]?.focus();
      }
    },
    [activeIndex, steps, handleSelectStage]
  );

  return (
    <section
      id="proceso"
      aria-labelledby="process-heading"
      className="py-20 md:py-28 bg-[#080B12] border-t border-[#252D3A] relative overflow-hidden"
    >
      {/* Resplandor ambiental orgánico */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#1677FF]/5 blur-[120px] rounded-full"
      />

      <Container className="relative z-10">
        {/* Encabezado Editorial */}
        <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#252D3A] pb-8">
          <MotionReveal className="space-y-3">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.18em] uppercase text-[#2B85FF]">
              <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />
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
            <p className="text-[#AFC4E8] text-sm sm:text-base font-light leading-relaxed">
              {t.process.subtitle}
            </p>
          </MotionReveal>
        </div>

        {/* =========================================================================
            RIEL DEL FLUJO DE LA INTENCIÓN (Ribbon de 5 Nodos Interactivos)
           ========================================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA5B8] mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2B85FF]" />
              {t.process.interactiveHint}
            </span>
            <span className="hidden sm:inline text-[#5CA8FF]">
              {t.process.stageLabel} {activeStage.num} / 05
            </span>
          </div>

          {/* Riel adaptable: Scroll horizontal en móvil, rejilla integrada en desktop */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label={t.process.badge}
            onKeyDown={handleKeyDown}
            className="flex sm:grid sm:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0 scroll-smooth snap-x snap-mandatory"
          >
            {steps.map((step, idx) => {
              const Icon = STAGE_ICONS[step.num] || Compass;
              const isSelected = step.num === activeNum;
              const isPast = idx < activeIndex;

              return (
                <button
                  key={step.num}
                  id={`process-tab-${step.num}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls="process-stage-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelectStage(step.num)}
                  className={`flex-shrink-0 min-w-[200px] sm:min-w-0 min-h-[52px] snap-start p-3 sm:p-3.5 rounded-xl text-left transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] flex items-center justify-between gap-3 group ${
                    isSelected
                      ? "bg-[#141B2B] border-[#1677FF] shadow-lg shadow-[#1677FF]/10 text-white"
                      : isPast
                      ? "bg-[#0D121D] border-[#252D3A] text-[#AFC4E8] hover:border-[#1677FF]/40 hover:text-white"
                      : "bg-[#0D121D]/60 border-[#252D3A]/70 text-[#9AA5B8] hover:border-[#252D3A] hover:text-[#AFC4E8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg border transition-colors flex-shrink-0 ${
                        isSelected
                          ? "bg-[#1677FF] border-[#5CA8FF] text-white"
                          : isPast
                          ? "bg-[#080B12] border-[#252D3A] text-[#2B85FF]"
                          : "bg-[#080B12] border-[#252D3A] text-[#9AA5B8] group-hover:text-[#AFC4E8]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] font-mono tracking-wider text-[#9AA5B8] uppercase">
                        {t.process.phasePrefix} {step.num}
                      </div>
                      <div className="text-xs font-semibold truncate tracking-tight text-white">
                        {step.title}
                      </div>
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                      isSelected
                        ? "bg-[#1677FF] ring-4 ring-[#1677FF]/20"
                        : isPast
                        ? "bg-[#2B85FF]/60"
                        : "bg-[#252D3A]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            PANEL PRINCIPAL: LA CONSOLA DEL FLUJO (Composición Editorial Asimétrica)
           ========================================================================= */}
        <div
          id="process-stage-panel"
          role="tabpanel"
          aria-labelledby={`process-tab-${activeStage.num}`}
          className="rounded-2xl bg-[#0D121D] border border-[#252D3A] shadow-2xl relative overflow-hidden"
        >
          {/* Barra superior técnica de la consola */}
          <div className="px-6 py-3.5 border-b border-[#252D3A] bg-[#080B12]/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#5CA8FF]">
              <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />
              <span>{activeStage.code}</span>
              <span className="text-[#252D3A]">|</span>
              <span className="text-[#AFC4E8] font-sans text-[11px] font-medium uppercase tracking-wider">
                {activeStage.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#9AA5B8]">
                {t.process.stageLabel} {activeStage.num} / 05
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1677FF]/15 text-[#5CA8FF] border border-[#1677FF]/30 text-[10px] font-semibold">
                ACTIVA
              </span>
            </div>
          </div>

          {/* Rejilla Asimétrica: 7 columnas de contenido editorial + 5 columnas de visualizador */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-10">
            {/* Columna Izquierda: Información de la etapa, vectores y entregables */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.num}
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {/* Encabezado de la etapa activa */}
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                      {activeStage.title}
                    </h3>
                    <p className="text-sm sm:text-base font-mono text-[#5CA8FF] italic">
                      «{activeStage.tagline}»
                    </p>
                    <p className="text-[#AFC4E8] text-sm sm:text-base font-light leading-relaxed pt-1">
                      {activeStage.desc}
                    </p>
                  </div>

                  {/* Ejes de transformación interactivos (4 elementos) */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-mono uppercase tracking-[0.16em] text-[#9AA5B8] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B85FF]" />
                      <span>{t.process.vectorsHeading}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeStage.elements.map((elem, eIdx) => {
                        const isVectorSelected = activeVectorIndex === eIdx;
                        return (
                          <button
                            key={elem.name}
                            type="button"
                            aria-pressed={isVectorSelected}
                            onClick={() => setActiveVectorIndex(eIdx)}
                            className={`p-3 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] ${
                              isVectorSelected
                                ? "bg-[#141B2B] border-[#2B85FF] text-white shadow-md shadow-[#2B85FF]/10"
                                : "bg-[#080B12]/70 border-[#252D3A] text-[#AFC4E8] hover:border-[#1677FF]/40 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-semibold mb-1">
                              <span className="text-white font-mono">{elem.name}</span>
                              <span
                                className={`text-[10px] font-mono ${
                                  isVectorSelected ? "text-[#5CA8FF]" : "text-[#9AA5B8]"
                                }`}
                              >
                                [0{eIdx + 1}]
                              </span>
                            </div>
                            <p className="text-xs text-[#9AA5B8] font-light leading-snug">
                              {elem.detail}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Entregables y Puntos de Control */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-mono uppercase tracking-[0.16em] text-[#9AA5B8] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{t.process.deliverablesHeading}</span>
                    </div>

                    <ul className="space-y-2">
                      {activeStage.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#AFC4E8] font-light"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#2B85FF] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Botones de navegación secuencial y nota de ingeniería */}
              <div className="pt-6 border-t border-[#252D3A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStage}
                    disabled={activeIndex === 0}
                    aria-label={t.process.prevStage}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] bg-[#080B12] border-[#252D3A] text-[#AFC4E8] hover:text-white hover:border-[#1677FF]/50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.process.prevStage}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStage}
                    disabled={activeIndex === steps.length - 1}
                    aria-label={t.process.nextStage}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] bg-[#1677FF] border-[#5CA8FF] text-white hover:bg-[#2B85FF]"
                  >
                    <span>{t.process.nextStage}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#9AA5B8] flex items-center gap-2">
                  <span>NAV SECUENCIAL:</span>
                  <span className="text-[#5CA8FF] font-semibold">
                    {activeStage.num} / 05
                  </span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: El Visualizador Esquemático de la etapa activa */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="h-full min-h-[380px] sm:min-h-[420px] rounded-xl bg-[#080B12] border border-[#252D3A] p-5 sm:p-6 flex flex-col justify-between shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStage.num}
                    initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full h-full flex flex-col justify-between"
                  >
                    <ProcessStageVisualizer stageNum={activeStage.num} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Nota de Honestidad Técnica y Transparencia */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#9AA5B8] font-mono leading-relaxed max-w-3xl mx-auto">
            {t.process.disclaimer}
          </p>
        </div>
      </Container>
    </section>
  );
}
