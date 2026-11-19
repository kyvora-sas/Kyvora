"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Cpu, RefreshCw, Terminal, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface VisualizerProps {
  stageNum: string;
}

export function DiscoveryVisualizer() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="w-full h-full flex flex-col justify-between"
      aria-label={
        isEn
          ? "Schematic visualizer: Discovery radar and intent mapping"
          : "Visualizador esquemático: Radar de descubrimiento y mapeo de intención"
      }
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA5B8] border-b border-[#252D3A] pb-2">
        <span className="flex items-center gap-1.5 text-[#5CA8FF]">
          <span className={`w-2 h-2 rounded-full bg-[#1677FF] ${prefersReduced ? "" : "animate-pulse"}`} />
          {isEn ? "[SCHEMATIC :: INTENT MAPPING]" : "[ESQUEMA :: MAPEO DE INTENCIÓN]"}
        </span>
        <span className="text-[#9AA5B8]">RADAR 360°</span>
      </div>

      <div className="my-auto py-4 flex items-center justify-center">
        <svg
          viewBox="0 0 300 240"
          className="w-full max-w-[280px] sm:max-w-[300px] h-auto select-none"
          aria-hidden="true"
        >
          {/* Anillos concéntricos */}
          <circle cx="150" cy="120" r="105" fill="none" stroke="#252D3A" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="150" cy="120" r="70" fill="none" stroke="#252D3A" strokeWidth="1" />
          <circle cx="150" cy="120" r="35" fill="none" stroke="#1677FF" strokeWidth="1" strokeOpacity="0.4" />

          {/* Ejes cartesianos */}
          <line x1="150" y1="15" x2="150" y2="225" stroke="#252D3A" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="45" y1="120" x2="255" y2="120" stroke="#252D3A" strokeWidth="1" strokeDasharray="2 4" />

          {/* Cuadrantes y arcos orgánicos de intención */}
          <path d="M 150 120 Q 110 60 85 45" fill="none" stroke="#1677FF" strokeWidth="1.5" strokeOpacity="0.7" />
          <path d="M 150 120 Q 190 60 215 45" fill="none" stroke="#2B85FF" strokeWidth="1.5" strokeOpacity="0.7" />
          <path d="M 150 120 Q 200 170 215 195" fill="none" stroke="#5CA8FF" strokeWidth="1.5" strokeOpacity="0.7" />
          <path d="M 150 120 Q 100 170 85 195" fill="none" stroke="#AFC4E8" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Nodos de los 4 ejes */}
          {/* Necesidad */}
          <g>
            <circle cx="85" cy="45" r="5" fill="#1677FF" />
            <text x="85" y="32" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "NEED" : "NECESIDAD"}
            </text>
            <text x="85" y="60" fill="#9AA5B8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              {isEn ? "Core bottleneck" : "Dolor real"}
            </text>
          </g>

          {/* Contexto */}
          <g>
            <circle cx="215" cy="45" r="5" fill="#2B85FF" />
            <text x="215" y="32" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "CONTEXT" : "CONTEXTO"}
            </text>
            <text x="215" y="60" fill="#9AA5B8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              {isEn ? "Environment & Data" : "Entorno & Datos"}
            </text>
          </g>

          {/* Objetivos */}
          <g>
            <circle cx="215" cy="195" r="5" fill="#5CA8FF" />
            <text x="215" y="218" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "OBJECTIVES" : "OBJETIVOS"}
            </text>
            <text x="215" y="185" fill="#9AA5B8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              {isEn ? "Measurable goals" : "Metas medibles"}
            </text>
          </g>

          {/* Alcance Inicial */}
          <g>
            <circle cx="85" cy="195" r="5" fill="#AFC4E8" />
            <text x="85" y="218" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "SCOPE" : "ALCANCE"}
            </text>
            <text x="85" y="185" fill="#9AA5B8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              {isEn ? "Honest boundaries" : "Límites honestos"}
            </text>
          </g>

          {/* Núcleo central de intención */}
          <circle cx="150" cy="120" r="14" fill="#0D121D" stroke="#1677FF" strokeWidth="2" />
          <circle cx="150" cy="120" r="6" fill="#1677FF" />
          <text x="150" y="145" fill="#5CA8FF" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {isEn ? "INTENT" : "INTENCIÓN"}
          </text>
        </svg>
      </div>

      <div className="pt-3 border-t border-[#252D3A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#9AA5B8]">{isEn ? "SCOPE ALIGNMENT:" : "ALINEACIÓN DE ALCANCE:"}</span>
        <span className="text-[#5CA8FF] font-semibold">
          {isEn ? "100% · NO ASSUMPTIONS" : "100% · SIN SUPOSICIONES"}
        </span>
      </div>
    </div>
  );
}

export function ArchitectureVisualizer() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div
      className="w-full h-full flex flex-col justify-between"
      aria-label={
        isEn
          ? "Schematic visualizer: Three decoupled architectural layers diagram"
          : "Visualizador esquemático: Diagrama de arquitectura de tres capas desacopladas"
      }
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA5B8] border-b border-[#252D3A] pb-2">
        <span className="flex items-center gap-1.5 text-[#2B85FF]">
          <Layers className="w-3.5 h-3.5 text-[#2B85FF]" />
          {isEn ? "[SCHEMATIC :: MULTI-TIER ARCHITECTURE]" : "[ESQUEMA :: ARQUITECTURA MULTICAPA]"}
        </span>
        <span className="text-[#9AA5B8]">{isEn ? "DECOUPLED TIERS" : "TIERS DESACOPLADOS"}</span>
      </div>

      <div className="my-auto py-3 space-y-3">
        {/* Tier 1: Client & Edge */}
        <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#5CA8FF] uppercase">Tier 01 // Frontend & Edge</span>
            <div className="text-xs font-semibold text-white">Next.js 16 + React 19 + Tailwind CSS</div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1677FF]/10 text-[#5CA8FF] border border-[#1677FF]/30">
            SSR / EDGE
          </span>
        </div>

        {/* Conector interactivo */}
        <div className="flex justify-center items-center gap-2 py-0.5 text-[#252D3A]">
          <div className="h-3 w-px bg-[#252D3A]" />
          <span className="text-[9px] font-mono text-[#9AA5B8]">
            {isEn ? "REST CONTRACTS / WEBSOCKETS" : "CONTRATOS REST / WEBSOCKETS"}
          </span>
          <div className="h-3 w-px bg-[#252D3A]" />
        </div>

        {/* Tier 2: Domain Logic */}
        <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#2B85FF] uppercase">
              {isEn ? "Tier 02 // Core Logic & APIs" : "Tier 02 // Lógica Core & APIs"}
            </span>
            <div className="text-xs font-semibold text-white">
              {isEn
                ? "Domain Services + Rate Limit + Auth"
                : "Servicios de Dominio + Rate Limit + Auth"}
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2B85FF]/10 text-[#2B85FF] border border-[#2B85FF]/30">
            {isEn ? "IDEMPOTENT" : "IDEMPOTENTE"}
          </span>
        </div>

        {/* Conector interactivo */}
        <div className="flex justify-center items-center gap-2 py-0.5 text-[#252D3A]">
          <div className="h-3 w-px bg-[#252D3A]" />
          <span className="text-[9px] font-mono text-[#9AA5B8]">TLS STRICT / POOL SSL</span>
          <div className="h-3 w-px bg-[#252D3A]" />
        </div>

        {/* Tier 3: Persistence */}
        <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#AFC4E8] uppercase">
              {isEn ? "Tier 03 // ACID Persistence" : "Tier 03 // Persistencia ACID"}
            </span>
            <div className="text-xs font-semibold text-white">
              {isEn ? "PostgreSQL / Neon + Audit Vault" : "PostgreSQL / Neon + Bóveda Auditoría"}
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5CA8FF]/10 text-[#AFC4E8] border border-[#5CA8FF]/30">
            {isEn ? "TRANSACTIONAL" : "TRANSACCIONAL"}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-[#252D3A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#9AA5B8]">{isEn ? "COUPLING:" : "ACOPLAMIENTO:"}</span>
        <span className="text-[#2B85FF] font-semibold">
          {isEn ? "MINIMAL · LATENCY: < 850 ms" : "MÍNIMO · LATENCIA: < 850 ms"}
        </span>
      </div>
    </div>
  );
}

export function BuildVisualizer() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div
      className="w-full h-full flex flex-col justify-between"
      aria-label={
        isEn
          ? "Schematic visualizer: Modular compilation and engineering matrix"
          : "Visualizador esquemático: Matriz de compilación y desarrollo modular"
      }
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA5B8] border-b border-[#252D3A] pb-2">
        <span className="flex items-center gap-1.5 text-[#5CA8FF]">
          <Terminal className="w-3.5 h-3.5 text-[#5CA8FF]" />
          {isEn ? "[SCHEMATIC :: MODULAR BUILD]" : "[ESQUEMA :: CONSTRUCCIÓN MODULAR]"}
        </span>
        <span className="text-[#9AA5B8]">CI PIPELINE</span>
      </div>

      <div className="my-auto py-3 space-y-2.5">
        <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#252D3A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1677FF]" />
            <div>
              <div className="text-xs font-medium text-white">UI Component Engine</div>
              <div className="text-[10px] text-[#9AA5B8] font-mono">Design tokens + Tailwind CSS</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            {isEn ? "COMPILED" : "COMPILADO"}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#252D3A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2B85FF]" />
            <div>
              <div className="text-xs font-medium text-white">TypeScript Strict Engine</div>
              <div className="text-[10px] text-[#9AA5B8] font-mono">
                {isEn ? "Strict typing with zero any" : "Tipado estricto sin any"}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            {isEn ? "VERIFIED" : "VERIFICADO"}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#252D3A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#5CA8FF]" />
            <div>
              <div className="text-xs font-medium text-white">State & Integrations</div>
              <div className="text-[10px] text-[#9AA5B8] font-mono">APIs, Gateways & Storage</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            {isEn ? "ACTIVE" : "ACTIVO"}
          </span>
        </div>

        {/* Barra de progreso de iteración */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] font-mono text-[#9AA5B8]">
            <span>{isEn ? "MODULAR COVERAGE" : "COBERTURA MODULAR"}</span>
            <span className="text-[#5CA8FF]">{isEn ? "100% TYPED" : "100% TIPADO"}</span>
          </div>
          <div className="h-1.5 w-full bg-[#141B2B] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1677FF] to-[#5CA8FF] w-full rounded-full" />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#252D3A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#9AA5B8]">{isEn ? "CODE INTEGRITY:" : "INTEGRIDAD DE CÓDIGO:"}</span>
        <span className="text-emerald-400 font-semibold">
          {isEn ? "0 ERRORS · MODULAR" : "0 ERRORES · MODULAR"}
        </span>
      </div>
    </div>
  );
}

export function ValidationVisualizer() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div
      className="w-full h-full flex flex-col justify-between"
      aria-label={
        isEn
          ? "Schematic visualizer: Validation, audit, and technical rigor matrix"
          : "Visualizador esquemático: Matriz de validación, auditoría y rigor técnico"
      }
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA5B8] border-b border-[#252D3A] pb-2">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {isEn ? "[SCHEMATIC :: RIGOR MATRIX]" : "[ESQUEMA :: MATRIZ DE RIGOR]"}
        </span>
        <span className="text-[#9AA5B8]">{isEn ? "QUALITY CONTROL" : "CONTROL DE CALIDAD"}</span>
      </div>

      <div className="my-auto py-3 grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] space-y-1">
          <div className="text-[10px] font-mono text-[#9AA5B8] uppercase">
            {isEn ? "Security & CSP" : "Seguridad & CSP"}
          </div>
          <div className="text-base font-bold text-emerald-400 font-mono">100 / 100</div>
          <div className="text-[10px] text-[#AFC4E8]">
            {isEn ? "Strict headers, no unsafe-eval" : "Cabeceras estrictas, sin unsafe-eval"}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] space-y-1">
          <div className="text-[10px] font-mono text-[#9AA5B8] uppercase">Lighthouse Perf</div>
          <div className="text-base font-bold text-[#5CA8FF] font-mono">
            {isEn ? "98 Desk / 66 Mob" : "98 Esc / 66 Móv"}
          </div>
          <div className="text-[10px] text-[#AFC4E8]">
            {isEn ? "Calibrated Core Web Vitals" : "Core Web Vitals calibrados"}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] space-y-1">
          <div className="text-[10px] font-mono text-[#9AA5B8] uppercase">
            {isEn ? "Accessibility" : "Accesibilidad"}
          </div>
          <div className="text-base font-bold text-[#2B85FF] font-mono">97 / 100</div>
          <div className="text-[10px] text-[#AFC4E8]">
            {isEn ? "WCAG 2.1 AA contrast & roles" : "WCAG 2.1 AA contraste y roles"}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#080B12] border border-[#252D3A] space-y-1">
          <div className="text-[10px] font-mono text-[#9AA5B8] uppercase">Multi-Viewport</div>
          <div className="text-base font-bold text-emerald-400 font-mono">8 / 8 OK</div>
          <div className="text-[10px] text-[#AFC4E8]">
            {isEn ? "320px to 1920px zero overflow" : "320px a 1920px sin overflow"}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#252D3A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#9AA5B8]">
          {isEn ? "SECURITY INVARIANTS:" : "INVARIANTES DE SEGURIDAD:"}
        </span>
        <span className="text-emerald-400 font-semibold">210 / 210 TESTS PASS</span>
      </div>
    </div>
  );
}

export function EvolutionVisualizer() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="w-full h-full flex flex-col justify-between"
      aria-label={
        isEn
          ? "Schematic visualizer: Orbital delivery, lifecycle, and evolution loop"
          : "Visualizador esquemático: Bucle orbital de entrega, ciclo de vida y evolución"
      }
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA5B8] border-b border-[#252D3A] pb-2">
        <span className="flex items-center gap-1.5 text-[#5CA8FF]">
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#5CA8FF] ${prefersReduced ? "" : "animate-spin"}`}
            style={{ animationDuration: "12s" }}
          />
          {isEn ? "[SCHEMATIC :: CONTINUOUS LIFECYCLE]" : "[ESQUEMA :: CICLO DE VIDA CONTINUO]"}
        </span>
        <span className="text-[#9AA5B8]">ORBITAL LOOP</span>
      </div>

      <div className="my-auto py-2 flex items-center justify-center">
        <svg
          viewBox="0 0 280 200"
          className="w-full max-w-[260px] h-auto select-none"
          aria-hidden="true"
        >
          {/* Órbita elíptica */}
          <ellipse cx="140" cy="100" rx="100" ry="60" fill="none" stroke="#252D3A" strokeWidth="1.5" strokeDasharray="4 4" />
          <ellipse cx="140" cy="100" rx="70" ry="40" fill="none" stroke="#1677FF" strokeWidth="1" strokeOpacity="0.3" />

          {/* 4 Nodos del ciclo de vida */}
          {/* 1. Despliegue CI/CD */}
          <g>
            <circle cx="140" cy="40" r="7" fill="#1677FF" />
            <text x="140" y="26" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "CI/CD DEPLOY" : "DESPLIEGUE CI/CD"}
            </text>
          </g>

          {/* 2. Telemetría */}
          <g>
            <circle cx="240" cy="100" r="7" fill="#2B85FF" />
            <text x="240" y="124" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "TELEMETRY" : "TELEMETRÍA"}
            </text>
          </g>

          {/* 3. Evolución */}
          <g>
            <circle cx="140" cy="160" r="7" fill="#5CA8FF" />
            <text x="140" y="180" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "EVOLUTION" : "EVOLUCIÓN"}
            </text>
          </g>

          {/* 4. Soporte */}
          <g>
            <circle cx="40" cy="100" r="7" fill="#AFC4E8" />
            <text x="40" y="124" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {isEn ? "SUPPORT" : "SOPORTE"}
            </text>
          </g>

          {/* Núcleo central de operación */}
          <circle cx="140" cy="100" r="16" fill="#0D121D" stroke="#2B85FF" strokeWidth="1.5" />
          <circle cx="140" cy="100" r="6" fill="#2B85FF" />
          <text x="140" y="104" fill="#FFFFFF" fontSize="7" fontFamily="monospace" textAnchor="middle">
            {isEn ? "ACTIVE" : "ACTIVO"}
          </text>
        </svg>
      </div>

      <div className="pt-3 border-t border-[#252D3A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#9AA5B8]">{isEn ? "HANDOFF:" : "TRANSFERENCIA:"}</span>
        <span className="text-[#5CA8FF] font-semibold">
          {isEn ? "FULL · 100% CLIENT OWNERSHIP" : "INTEGRAL · 100% PROPIEDAD CLIENTE"}
        </span>
      </div>
    </div>
  );
}

export function ProcessStageVisualizer({ stageNum }: VisualizerProps) {
  switch (stageNum) {
    case "01":
      return <DiscoveryVisualizer />;
    case "02":
      return <ArchitectureVisualizer />;
    case "03":
      return <BuildVisualizer />;
    case "04":
      return <ValidationVisualizer />;
    case "05":
      return <EvolutionVisualizer />;
    default:
      return <DiscoveryVisualizer />;
  }
}
