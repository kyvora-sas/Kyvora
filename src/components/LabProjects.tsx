"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FlaskConical, HeartHandshake } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { projectsConfig, ProjectItem } from "@/config/projects";
import { useLanguage } from "@/context/LanguageContext";
import { Container } from "@/components/ui";
import {
  KineticHeadline,
  MotionItem,
  MotionReveal,
  MotionStagger,
} from "@/components/motion/MotionPrimitives";
import { kyvoraProductFrameVariants } from "@/lib/motion";

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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${styles}`}
    >
      {status}
    </span>
  );
}

type LocalizedProjectItem = Omit<ProjectItem, "status"> & { status: string };

function ProjectCardContent({
  proj,
  repoLabel,
  internalLabel,
  purposeLabel,
}: {
  proj: LocalizedProjectItem;
  repoLabel: string;
  internalLabel: string;
  purposeLabel: string;
}) {
  return (
    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-4">
          <StatusBadge status={proj.status} variant={proj.statusVariant} />
          {proj.links?.repo ? (
            <a
              href={proj.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9AA5B8] hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs font-mono py-2 -my-2 px-1 -mx-1 min-h-[36px]"
              aria-label={`${repoLabel} ${proj.name}`}
            >
              <GithubIcon className="w-4 h-4" />
              <span>{repoLabel}</span>
            </a>
          ) : (
            <span className="text-[11px] font-mono text-[#9AA5B8]/70 uppercase">
              {internalLabel}
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl sm:text-[1.65rem] font-bold tracking-tight text-white flex items-center justify-between gap-2">
          <span>{proj.name}</span>
          {proj.links?.repo && (
            <ArrowUpRight
              className="w-5 h-5 text-[#9AA5B8] group-hover:text-[#2B85FF] transition-colors shrink-0"
              aria-hidden="true"
            />
          )}
        </h3>

        <p className="text-sm text-[#AFC4E8]/90 font-light leading-relaxed">
          {proj.tagline}
        </p>

        <div className="pt-1 text-xs text-[#9AA5B8] space-y-1">
          <strong className="text-white block font-mono uppercase tracking-wider text-[11px]">
            {purposeLabel}
          </strong>
          <p className="font-light leading-relaxed">{proj.purpose}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#252D3A] flex flex-wrap gap-1.5">
        {proj.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md bg-[#080B12] border border-[#252D3A] text-[11px] font-mono text-[#AFC4E8]/85"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LabProjects() {
  const { language, t } = useLanguage();
  const recursosHref = language === "en" ? "/recursos/en" : "/recursos";

  const getLocalizedProject = (proj: ProjectItem) => {
    const loc = t.lab.projects[proj.id];
    return {
      ...proj,
      tagline: loc?.tagline || proj.tagline,
      purpose: loc?.purpose || proj.purpose,
      status: loc?.status || proj.status,
    };
  };

  const pulsoRaw = projectsConfig.find((p) => p.id === "pulso")!;
  const quakeRaw = projectsConfig.find((p) => p.id === "quakenet")!;
  const pulso = getLocalizedProject(pulsoRaw);
  const quakeNet = getLocalizedProject(quakeRaw);
  const secondaryProjects = projectsConfig
    .filter((p) => p.id !== "pulso" && p.id !== "quakenet")
    .map(getLocalizedProject);

  return (
    <section
      id="laboratorio"
      aria-labelledby="lab-heading"
      className="py-20 md:py-28 bg-[#080B12] border-t border-[#252D3A] relative overflow-hidden"
    >
      {/* Textura experimental diferenciada respecto a KYVORA Studio */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_20%_10%,rgba(22,119,255,0.09),transparent)]"
      />

      <Container className="relative z-10">
        {/* Encabezado KYVORA LAB con línea de visión oficial */}
        <div className="mb-14 md:mb-18 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#252D3A] pb-8">
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

        {/* Fila 1: Pulso y QuakeNet como foco experimental */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <MotionReveal variants={kyvoraProductFrameVariants} className="lg:col-span-7 flex">
            <article className="w-full rounded-2xl bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 transition-colors overflow-hidden flex flex-col group">
              <div className="aspect-[16/10] bg-[#080B12] relative overflow-hidden border-b border-[#252D3A]">
                {pulso.image && (
                  <Image
                    src={pulso.image}
                    alt={pulso.imageAlt || pulso.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top opacity-92 group-hover:opacity-100 motion-safe:group-hover:scale-[1.02] transition-all duration-500"
                  />
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#080B12]/85 backdrop-blur-sm border border-[#252D3A] text-[10px] font-mono uppercase tracking-[0.14em] text-[#AFC4E8]">
                  01 · {t.lab.featuredLabel}
                </div>
              </div>
              <ProjectCardContent
                proj={pulso}
                repoLabel={t.lab.repoBtn}
                internalLabel={t.lab.internalPrototype}
                purposeLabel={t.lab.purposeLabel}
              />
            </article>
          </MotionReveal>

          <MotionReveal
            variants={kyvoraProductFrameVariants}
            delay={0.08}
            className="lg:col-span-5 flex"
          >
            <article className="w-full rounded-2xl bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 transition-colors overflow-hidden flex flex-col group">
              <div className="aspect-[4/3] bg-[#080B12] p-3 border-b border-[#252D3A] relative overflow-hidden">
                {quakeNet.image && (
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#080B12] border border-[#252D3A]">
                    <Image
                      src={quakeNet.image}
                      alt={quakeNet.imageAlt || quakeNet.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-contain opacity-95 group-hover:opacity-100 motion-safe:group-hover:scale-[1.02] transition-all duration-500"
                    />
                  </div>
                )}
              </div>
              <ProjectCardContent
                proj={quakeNet}
                repoLabel={t.lab.repoBtn}
                internalLabel={t.lab.internalPrototype}
                purposeLabel={t.lab.purposeLabel}
              />
            </article>
          </MotionReveal>
        </div>

        {/* Fila 2: Kyvora Studio, PulsAI y VoiceTranslate */}
        <MotionStagger className="mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {secondaryProjects.map((proj) => (
            <MotionItem key={proj.id} className="flex">
              <article className="w-full rounded-2xl bg-[#0D121D] border border-[#252D3A] hover:border-[#1677FF]/60 transition-colors overflow-hidden flex flex-col group">
                {proj.image && (
                  <div className="aspect-[16/10] bg-[#080B12] border-b border-[#252D3A] relative overflow-hidden">
                    <Image
                      src={proj.image}
                      alt={proj.imageAlt || proj.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top opacity-92 group-hover:opacity-100 motion-safe:group-hover:scale-[1.02] transition-all duration-500"
                    />
                  </div>
                )}
                <ProjectCardContent
                  proj={proj}
                  repoLabel={t.lab.repoBtn}
                  internalLabel={t.lab.internalPrototype}
                  purposeLabel={t.lab.purposeLabel}
                />
              </article>
            </MotionItem>
          ))}
        </MotionStagger>

        {/* Puente natural hacia Donate Us y Recursos */}
        <MotionReveal delay={0.12} className="mt-10">
          <div className="p-6 rounded-2xl bg-[#0D121D] border border-[#252D3A] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <HeartHandshake className="w-5 h-5 text-[#2B85FF] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
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
