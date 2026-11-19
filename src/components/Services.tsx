"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Database,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { triggerContactServiceSelection } from "@/lib/service-selection";
import { Container } from "@/components/ui";
import { KineticHeadline, MotionReveal } from "@/components/motion/MotionPrimitives";
import { KYVORA_DURATION, KYVORA_EASE } from "@/lib/motion";
import type { Translations } from "@/i18n/translations";

type ServiceItem = Translations["services"]["items"][number];

// Mapeo técnico editorial por célula (bilingüe ES / EN)
interface CellMetadata {
  sysCode: string;
  divisionLabel: { es: string; en: string };
  icon: LucideIcon;
  accentColor: string;
  gradientText: string;
  badgeLabel: { es: string; en: string };
  capabilities: { es: string[]; en: string[] };
  schematic: {
    nodeA: { es: string; en: string };
    nodeB: { es: string; en: string };
    nodeC: { es: string; en: string };
    metricLabel: string;
    metricValue: { es: string; en: string };
  };
}

const CELL_METADATA: Record<string, CellMetadata> = {
  "web-development": {
    sysCode: "SYS-01 :: ARCH-WEB",
    divisionLabel: { es: "STUDIO PLATFORMS", en: "STUDIO PLATFORMS" },
    icon: Globe,
    accentColor: "#1677FF",
    gradientText: "from-[#1677FF] to-[#5CA8FF]",
    badgeLabel: { es: "ALTO RENDIMIENTO", en: "HIGH PERFORMANCE" },
    capabilities: {
      es: ["Next.js 16", "React 19", "Tailwind CSS", "SEO Semántico", "Core Web Vitals 100"],
      en: ["Next.js 16", "React 19", "Tailwind CSS", "Semantic SEO", "Core Web Vitals 100"],
    },
    schematic: {
      nodeA: { es: "Edge CDN", en: "Edge CDN" },
      nodeB: { es: "SSR Next.js", en: "SSR Next.js" },
      nodeC: { es: "DOM React 19", en: "DOM React 19" },
      metricLabel: "Render Latency",
      metricValue: { es: "< 850 ms", en: "< 850 ms" },
    },
  },
  "app-development": {
    sysCode: "SYS-02 :: CLIENT-PWA",
    divisionLabel: { es: "MOBILE & CLIENTS", en: "MOBILE & CLIENTS" },
    icon: Smartphone,
    accentColor: "#2B85FF",
    gradientText: "from-[#2B85FF] to-[#AFC4E8]",
    badgeLabel: { es: "EXPERIENCIA TÁCTIL", en: "TOUCH EXPERIENCE" },
    capabilities: {
      es: ["PWA Híbrida", "Offline Cache", "WebSockets", "OAuth 2.0 / MFA", "React Native / Flutter"],
      en: ["Hybrid PWA", "Offline Cache", "WebSockets", "OAuth 2.0 / MFA", "React Native / Flutter"],
    },
    schematic: {
      nodeA: { es: "Dispositivo Táctil", en: "Touch Device" },
      nodeB: { es: "Cache Offline", en: "Offline Cache" },
      nodeC: { es: "API Gateway", en: "API Gateway" },
      metricLabel: "Sync State",
      metricValue: { es: "Realtime", en: "Realtime" },
    },
  },
  "custom-systems": {
    sysCode: "SYS-03 :: CORE-RELATIONAL",
    divisionLabel: { es: "INFRAESTRUCTURA CORE", en: "CORE INFRASTRUCTURE" },
    icon: Database,
    accentColor: "#5CA8FF",
    gradientText: "from-[#5CA8FF] to-[#2B85FF]",
    badgeLabel: { es: "CONCURRENCIA ATÓMICA", en: "ATOMIC CONCURRENCY" },
    capabilities: {
      es: ["PostgreSQL / Neon", "Transacciones ACID", "APIs RESTful", "RBAC Granular", "Logs de Auditoría"],
      en: ["PostgreSQL / Neon", "ACID Transactions", "RESTful APIs", "Granular RBAC", "Audit Logs"],
    },
    schematic: {
      nodeA: { es: "Transacción ACID", en: "ACID Transaction" },
      nodeB: { es: "PostgreSQL Core", en: "PostgreSQL Core" },
      nodeC: { es: "Bóveda Auditoría", en: "Audit Vault" },
      metricLabel: "Integrity Lock",
      metricValue: { es: "Strict TLS", en: "Strict TLS" },
    },
  },
  "automation-ai": {
    sysCode: "SYS-04 :: AGENT-LLM",
    divisionLabel: { es: "INTEGRACIÓN & AGENTES", en: "INTEGRATION & AGENTS" },
    icon: BrainCircuit,
    accentColor: "#1677FF",
    gradientText: "from-[#2B85FF] via-[#5CA8FF] to-[#AFC4E8]",
    badgeLabel: { es: "ORQUESTACIÓN LLM", en: "LLM ORCHESTRATION" },
    capabilities: {
      es: ["OpenAI / Anthropic APIs", "Contextual RAG", "Guardrails Deterministas", "Pipelines Webhook", "Zero Hallucination"],
      en: ["OpenAI / Anthropic APIs", "Contextual RAG", "Deterministic Guardrails", "Webhook Pipelines", "Zero Hallucination"],
    },
    schematic: {
      nodeA: { es: "Parser de Intención", en: "Intent Parser" },
      nodeB: { es: "Inferencia LLM", en: "LLM Inference" },
      nodeC: { es: "Filtro Determinista", en: "Deterministic Filter" },
      metricLabel: "Safety Guard",
      metricValue: { es: "100% Verificado", en: "100% Verified" },
    },
  },
};

// Detección idiomática de capacidad hover sin re-renders en cascada
function subscribeHover(callback: () => void) {
  if (typeof window === "undefined") return () => { };
  const mql = window.matchMedia("(hover: hover)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getHoverSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover)").matches;
}
function getServerSnapshot() {
  return false;
}

function ServiceDetailBody({
  service,
  t,
}: {
  service: ServiceItem;
  t: Translations;
}) {
  return (
    <div className="space-y-6 pt-5 border-t border-[#252D3A]">
      <div className="grid sm:grid-cols-2 gap-6 text-sm">
        <div className="space-y-2 p-4 rounded-xl bg-[#080B12]/80 border border-[#252D3A]">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2B85FF] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B85FF]" />
            <span>{t.services.whatWeBuildLabel}</span>
          </h4>
          <p className="text-[#AFC4E8]/90 leading-relaxed font-light text-xs sm:text-sm">
            {service.whatWeBuild}
          </p>
        </div>

        <div className="space-y-2 p-4 rounded-xl bg-[#080B12]/80 border border-[#252D3A]">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5CA8FF] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CA8FF]" />
            <span>{t.services.needSolvedLabel}</span>
          </h4>
          <p className="text-[#AFC4E8]/90 leading-relaxed font-light text-xs sm:text-sm">
            {service.needSolved}
          </p>
        </div>
      </div>

      {/* Entregables incluidos */}
      <div className="space-y-3 p-4 rounded-xl bg-[#080B12]/60 border border-[#252D3A]">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>{t.services.includedLabel}</span>
        </h4>
        <div className="grid sm:grid-cols-2 gap-2.5 text-xs text-white/90 font-light">
          {service.included.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Limitaciones y dependencias */}
      <div className="p-4 rounded-xl bg-[#080B12] border border-amber-500/25 space-y-2 text-xs">
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

      {/* Footer de cotización y acción directa */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#252D3A]/60">
        <p className="text-xs text-[#9AA5B8] leading-relaxed max-w-md">
          <strong className="text-white">{t.services.howToQuoteLabel} </strong>
          {service.howToQuote}
        </p>
        <Link
          href="#contacto"
          onClick={() => triggerContactServiceSelection(service.id)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1677FF] hover:bg-[#2B85FF] text-white text-xs font-mono uppercase tracking-wider transition-all duration-200 shrink-0 shadow-[0_0_20px_rgba(22,119,255,0.3)] hover:shadow-[0_0_28px_rgba(43,133,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
        >
          <span>{t.services.requestQuoteBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const prefersReduced = useReducedMotion();
  const canHover = useSyncExternalStore(subscribeHover, getHoverSnapshot, getServerSnapshot);

  // Filtro de categoría: "all" o id del servicio ("web-development", etc.)
  const [activeFilter, setActiveFilter] = useState<string>("all");
  // Expansión de ficha técnica por célula (permite abrir/cerrar detalles independientemente)
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({
    "web-development": true, // Primera abierta por defecto para valor inmediato
  });

  const toggleCellExpansion = (id: string) => {
    setExpandedCells((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filterOptions = [
    { id: "all", label: isEn ? "All" : "Todos", code: "SYS-ALL" },
    { id: "web-development", label: isEn ? "Web & Platforms" : "Web & Plataformas", code: "SYS-01" },
    { id: "app-development", label: isEn ? "Apps & Mobile" : "Apps & Móvil", code: "SYS-02" },
    { id: "custom-systems", label: isEn ? "Core Systems" : "Sistemas Core", code: "SYS-03" },
    { id: "automation-ai", label: isEn ? "Automation & AI" : "Automatización & IA", code: "SYS-04" },
  ];

  const displayedServices =
    activeFilter === "all"
      ? t.services.items
      : t.services.items.filter((item) => item.id === activeFilter);

  return (
    <section
      id="servicios"
      aria-labelledby="services-heading"
      className="py-20 md:py-28 bg-[#080B12] border-t border-[#252D3A]/80 relative overflow-hidden"
    >
      {/* Fondo ambiental sutil de silicio (acelerado por GPU) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(22,119,255,0.06),transparent_80%)]"
      />

      <Container className="relative z-10">
        {/* Header Studio Editorial */}
        <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#252D3A] pb-8">
          <MotionReveal className="space-y-3">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.2em] uppercase text-[#2B85FF]">
              <span className="w-2 h-2 rounded-full bg-[#1677FF] shadow-[0_0_8px_#1677FF] animate-pulse" />
              <span>{t.services.badge}</span>
            </div>
            <KineticHeadline
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.08]"
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

        {/* Píldoras de Filtrado Segmentado con Respuesta Táctil y Accesibilidad */}
        <div className="mb-10 flex flex-wrap items-center gap-2 sm:gap-2.5" role="tablist" aria-label={isEn ? "Service Cells Filter" : "Filtro de Células de Servicio"}>
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(opt.id)}
                className={`group relative px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] flex items-center gap-2 ${isActive
                  ? "bg-[#1677FF] text-white border border-[#2B85FF] shadow-[0_0_16px_rgba(22,119,255,0.35)]"
                  : "bg-[#0D121D] text-[#9AA5B8] hover:text-white border border-[#252D3A] hover:border-[#2B85FF]/50 hover:bg-[#141B2B]"
                  }`}
              >
                <span className={`text-[10px] ${isActive ? "text-[#AFC4E8]" : "text-[#5CA8FF] group-hover:text-[#AFC4E8]"}`}>
                  [{opt.code}]
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* COMPOSICIÓN ASIMÉTRICA: Células Tecnológicas Activas (Ritmo editorial 7:5 y 5:7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <AnimatePresence mode="popLayout">
            {displayedServices.map((service) => {
              const meta = CELL_METADATA[service.id] || CELL_METADATA["web-development"];
              const CellIcon = meta.icon;
              const isExpanded = Boolean(expandedCells[service.id]);

              // Asignación de span asimétrico:
              // Si se filtra una sola célula, ocupa las 12 columnas.
              // Si están todas ("all"): 01 ocupa 7 cols, 02 ocupa 5 cols, 03 ocupa 5 cols, 04 ocupa 7 cols.
              let colSpanClass = "lg:col-span-12";
              if (activeFilter === "all") {
                if (service.id === "web-development") colSpanClass = "lg:col-span-7";
                else if (service.id === "app-development") colSpanClass = "lg:col-span-5";
                else if (service.id === "custom-systems") colSpanClass = "lg:col-span-5";
                else if (service.id === "automation-ai") colSpanClass = "lg:col-span-7";
              }

              return (
                <motion.article
                  key={service.id}
                  layout="position"
                  initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: KYVORA_DURATION.base, ease: KYVORA_EASE.standard }}
                  className={`${colSpanClass} rounded-2xl bg-[#0D121D] border border-[#252D3A] p-6 sm:p-7 relative overflow-hidden transition-all duration-300 shadow-xl shadow-black/30 ${canHover ? "hover:border-[#2B85FF]/50 hover:shadow-[0_0_30px_rgba(22,119,255,0.12)] hover:-translate-y-0.5" : ""
                    }`}
                >
                  {/* Respiración lumínica sutil de la célula */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(22,119,255,0.08)_0%,transparent_70%)]"
                  />

                  {/* Barra de telemetría superior HUD */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252D3A] pb-4 mb-5 text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-[#AFC4E8]">
                      <span className="text-[#2B85FF] font-semibold">{meta.sysCode}</span>
                      <span className="text-[#252D3A]">|</span>
                      <span className="text-[#9AA5B8] uppercase">{meta.divisionLabel[language]}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                      <span className="text-[10px] uppercase tracking-widest text-[#5CA8FF] bg-[#141B2B] px-2 py-0.5 rounded border border-[#252D3A]">
                        {meta.badgeLabel[language]}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo principal de la célula */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] text-[#2B85FF] shrink-0 shadow-inner">
                        <CellIcon className="w-6 h-6" aria-hidden="true" />
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="text-xs font-mono text-[#5CA8FF] tracking-wider uppercase">
                          {service.num} · {t.services.divisionTag}
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-[#9AA5B8] text-sm leading-relaxed font-light">
                      {service.shortDesc}
                    </p>

                    {/* Esquema de Flujo Arquitectónico Vectorial Ligero (SVG 0 ms CPU) */}
                    <div className="my-4 p-3.5 rounded-xl bg-[#080B12]/80 border border-[#252D3A]/90 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-[#9AA5B8] mb-2.5">
                        <span className="text-[10px] uppercase tracking-wider text-[#AFC4E8]">
                          {isEn ? "Architecture Flow" : "Flujo de Arquitectura"}
                        </span>
                        <span className="text-[10px] text-[#5CA8FF]">
                          {meta.schematic.metricLabel}: <strong className="text-white">{meta.schematic.metricValue[language]}</strong>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#AFC4E8]">
                        <div className="px-2 py-1 rounded bg-[#141B2B] border border-[#252D3A] truncate">
                          {meta.schematic.nodeA[language]}
                        </div>
                        <span className="text-[#2B85FF] shrink-0">→</span>
                        <div className="px-2 py-1 rounded bg-[#141B2B] border border-[#252D3A] text-white font-medium truncate">
                          {meta.schematic.nodeB[language]}
                        </div>
                        <span className="text-[#2B85FF] shrink-0">→</span>
                        <div className="px-2 py-1 rounded bg-[#141B2B] border border-[#252D3A] text-[#5CA8FF] truncate">
                          {meta.schematic.nodeC[language]}
                        </div>
                      </div>
                    </div>

                    {/* Píldoras de Capacidades Integradas */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {meta.capabilities[language].map((cap) => (
                        <span
                          key={cap}
                          className="px-2.5 py-1 rounded-lg bg-[#080B12] border border-[#252D3A] text-[11px] font-mono text-[#AFC4E8]/85"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>

                    {/* Controles de Acción: Toggle de Ficha Técnica + Botón Cotizar */}
                    <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleCellExpansion(service.id)}
                        aria-expanded={isExpanded}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5CA8FF] hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
                      >
                        <span>
                          {isExpanded
                            ? isEn
                              ? "Hide specification"
                              : "Ocultar especificación"
                            : isEn
                              ? "Inspect technical spec"
                              : "Inspeccionar ficha técnica"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>

                      <Link
                        href="#contacto"
                        onClick={() => triggerContactServiceSelection(service.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#AFC4E8] hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
                      >
                        <span>{isEn ? `Quote ${service.num}` : `Cotizar ${service.num}`}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </Link>
                    </div>

                    {/* Ficha técnica expandible animada con transform y opacity */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          key={`detail-${service.id}`}
                          initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: KYVORA_DURATION.base, ease: KYVORA_EASE.standard }}
                          className="overflow-hidden"
                        >
                          <ServiceDetailBody service={service} t={t} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Matriz inferior de áreas complementarias */}
        <div className="mt-14 pt-8 border-t border-[#252D3A] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#9AA5B8] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2B85FF]" aria-hidden="true" />
            <span>
              {isEn
                ? "KYVORA cross-cutting engineering areas:"
                : "Áreas transversales de ingeniería KYVORA:"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {t.services.focusAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1 rounded-full bg-[#0D121D] border border-[#252D3A] text-xs font-mono text-[#AFC4E8]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
