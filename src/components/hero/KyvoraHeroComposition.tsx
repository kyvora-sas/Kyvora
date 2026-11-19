"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { KYVORA_K_SEGMENTS } from "@/components/brand/KyvoraLogo";
import { kyvoraKSegmentVariants, kyvoraSignalPathVariants } from "@/lib/motion";
import { useLanguage } from "@/context/LanguageContext";

function subscribeHover(callback: () => void) {
  if (typeof window === "undefined") return () => {};
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

export default function KyvoraHeroComposition() {
  const { t } = useLanguage();
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Detección idiomática en React 19 de soporte de puntero (hover) sin cascada de renders
  const canHover = useSyncExternalStore(subscribeHover, getHoverSnapshot, getServerSnapshot);

  // Parallax 2.5D interactivo contenido con resorte amortiguado
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4.5, -4.5]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5.5, 5.5]), springConfig);
  const specularX = useSpring(useTransform(rawX, [-0.5, 0.5], [20, 80]), springConfig);
  const specularY = useSpring(useTransform(rawY, [-0.5, 0.5], [20, 80]), springConfig);
  const specularBackground = useTransform(
    [specularX, specularY],
    ([x, y]) =>
      `radial-gradient(circle 320px at ${x}% ${y}%, rgba(92, 168, 255, 0.12), transparent 75%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny);
  };

  const handleMouseLeave = () => {
    if (!canHover || prefersReduced) return;
    rawX.set(0);
    rawY.set(0);
  };

  const activeParallaxStyle = canHover && !prefersReduced
    ? { rotateX, rotateY, transformStyle: "preserve-3d" as const }
    : undefined;

  return (
    <div className="w-full [perspective:1200px]">
      {/* Escultura dimensional flotante con respuesta táctil y respiración ambiental */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={activeParallaxStyle}
        className="relative rounded-2xl sm:rounded-3xl border border-[#252D3A]/85 bg-gradient-to-b from-[#0D121D]/90 via-[#0D121D]/80 to-[#080B12]/95 backdrop-blur-xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_45px_rgba(22,119,255,0.09)] transition-shadow duration-500 hover:shadow-[0_28px_70px_-10px_rgba(0,0,0,0.9),0_0_55px_rgba(43,133,255,0.18)]"
      >
        {/* Reflejo especular adaptativo (activo solo en pantallas con puntero real) */}
        {canHover && !prefersReduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-700"
            style={{ background: specularBackground }}
          />
        )}

        {/* HUD superior: Telemetría arquitectónica y estado activo */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#252D3A]/80 bg-[#080B12]/75 backdrop-blur-md text-[11px] font-mono uppercase tracking-[0.16em] text-[#9AA5B8]">
          <span className="flex items-center gap-2.5 text-[#AFC4E8]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1677FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B85FF]" />
            </span>
            <span className="font-medium text-white/95">KYVORA CORE · 45° AXIS</span>
          </span>

          <div className="flex items-center gap-3">
            <span className="hidden xs:inline-block px-2 py-0.5 rounded-full bg-[#1677FF]/10 text-[#5CA8FF] border border-[#1677FF]/25 text-[10px]">
              ONLINE
            </span>
            <span className="text-[#AFC4E8]/80 text-[10px] tracking-[0.18em]">STUDIO / LAB</span>
          </div>
        </div>

        {/* Escenario central: Isotipo modular K flotante + Retícula orbital cinemática */}
        <div className="relative px-6 py-8 sm:px-10 sm:py-12 flex flex-col items-center justify-center bg-[linear-gradient(to_right,rgba(37,45,58,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,45,58,0.2)_1px,transparent_1px)] bg-[size:28px_28px]">
          {/* Resplandor radial de respiración orgánica detrás de la escultura */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(22,119,255,0.22),rgba(43,133,255,0.06)_45%,transparent_72%)]"
          />

          {/* Anillos de apertura y coordenadas vectoriales de fondo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-[#1677FF]/15 animate-[spin_60s_linear_infinite]" />
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-dashed border-[#AFC4E8]/10 animate-[spin_90s_linear_infinite_reverse]" />
          </div>

          <div className="relative z-10 w-full max-w-[240px] sm:max-w-[270px] py-2 [transform:translateZ(30px)]">
            {/* SVG con trazado de coordenadas vectoriales e isotipo K oficial */}
            <motion.svg
              viewBox="0 0 320 260"
              fill="none"
              aria-hidden="true"
              className="w-full h-auto md:filter md:drop-shadow-[0_12px_28px_rgba(22,119,255,0.25)]"
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
                stroke="rgba(175,196,232,0.22)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                variants={prefersReduced ? undefined : kyvoraSignalPathVariants}
              />
              <motion.path
                d="M 176 132 L 298 244"
                stroke="rgba(43,133,255,0.28)"
                strokeWidth="1"
                variants={prefersReduced ? undefined : kyvoraSignalPathVariants}
              />

              {/* Nodos de telemetría orbitales con etiquetas técnicas */}
              <g className="text-[8px] font-mono fill-[#AFC4E8]/85 select-none">
                <circle cx="304" cy="16" r="3" fill="#2B85FF" />
                <circle cx="304" cy="16" r="6" stroke="rgba(43,133,255,0.4)" strokeWidth="0.8" />
                <circle cx="16" cy="244" r="2.5" fill="#1677FF" />
                <circle cx="176" cy="132" r="2.5" fill="#5CA8FF" />
              </g>

              {/* Isotipo oficial KYVORA K (3 segmentos modulares independientes con eje 45°) */}
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

          {/* Micro-telemetría inferior */}
          <div className="relative z-10 mt-4 flex items-center justify-center gap-3 [transform:translateZ(18px)]">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#2B85FF]/40" />
            <p className="text-center text-[11px] font-mono uppercase tracking-[0.22em] text-[#AFC4E8]/90">
              {t.hero.primaryClaim}
            </p>
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#2B85FF]/40" />
          </div>
        </div>

        {/* Módulos inferiores Studio / Lab con jerarquía dual y microinteracción táctil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-[#252D3A]/80 divide-y sm:divide-y-0 sm:divide-x divide-[#252D3A]/80 bg-[#080B12]/80 backdrop-blur-md">
          <Link
            href="#servicios"
            className="group relative p-5 sm:p-6 hover:bg-[#141B2B]/70 transition-all duration-300 flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#2B85FF] font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2B85FF] group-hover:scale-125 transition-transform" />
                {t.hero.studioLabel}
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#9AA5B8] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <p className="text-xs text-[#9AA5B8] group-hover:text-[#AFC4E8] transition-colors leading-relaxed">
              {t.hero.studioSummary}
            </p>
          </Link>

          <Link
            href="#laboratorio"
            className="group relative p-5 sm:p-6 hover:bg-[#141B2B]/70 transition-all duration-300 flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#AFC4E8] font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#AFC4E8] group-hover:scale-125 transition-transform" />
                {t.hero.labLabel}
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#9AA5B8] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <p className="text-xs text-[#9AA5B8] group-hover:text-[#AFC4E8] transition-colors leading-relaxed">
              {t.hero.labSummary}
            </p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
