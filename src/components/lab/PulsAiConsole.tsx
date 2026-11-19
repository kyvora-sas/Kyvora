"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Cpu, Search, FileText, Mic, Play, RefreshCw, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface PromptScenario {
  id: string;
  title: { es: string; en: string };
  prompt: { es: string; en: string };
  response: { es: string; en: string };
  tokens: number;
  activeTools: string[];
}

const SCENARIOS: PromptScenario[] = [
  {
    id: "arch",
    title: { es: "Arquitectura Local Gateway", en: "Local Gateway Architecture" },
    prompt: {
      es: "Describir el flujo de datos seguro entre frontend y Ollama sin intermediarios externos.",
      en: "Describe the secure data flow between the frontend and Ollama without external intermediaries.",
    },
    response: {
      es: "El frontend despacha solicitudes HTTP JSON directas a http://127.0.0.1:11434/api/generate. No se emplean wrappers como LangChain ni almacenes vectoriales externos. La memoria de contexto (KV cache) se gestiona de forma local en VRAM.",
      en: "The frontend dispatches direct HTTP JSON requests to http://127.0.0.1:11434/api/generate. No wrappers like LangChain or external vector stores are used. Context memory (KV cache) is managed locally in VRAM.",
    },
    tokens: 46,
    activeTools: ["docs"],
  },
  {
    id: "latency",
    title: { es: "Optimización de Tokens", en: "Token Optimization" },
    prompt: {
      es: "¿Cuál es el rendimiento esperado de gemma4:e2b en inferencia edge?",
      en: "What is the expected performance of gemma4:e2b for edge inference?",
    },
    response: {
      es: "Con cuantización Q4_K_M, gemma4:e2b mantiene un consumo de ~1.84 GB de VRAM y genera de 36 a 42 tokens/segundo en GPUs modernas, permitiendo streaming SSE continuo con latencia al primer token (TTFT) inferior a 180 ms.",
      en: "With Q4_K_M quantization, gemma4:e2b maintains ~1.84 GB VRAM usage and generates 36 to 42 tokens/second on modern GPUs, enabling continuous SSE streaming with time-to-first-token (TTFT) under 180 ms.",
    },
    tokens: 52,
    activeTools: ["web", "docs"],
  },
  {
    id: "tooling",
    title: { es: "Invocación de Herramientas", en: "Tool Calling" },
    prompt: {
      es: "Integrar herramienta de búsqueda y síntesis de voz en modo autónomo.",
      en: "Integrate search tool and voice synthesis in autonomous mode.",
    },
    response: {
      es: "El runtime local expone esquemas JSON Schema para cada herramienta. El modelo selecciona la función requerida emitiendo bloques estructurados <tool_call> validados antes de ejecutar la acción correspondiente.",
      en: "The local runtime exposes JSON Schema definitions for each tool. The model selects the required function by emitting structured <tool_call> blocks that are validated before executing the corresponding action.",
    },
    tokens: 41,
    activeTools: ["web", "voice"],
  },
];

export default function PulsAiConsole() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const prefersReduced = useReducedMotion();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [docReaderEnabled, setDocReaderEnabled] = useState(true);
  const [voiceUiEnabled, setVoiceUiEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedWordCount, setStreamedWordCount] = useState<number | null>(null);
  const [tokenCount, setTokenCount] = useState(SCENARIOS[0].tokens);
  const [generationTime, setGenerationTime] = useState("1.18 s");
  const inferenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (inferenceTimerRef.current) clearInterval(inferenceTimerRef.current);
    };
  }, []);

  const currentScenario = SCENARIOS[selectedScenarioIndex];
  const fullResponseText = currentScenario.response[language];
  const displayedText =
    streamedWordCount === null
      ? fullResponseText
      : fullResponseText.split(" ").slice(0, streamedWordCount).join(" ");

  // Actualizar respuesta al cambiar de escenario
  const handleSelectScenario = (index: number) => {
    if (inferenceTimerRef.current) clearInterval(inferenceTimerRef.current);
    setIsGenerating(false);
    setSelectedScenarioIndex(index);
    setStreamedWordCount(null);
    const scen = SCENARIOS[index];
    setTokenCount(scen.tokens);
    setGenerationTime("1.12 s");
    // Sincronizar herramientas sugeridas
    setWebSearchEnabled(scen.activeTools.includes("web"));
    setDocReaderEnabled(scen.activeTools.includes("docs"));
    setVoiceUiEnabled(scen.activeTools.includes("voice"));
  };

  // Simulación de streaming de tokens en tiempo real
  const handleSimulateInference = () => {
    if (isGenerating) return;
    if (inferenceTimerRef.current) clearInterval(inferenceTimerRef.current);

    if (prefersReduced) {
      setStreamedWordCount(null);
      setTokenCount(currentScenario.tokens);
      setGenerationTime("0.95 s");
      return;
    }

    setIsGenerating(true);
    setStreamedWordCount(0);
    const words = fullResponseText.split(" ");
    let currentIndex = 0;
    const startTime = performance.now();

    inferenceTimerRef.current = setInterval(() => {
      currentIndex += 2;
      if (currentIndex >= words.length) {
        setStreamedWordCount(null);
        setIsGenerating(false);
        const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);
        setGenerationTime(`${elapsedSec} s`);
        setTokenCount(currentScenario.tokens);
        if (inferenceTimerRef.current) clearInterval(inferenceTimerRef.current);
      } else {
        setStreamedWordCount(currentIndex);
        setTokenCount(Math.min(currentScenario.tokens, Math.floor(currentIndex * 1.3)));
      }
    }, 65);
  };

  return (
    <div className="w-full rounded-2xl bg-[#080B12] border border-[#252D3A] overflow-hidden flex flex-col">
      {/* 1. Header de Telemetría HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0D121D] border-b border-[#252D3A] text-xs font-mono">
        <div className="flex items-center gap-2.5 text-[#AFC4E8]">
          <span className="p-1 rounded bg-[#141B2B] text-amber-400 border border-[#252D3A]">
            <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span className="text-white font-semibold tracking-wider">LAB-05 // PULSAI ANALYTICS</span>
          <span className="text-[#252D3A]">|</span>
          <span className="text-[#9AA5B8] uppercase">
            {isEn ? "Local Ollama Runtime · gemma4:e2b" : "Runtime Ollama Local · gemma4:e2b"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-amber-500/10 border-amber-500/30 text-amber-300">
            {isEn ? "EXPERIMENTAL PROTOTYPE" : "PROTOTIPO EXPERIMENTAL"}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border bg-[#141B2B] border-[#252D3A] text-[#AFC4E8]">
            {isEn ? "LOCAL GEMMA MODEL" : "MODELO LOCAL GEMMA"}
          </span>
        </div>
      </div>

      {/* 2. Cuerpo Principal: Terminal de Inferencia & Diagnóstico */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (7 cols): Terminal interactiva y herramientas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#AFC4E8] flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
              <span>
                {isEn
                  ? "Local Gemma Inference Terminal // Model: gemma4:e2b"
                  : "Terminal de Inferencia Local con Gemma // Model: gemma4:e2b"}
              </span>
            </span>
            <span className="text-[10px] font-mono text-amber-400/90 font-medium">
              {isEn
                ? "[EXPERIMENTAL PROTOTYPE · LOCAL GEMMA MODEL]"
                : "[PROTOTIPO EXPERIMENTAL · MODELO LOCAL GEMMA]"}
            </span>
          </div>

          {/* Panel de Herramientas Dinámicas (Tool Selector) */}
          <div className="p-3.5 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5B8]">
                {isEn ? "Active Tools Schema:" : "Esquema de Herramientas Activas:"}
              </span>
              <span className="text-[11px] text-[#AFC4E8]">
                {isEn ? "[OLLAMA API CONFIG]" : "[CONFIGURACIÓN OLLAMA API]"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {/* Web Search */}
              <button
                type="button"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  webSearchEnabled
                    ? "bg-[#141B2B] border-[#1677FF]/60 text-white"
                    : "bg-[#080B12] border-[#252D3A] text-[#9AA5B8]"
                }`}
                aria-pressed={webSearchEnabled}
              >
                <div className="flex items-center gap-2">
                  <Search className={`w-3.5 h-3.5 ${webSearchEnabled ? "text-[#5CA8FF]" : "text-[#9AA5B8]"}`} />
                  <span>Web Search</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${webSearchEnabled ? "bg-emerald-400" : "bg-[#252D3A]"}`}
                />
              </button>

              {/* Doc Reader */}
              <button
                type="button"
                onClick={() => setDocReaderEnabled(!docReaderEnabled)}
                className={`px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  docReaderEnabled
                    ? "bg-[#141B2B] border-[#1677FF]/60 text-white"
                    : "bg-[#080B12] border-[#252D3A] text-[#9AA5B8]"
                }`}
                aria-pressed={docReaderEnabled}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-3.5 h-3.5 ${docReaderEnabled ? "text-[#5CA8FF]" : "text-[#9AA5B8]"}`} />
                  <span>Doc Reader</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${docReaderEnabled ? "bg-emerald-400" : "bg-[#252D3A]"}`}
                />
              </button>

              {/* Voice UI */}
              <button
                type="button"
                onClick={() => setVoiceUiEnabled(!voiceUiEnabled)}
                className={`px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  voiceUiEnabled
                    ? "bg-[#141B2B] border-[#1677FF]/60 text-white"
                    : "bg-[#080B12] border-[#252D3A] text-[#9AA5B8]"
                }`}
                aria-pressed={voiceUiEnabled}
              >
                <div className="flex items-center gap-2">
                  <Mic className={`w-3.5 h-3.5 ${voiceUiEnabled ? "text-[#5CA8FF]" : "text-[#9AA5B8]"}`} />
                  <span>Voice UI</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${voiceUiEnabled ? "bg-emerald-400" : "bg-[#252D3A]"}`}
                />
              </button>
            </div>
          </div>

          {/* Consola de Texto e Inferencia */}
          <div className="rounded-xl bg-[#05080E] border border-[#252D3A] p-4 font-mono text-xs space-y-3">
            {/* Selector de Prompts de Prueba */}
            <div className="flex items-center justify-between gap-2 border-b border-[#252D3A] pb-2.5">
              <span className="text-[#9AA5B8] text-[11px] uppercase tracking-wider">
                {isEn ? "Inference Scenarios:" : "Escenarios de Inferencia:"}
              </span>
              <div className="flex gap-1.5 overflow-x-auto">
                {SCENARIOS.map((scen, idx) => (
                  <button
                    key={scen.id}
                    type="button"
                    onClick={() => handleSelectScenario(idx)}
                    className={`px-2.5 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                      selectedScenarioIndex === idx
                        ? "bg-[#1677FF]/20 text-[#5CA8FF] border border-[#1677FF]/40 font-semibold"
                        : "bg-[#0D121D] text-[#9AA5B8] hover:text-[#AFC4E8] border border-[#252D3A]"
                    }`}
                  >
                    {scen.title[language]}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Prompt */}
            <div className="space-y-1">
              <div className="text-[10px] text-[#5CA8FF] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B85FF]" />
                <span>{isEn ? "System / User Prompt:" : "Prompt del Sistema / Usuario:"}</span>
              </div>
              <p className="p-2.5 rounded bg-[#0D121D] border border-[#252D3A] text-white text-xs leading-relaxed">
                &ldquo;{currentScenario.prompt[language]}&rdquo;
              </p>
            </div>

            {/* Output / Streaming Tokens */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#AFC4E8] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                  <span>
                    {isEn
                      ? `Generated Response (${tokenCount} tokens)`
                      : `Respuesta Generada (${tokenCount} tokens)`}
                  </span>
                </span>
                <span className="text-[#9AA5B8] font-mono">
                  {isEn ? `[STREAMING SIMULATION] ${generationTime}` : `[SIMULACIÓN STREAMING] ${generationTime}`}
                </span>
              </div>

              <div className="p-3 rounded bg-[#080B12] border border-[#252D3A] text-[#AFC4E8] min-h-[90px] leading-relaxed relative">
                <p>
                  {displayedText}
                  {isGenerating && (
                    <span className="inline-block w-2 h-3.5 bg-[#5CA8FF] ml-1 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>

            {/* Barra de Controles y Ejecución */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#252D3A]">
              <div className="flex items-center gap-4 text-[11px] text-[#9AA5B8]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isEn ? "~38 tok/s [LOCAL BENCHMARK]" : "~38 tok/s [REFERENCIA LOCAL]"}</span>
                </span>
                <span className="hidden sm:inline text-[#252D3A]">|</span>
                <span className="hidden sm:inline">
                  {isEn ? "VRAM: 1.84 GB [QUANTIZED]" : "VRAM: 1.84 GB [CUANTIZADO]"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSimulateInference}
                disabled={isGenerating}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-all ${
                  isGenerating
                    ? "bg-[#141B2B] text-[#9AA5B8] border border-[#252D3A] cursor-not-allowed"
                    : "bg-[#1677FF] hover:bg-[#2B85FF] text-white shadow-sm shadow-[#1677FF]/30"
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isEn ? "Generating tokens..." : "Generando tokens..."}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isEn ? "Run Inference" : "Ejecutar Inferencia"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 cols): Arquitectura Verificada & Telemetría */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#AFC4E8] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>{isEn ? "Architecture & Privacy" : "Arquitectura & Privacidad"}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              100% LOCAL
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-3 text-xs font-mono">
            <div className="text-[11px] text-white font-semibold flex items-center gap-2 border-b border-[#252D3A] pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#2B85FF]" />
              <span>
                {isEn ? "Verified Technical Specification" : "Especificación Técnica Verificada"}
              </span>
            </div>

            <ul className="space-y-2 text-[#AFC4E8]">
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">
                  {isEn ? "Inference Engine:" : "Motor Inferencia:"}
                </span>
                <span className="text-white text-right">Ollama Daemon (127.0.0.1:11434)</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">{isEn ? "Base Model:" : "Modelo Base:"}</span>
                <span className="text-white text-right">gemma4:e2b (Google DeepMind)</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">{isEn ? "Quantization:" : "Cuantización:"}</span>
                <span className="text-[#5CA8FF] text-right">
                  {isEn ? "Q4_K_M (Balanced)" : "Q4_K_M (Equilibrada)"}
                </span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">
                  {isEn ? "Context Window:" : "Ventana de Contexto:"}
                </span>
                <span className="text-white text-right">8,192 tokens</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">
                  {isEn ? "External Framework:" : "Framework Externo:"}
                </span>
                <span className="text-amber-300 text-right">
                  {isEn ? "None (Zero LangChain)" : "Ninguno (Zero LangChain)"}
                </span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">
                  {isEn ? "External Vector DB:" : "Base Vector Externa:"}
                </span>
                <span className="text-amber-300 text-right">
                  {isEn ? "None (Zero Vector DB)" : "Ninguna (Zero Vector DB)"}
                </span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">{isEn ? "Privacy:" : "Privacidad:"}</span>
                <span className="text-emerald-400 text-right">
                  {isEn ? "Zero-telemetry edge inference" : "Inferencia Edge sin telemetría"}
                </span>
              </li>
            </ul>
          </div>

          {/* Gráfico SVG de Distribución de Recursos y Rendimiento */}
          <div className="p-4 rounded-xl bg-[#080B12] border border-[#252D3A] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5B8] uppercase text-[10px] tracking-wider">
                {isEn ? "VRAM & Load Distribution" : "Distribución de VRAM y Carga"}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {isEn ? "~38 tok/s [LOCAL BENCHMARK]" : "~38 tok/s [REFERENCIA LOCAL]"}
              </span>
            </div>

            <svg viewBox="0 0 320 80" className="w-full h-auto select-none" aria-hidden="true">
              {/* Barra de VRAM Total */}
              <rect x="10" y="10" width="300" height="18" rx="4" fill="#0D121D" stroke="#252D3A" strokeWidth="1" />
              {/* VRAM del modelo gemma4 (1.84 GB de 8 GB = ~23%) */}
              <rect x="10" y="10" width="70" height="18" rx="4" fill="#1677FF" opacity="0.85" />
              {/* Contexto KV Cache (~0.4 GB = ~5%) */}
              <rect x="80" y="10" width="16" height="18" fill="#5CA8FF" opacity="0.8" />
              {/* Texto leyenda */}
              <text x="12" y="42" fill="#AFC4E8" fontSize="9" fontFamily="monospace">
                Gemma: 1.84 GB
              </text>
              <text x="110" y="42" fill="#9AA5B8" fontSize="9" fontFamily="monospace">
                KV Cache: 0.4 GB
              </text>
              <text x="230" y="42" fill="#9AA5B8" fontSize="9" fontFamily="monospace">
                {isEn ? "Free: 5.76 GB" : "Libre: 5.76 GB"}
              </text>

              {/* Barra de progreso de inferencia estática */}
              <line x1="10" y1="62" x2="310" y2="62" stroke="#141B2B" strokeWidth="6" strokeLinecap="round" />
              <line x1="10" y1="62" x2="220" y2="62" stroke="#2B85FF" strokeWidth="6" strokeLinecap="round" />
              <text x="10" y="76" fill="#9AA5B8" fontSize="9" fontFamily="monospace">
                {isEn
                  ? "Decode rate: ~38 tok/s [GPU/CUDA REFERENCE]"
                  : "Tasa decodificación: ~38 tok/s [REFERENCIA EN GPU/CUDA]"}
              </text>
            </svg>

            <div className="p-2.5 rounded bg-[#0D121D] border border-[#252D3A] text-[11px] font-mono text-[#9AA5B8] leading-relaxed">
              <strong className="text-white block">
                {isEn ? "Development Note:" : "Nota de Desarrollo:"}
              </strong>
              {isEn
                ? "PulsAI runs as a lightweight local client. It never sends prompts to third-party servers or depends on closed remote models."
                : "PulsAI opera como un cliente local liviano. No transmite prompts a servidores de terceros ni depende de modelos remotos cerrados."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
