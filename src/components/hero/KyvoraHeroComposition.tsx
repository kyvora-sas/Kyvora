"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { KYVORA_K_SEGMENTS } from "@/components/brand/KyvoraLogo";
import { kyvoraKSegmentVariants, kyvoraSignalPathVariants } from "@/lib/motion";
import { useLanguage } from "@/context/LanguageContext";

export default function KyvoraHeroComposition() {
  const { t } = useLanguage();
  const prefersReduced = useReducedMotion();

  return (
    <div className="w-full">
      {/* Composición arquitectónica Desktop / Tablet amplia */}
      <div className="relative rounded-2xl border border-[#252D3A] bg-[#0D121D]/90 overflow-hidden shadow-2xl shadow-black/60">
        {/* Barra superior de coordenadas del sistema */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#252D3A] bg-[#080B12]/90 text-[11px] font-mono uppercase tracking-[0.16em] text-[#9AA5B8]">
          <span className="flex items-center gap-2 text-[#AFC4E8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]" />
            <span>KYVORA CORE · 45° AXIS</span>
          </span>
          <span>STUDIO / LAB</span>
        </div>

        {/* Lienzo central con isotipo modular K animado + Signal grid */}
        <div className="relative px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center bg-[linear-gradient(to_right,rgba(37,45,58,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,45,58,0.22)_1px,transparent_1px)] bg-[size:28px_28px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(22,119,255,0.16),transparent_68%)]"
          />

          <div className="relative z-10 w-full max-w-[240px] sm:max-w-[260px] py-2">
            {/* Líneas de señal geométricas detrás del isotipo K */}
            <motion.svg
              viewBox="0 0 320 260"
              fill="none"
              aria-hidden="true"
              className="w-full h-auto"
              initial={prefersReduced ? "visible" : "hidden"}
              animate="visible"
            >
              <defs>
                <linearGradient id="hero-k-top" x1="29" y1="11" x2="93" y2="171" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1677FF" />
                  <stop offset="100%" stopColor="#2B85FF" />
                </linearGradient>
                <linearGradient id="hero-k-main" x1="41" y1="241" x2="285" y2="17" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1661FB" />
                  <stop offset="55%" stopColor="#1677FF" />
                  <stop offset="100%" stopColor="#AFC4E8" />
                </linearGradient>
              </defs>

              {/* Eje vectorial guía a 45 grados */}
              <motion.path
                d="M 16 244 L 304 16"
                stroke="rgba(175,196,232,0.18)"
                strokeWidth="1"
                strokeDasharray="4 4"
                variants={prefersReduced ? undefined : kyvoraSignalPathVariants}
              />
              <motion.path
                d="M 176 132 L 298 244"
                stroke="rgba(43,133,255,0.24)"
                strokeWidth="1"
                variants={prefersReduced ? undefined : kyvoraSignalPathVariants}
              />

              {/* Isotipo oficial KYVORA K (3 segmentos construyéndose por eje 45°) */}
              <g transform="translate(29, 11)">
                {KYVORA_K_SEGMENTS.map((seg) =>
                  prefersReduced ? (
                    <path
                      key={seg.id}
                      d={seg.d}
                      fill={`url(#${seg.gradient === "top" ? "hero-k-top" : "hero-k-main"})`}
                    />
                  ) : (
                    <motion.path
                      key={seg.id}
                      d={seg.d}
                      fill={`url(#${seg.gradient === "top" ? "hero-k-top" : "hero-k-main"})`}
                      custom={seg.initialOffset}
                      variants={kyvoraKSegmentVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  )
                )}
              </g>
            </motion.svg>
          </div>

          <p className="relative z-10 mt-3 text-center text-[11px] font-mono uppercase tracking-[0.2em] text-[#AFC4E8]/90">
            {t.hero.primaryClaim}
          </p>
        </div>

        {/* Módulos inferiores Studio / Lab con jerarquía dual clara */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-[#252D3A] divide-y sm:divide-y-0 sm:divide-x divide-[#252D3A] bg-[#080B12]">
          <Link
            href="#servicios"
            className="group p-5 hover:bg-[#141B2B]/80 transition-colors flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#2B85FF] font-semibold">
                {t.hero.studioLabel}
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#9AA5B8] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#9AA5B8] group-hover:text-[#AFC4E8] transition-colors leading-relaxed">
              {t.hero.studioSummary}
            </p>
          </Link>

          <Link
            href="#laboratorio"
            className="group p-5 hover:bg-[#141B2B]/80 transition-colors flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#AFC4E8] font-semibold">
                {t.hero.labLabel}
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#9AA5B8] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#9AA5B8] group-hover:text-[#AFC4E8] transition-colors leading-relaxed">
              {t.hero.labSummary}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

