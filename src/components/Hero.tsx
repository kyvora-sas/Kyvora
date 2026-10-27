"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Layers, Cpu, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 md:py-36 overflow-hidden">
      {/* Background Lighting & Grid Effects */}
      <div className="absolute inset-0 tech-grid-pattern opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-[var(--color-accent)]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 w-full flex flex-col items-start justify-center">
        {/* Top Technical Badge */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-foreground-muted mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium">Estudio de Software Independiente</span>
          <span className="text-white/20">|</span>
          <span className="text-[var(--color-accent-cyan)]">Colombia</span>
        </div>

        {/* Main Editorial Headline */}
        <div className="space-y-6 max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.95] text-white">
            Convertimos ideas complejas en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] via-blue-400 to-[var(--color-accent-cyan)]">
              software real
            </span>
            <span className="text-[var(--color-accent)]">.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-light text-foreground-muted max-w-3xl leading-relaxed text-balance">
            Desarrollamos soluciones web de alto impacto, aplicaciones interactivas, sistemas de datos a medida y automatizaciones con inteligencia artificial. Sin plantillas genéricas. Con ingeniería sólida y lista para producción.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <Link
            href="#contacto"
            className="px-8 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 flex items-center justify-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>Iniciar un Proyecto</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#laboratorio"
            className="px-8 py-4 bg-surface hover:bg-surface-elevated text-foreground border border-white/10 hover:border-white/20 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Layers className="w-4 h-4 text-[var(--color-accent-cyan)]" />
            <span>Explorar Laboratorio</span>
          </Link>
        </div>

        {/* Technical Architecture Quick Specs */}
        <div className="mt-16 pt-10 border-t border-white/10 w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
          <div className="space-y-1">
            <div className="text-foreground-muted/60 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[var(--color-accent-cyan)]" />
              <span>Stack Core</span>
            </div>
            <div className="text-white font-medium text-sm">Next.js · React 19 · TS</div>
          </div>

          <div className="space-y-1">
            <div className="text-foreground-muted/60 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>Sistemas</span>
            </div>
            <div className="text-white font-medium text-sm">PostgreSQL · APIs · IoT</div>
          </div>

          <div className="space-y-1">
            <div className="text-foreground-muted/60 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Infraestructura</span>
            </div>
            <div className="text-white font-medium text-sm">Vercel · Cloud · WebSockets</div>
          </div>

          <div className="space-y-1">
            <div className="text-foreground-muted/60 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cumplimiento</span>
            </div>
            <div className="text-white font-medium text-sm">Ley 1480 · Ley 1581 (Col)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
