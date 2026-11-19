"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import {
  FlaskConical,
  HeartHandshake,
  BookOpen,
  ArrowUpRight,
  Radio,
  Activity,
  Mic,
  Film,
  Terminal,
} from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { projectsConfig, ProjectItem } from "@/config/projects";
import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import { KineticHeadline, MotionReveal } from "@/components/motion/MotionPrimitives";

import dynamic from "next/dynamic";

// Consolas interactivas del Laboratorio de I+D (Carga diferida bajo demanda)
const ConsoleSkeleton = ({ name, code }: { name: string; code: string }) => (
  <div
    className="w-full min-h-[520px] rounded-2xl bg-[#080B12] border border-[#252D3A] flex flex-col items-center justify-center p-8 text-center font-mono text-xs"
    aria-busy="true"
  >
    <div className="w-8 h-8 rounded-full border-2 border-[#1677FF] border-t-transparent animate-spin mb-4" />
    <span className="text-white font-semibold tracking-wider">CARGANDO CONSOLA // {code}</span>
    <span className="text-[#9AA5B8] text-[11px] mt-1">{name}</span>
  </div>
);

const QuakeNetConsole = dynamic(() => import("./lab/QuakeNetConsole"), {
  ssr: false,
  loading: () => <ConsoleSkeleton code="LAB-01" name="QuakeNet // IoT Micro-sensores" />,
});

const PulsoConsole = dynamic(() => import("./lab/PulsoConsole"), {
  ssr: false,
  loading: () => <ConsoleSkeleton code="LAB-02" name="Pulso // Mensajería Realtime" />,
});

const VoiceTranslateConsole = dynamic(() => import("./lab/VoiceTranslateConsole"), {
  ssr: false,
  loading: () => <ConsoleSkeleton code="LAB-03" name="VoiceTranslate // Gemini Flash + Web Speech" />,
});

const KyvoraStudioConsole = dynamic(() => import("./lab/KyvoraStudioConsole"), {
  ssr: false,
  loading: () => <ConsoleSkeleton code="LAB-04" name="Kyvora Studio // NLE Tauri 2 + FFmpeg 7" />,
});

const PulsAiConsole = dynamic(() => import("./lab/PulsAiConsole"), {
  ssr: false,
  loading: () => <ConsoleSkeleton code="LAB-05" name="PulsAI // Ollama Local Gateway" />,
});

const LAB_ORDER: { id: string; code: string; icon: typeof Radio }[] = [
  { id: "quakenet", code: "LAB-01", icon: Radio },
  { id: "pulso", code: "LAB-02", icon: Activity },
  { id: "voicetranslate", code: "LAB-03", icon: Mic },
  { id: "kyvora-studio", code: "LAB-04", icon: Film },
  { id: "pulsai", code: "LAB-05", icon: Terminal },
];

function StatusBadge({
  status,
  variant,
}: {
  status: string;
  variant: ProjectItem["statusVariant"];
}) {
  const styles = {
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    info: "bg-[#1677FF]/15 border-[#2B85FF]/40 text-[#5CA8FF]",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-300",
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${styles}`}
    >
      {status}
    </span>
  );
}

export default function LabProjects() {
  const { language, t } = useLanguage();
  const recursosHref = language === "en" ? "/recursos/en" : "/recursos";
  const [activeProjectId, setActiveProjectId] = useState<string>("quakenet");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Localización de proyectos
  const getLocalizedProject = (proj: ProjectItem) => {
    const loc = t.lab.projects[proj.id];
    return {
      ...proj,
      tagline: loc?.tagline || proj.tagline,
      purpose: loc?.purpose || proj.purpose,
      status: loc?.status || proj.status,
    };
  };

  // Proyectos ordenados para el tablist
  const orderedProjects = LAB_ORDER.map((item) => {
    const raw = projectsConfig.find((p) => p.id === item.id)!;
    const localized = getLocalizedProject(raw);
    return {
      ...localized,
      code: item.code,
      icon: item.icon,
    };
  });

  const activeProject = orderedProjects.find((p) => p.id === activeProjectId) || orderedProjects[0];

  // Manejo de navegación por teclado WAI-ARIA
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % orderedProjects.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + orderedProjects.length) % orderedProjects.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = orderedProjects.length - 1;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      const nextProj = orderedProjects[nextIndex];
      setActiveProjectId(nextProj.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section
      id="laboratorio"
      aria-labelledby="lab-heading"
      className="py-20 md:py-28 bg-[#080B12] border-t border-[#252D3A] relative overflow-hidden"
    >
      {/* Textura experimental ambiental KYVORA */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_20%_10%,rgba(22,119,255,0.09),transparent)]"
      />

      <Container className="relative z-10">
        {/* Encabezado KYVORA LAB */}
        <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#252D3A] pb-8">
          <MotionReveal className="space-y-3">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.18em] uppercase text-[#5CA8FF]">
              <FlaskConical className="w-4 h-4 text-[#1677FF]" aria-hidden="true" />
              <span>{t.lab.badge}</span>
            </div>
            <KineticHeadline
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              <span id="lab-heading">{t.lab.title}</span>
            </KineticHeadline>
            <p className="text-sm font-mono text-[#AFC4E8] tracking-wide">
              &ldquo;{t.lab.visionClaim}&rdquo;
            </p>
          </MotionReveal>

          <MotionReveal delay={0.08} className="lg:max-w-md">
            <p className="text-[#9AA5B8] text-sm sm:text-base font-light leading-relaxed">
              {t.lab.subtitle}
            </p>
          </MotionReveal>
        </div>

        {/* Selector de Consolas de I+D (Tablist WAI-ARIA) */}
        <div className="mb-8">
          <div
            role="tablist"
            aria-label="Proyectos de KYVORA Lab"
            className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#252D3A]/60 scrollbar-thin"
          >
            {orderedProjects.map((proj, idx) => {
              const isSelected = proj.id === activeProjectId;
              const IconComponent = proj.icon;

              return (
                <button
                  key={proj.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  role="tab"
                  id={`tab-${proj.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${proj.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveProjectId(proj.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`px-4 py-3 rounded-xl border text-xs font-mono transition-all flex items-center gap-3 shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] ${isSelected
                    ? "bg-[#0D121D] border-[#1677FF] text-white shadow-lg shadow-[#1677FF]/10"
                    : "bg-[#080B12]/80 hover:bg-[#0D121D] border-[#252D3A] text-[#9AA5B8] hover:text-[#AFC4E8]"
                    }`}
                >
                  <span
                    className={`p-1.5 rounded-lg border ${isSelected
                      ? "bg-[#141B2B] text-[#5CA8FF] border-[#1677FF]/40"
                      : "bg-[#0D121D] text-[#9AA5B8] border-[#252D3A]"
                      }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#5CA8FF] font-semibold">{proj.code}</span>
                      <span className="text-white font-medium">{proj.name}</span>
                    </div>
                    <span className="text-[10px] text-[#9AA5B8] block truncate max-w-[130px]">
                      {proj.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenedor Estable del Panel Activo (CLS = 0.000) */}
        <div
          role="tabpanel"
          id={`panel-${activeProject.id}`}
          aria-labelledby={`tab-${activeProject.id}`}
          tabIndex={0}
          className="focus:outline-none min-h-[580px] sm:min-h-[640px] flex flex-col justify-between transition-opacity duration-200"
        >
          {/* Renderizado de la Consola correspondiente */}
          <div className="w-full">
            {activeProject.id === "quakenet" && <QuakeNetConsole />}
            {activeProject.id === "pulso" && <PulsoConsole />}
            {activeProject.id === "voicetranslate" && <VoiceTranslateConsole />}
            {activeProject.id === "kyvora-studio" && <KyvoraStudioConsole />}
            {activeProject.id === "pulsai" && <PulsAiConsole />}
          </div>

          {/* Ficha Técnica & Metadatos de la Iniciativa */}
          <div className="mt-6 p-6 rounded-2xl bg-[#0D121D] border border-[#252D3A] grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Columna 1: Propósito & Visión Técnica */}
            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={activeProject.status} variant={activeProject.statusVariant} />
                <span className="text-xs font-mono text-[#9AA5B8]">
                  {`${activeProject.code} // ${activeProject.name}`}
                </span>
              </div>
              <h3 className="text-lg font-display font-semibold text-white">
                {activeProject.tagline}
              </h3>
              <p className="text-xs sm:text-sm text-[#AFC4E8]/90 font-light leading-relaxed">
                {activeProject.purpose}
              </p>
            </div>

            {/* Columna 2: Stack Verificado */}
            <div className="md:col-span-3 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-white block">
                Stack Tecnológico
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-[#080B12] border border-[#252D3A] text-[11px] font-mono text-[#AFC4E8]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Columna 3: Código Fuente & Enlaces */}
            <div className="md:col-span-3 space-y-3 flex flex-col justify-between h-full">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white block mb-2">
                  Código & Comunidad
                </span>
                {activeProject.links?.repo ? (
                  <a
                    href={activeProject.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#080B12] hover:bg-[#141B2B] border border-[#252D3A] text-xs font-mono text-[#AFC4E8] hover:text-white transition-colors w-full"
                    aria-label={`${t.lab.repoBtn} ${activeProject.name}`}
                  >
                    <GithubIcon className="w-4 h-4 text-[#5CA8FF]" />
                    <span className="truncate">{t.lab.repoBtn}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-[#9AA5B8]" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-[#9AA5B8]">
                    {t.lab.internalPrototype}
                  </span>
                )}
              </div>

              {activeProject.donationTargetEligible && (
                <div className="pt-2 border-t border-[#252D3A]">
                  <Link
                    href="#donate"
                    className="text-[11px] font-mono text-[#5CA8FF] hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#2B85FF]" />
                    <span>Apoyar en Donate Us</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Puente natural hacia Donate Us y Recursos */}
        <MotionReveal delay={0.12} className="mt-10">
          <div className="p-6 rounded-2xl bg-[#0D121D] border border-[#252D3A] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <HeartHandshake
                className="w-5 h-5 text-[#2B85FF] shrink-0 mt-0.5 sm:mt-0"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm text-[#AFC4E8] font-light leading-relaxed">
                {t.lab.contributionText}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href={recursosHref}
                className="px-4 py-2.5 bg-[#080B12] hover:bg-[#141B2B] border border-[#252D3A] text-[#AFC4E8] hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
                <span>{t.lab.resourcesBtn}</span>
              </Link>
              <Link
                href="#donate"
                className="px-4 py-2.5 bg-[#1677FF]/15 hover:bg-[#1677FF]/25 border border-[#1677FF]/50 text-[#5CA8FF] hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-colors text-center"
              >
                {t.lab.contributionBtn}
              </Link>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
