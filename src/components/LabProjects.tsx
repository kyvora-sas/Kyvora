"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FlaskConical, Layers } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { projectsConfig, ProjectItem } from "@/config/projects";

function StatusBadge({ status, variant }: { status: string; variant: ProjectItem["statusVariant"] }) {
  const styles = {
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    info: "bg-blue-500/10 border-blue-500/30 text-[var(--color-accent-cyan)]",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  }[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${styles}`}>
      {status}
    </span>
  );
}

export default function LabProjects() {
  return (
    <section id="laboratorio" className="py-24 md:py-36 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] mb-3">
              <FlaskConical className="w-4 h-4 text-[var(--color-accent)]" />
              <span>I+D · Prototipos & Proyectos Verificados</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Laboratorio de Proyectos
            </h2>
          </div>
          <p className="text-foreground-muted text-base max-w-md font-light">
            Iniciativas de software concebidas y probadas internamente por KYVORA. Mostramos únicamente datos respaldados por código y desarrollo real.
          </p>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Project 1: Pulso (Large feature) */}
          {(() => {
            const pulso = projectsConfig.find((p) => p.id === "pulso")!;
            return (
              <div className="md:col-span-7 bg-surface rounded-2xl border border-white/10 hover:border-[var(--color-accent)]/50 transition-all duration-300 overflow-hidden group">
                <div className="aspect-[16/10] bg-[#050811] relative overflow-hidden">
                  {pulso.image && (
                    <Image
                      src={pulso.image}
                      alt={pulso.imageAlt || pulso.name}
                      fill
                      className="object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <StatusBadge status={pulso.status} variant={pulso.statusVariant} />
                    {pulso.links?.repo && (
                      <a
                        href={pulso.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                        aria-label={`Ver repositorio de ${pulso.name}`}
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>Repositorio</span>
                      </a>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold tracking-tight text-white flex items-center justify-between">
                    <span>{pulso.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-foreground-muted group-hover:text-[var(--color-accent-cyan)] transition-colors" />
                  </h3>

                  <p className="text-foreground-muted text-sm md:text-base font-light leading-relaxed">
                    {pulso.tagline}
                  </p>

                  <div className="pt-2 text-xs text-foreground-muted/80 space-y-1">
                    <strong className="text-white block font-mono uppercase tracking-wider text-[11px]">
                      Propósito técnico:
                    </strong>
                    <p className="font-light">{pulso.purpose}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {pulso.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-mono text-foreground-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Project 2: QuakeNet (Vertical feature) */}
          {(() => {
            const quakeNet = projectsConfig.find((p) => p.id === "quakenet")!;
            return (
              <div className="md:col-span-5 bg-surface rounded-2xl border border-white/10 hover:border-[var(--color-accent)]/50 transition-all duration-300 overflow-hidden group">
                <div className="aspect-[4/3] bg-[#050811] relative overflow-hidden">
                  {quakeNet.image && (
                    <Image
                      src={quakeNet.image}
                      alt={quakeNet.imageAlt || quakeNet.name}
                      fill
                      className="object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <StatusBadge status={quakeNet.status} variant={quakeNet.statusVariant} />
                    {quakeNet.links?.repo && (
                      <a
                        href={quakeNet.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                        aria-label={`Ver repositorio de ${quakeNet.name}`}
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>Repositorio</span>
                      </a>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold tracking-tight text-white flex items-center justify-between">
                    <span>{quakeNet.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-foreground-muted group-hover:text-[var(--color-accent-cyan)] transition-colors" />
                  </h3>

                  <p className="text-foreground-muted text-sm font-light leading-relaxed">
                    {quakeNet.tagline}
                  </p>

                  <div className="pt-2 text-xs text-foreground-muted/80 space-y-1">
                    <strong className="text-white block font-mono uppercase tracking-wider text-[11px]">
                      Propósito técnico:
                    </strong>
                    <p className="font-light">{quakeNet.purpose}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {quakeNet.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-mono text-foreground-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Secondary Projects Row: Kyvora Studio & PulsAI */}
        <div className="mt-8 md:mt-12 grid md:grid-cols-2 gap-8 items-stretch">
          {projectsConfig
            .filter((p) => p.id === "kyvora-studio" || p.id === "pulsai")
            .map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl bg-surface border border-white/10 hover:border-[var(--color-accent)]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full"
              >
                {proj.image && (
                  <div className="aspect-[16/10] bg-[#050811] relative overflow-hidden">
                    <Image
                      src={proj.image}
                      alt={proj.imageAlt || proj.name}
                      fill
                      className="object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <StatusBadge status={proj.status} variant={proj.statusVariant} />
                      {proj.links?.repo ? (
                        <a
                          href={proj.links.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground-muted hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                          aria-label={`Ver repositorio de ${proj.name}`}
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>Repositorio</span>
                        </a>
                      ) : (
                        <span className="text-xs font-mono text-foreground-muted/60 uppercase">
                          Prototipo Interno
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-between">
                      <span>{proj.name}</span>
                      {proj.links?.repo && (
                        <ArrowUpRight className="w-5 h-5 text-foreground-muted group-hover:text-[var(--color-accent-cyan)] transition-colors" />
                      )}
                    </h3>

                    <p className="text-sm text-foreground-muted font-light leading-relaxed">
                      {proj.tagline}
                    </p>

                    <div className="text-xs text-foreground-muted/80 space-y-1">
                      <strong className="text-white block font-mono uppercase tracking-wider text-[11px]">
                        Propósito técnico:
                      </strong>
                      <p className="font-light">{proj.purpose}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-mono text-foreground-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Lab Contribution Notice */}
        <div className="mt-12 p-6 rounded-xl bg-surface/40 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[var(--color-accent-cyan)] shrink-0" />
            <p className="text-xs md:text-sm text-foreground-muted font-light">
              ¿Quieres apoyar el desarrollo de sensores en QuakeNet o la infraestructura de Pulso?
            </p>
          </div>
          <Link
            href="#donate"
            className="px-4 py-2 bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 border border-[var(--color-accent)]/40 text-[var(--color-accent-cyan)] rounded-lg text-xs font-mono uppercase tracking-wider transition-colors shrink-0"
          >
            Aportar a un Proyecto en Donate Us
          </Link>
        </div>
      </div>
    </section>
  );
}
