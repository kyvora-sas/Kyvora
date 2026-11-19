"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Cpu, Search, FileText, Mic, Play, RefreshCw, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useReducedMotion } from "framer-motion";

interface PromptScenario {
  id: string;
  title: string;
  prompt: string;
  response: string;
  tokens: number;
  activeTools: string[];
}

const SCENARIOS: PromptScenario[] = [
  {
    id: "arch",
    title: "Arquitectura Local Gateway",
    prompt: "Describir el flujo de datos seguro entre frontend y Ollama sin intermediarios externos.",
    response:
      "El frontend despacha solicitudes HTTP JSON directas a http://127.0.0.1:11434/api/generate. No se emplean wrappers como LangChain ni almacenes vectoriales externos. La memoria de contexto (KV cache) se gestiona de forma local en VRAM.",
    tokens: 46,
    activeTools: ["docs"],
  },
  {
    id: "latency",
    title: "Optimización de Tokens",
    prompt: "¿Cuál es el rendimiento esperado de gemma4:e2b en inferencia edge?",
    response:
      "Con cuantización Q4_K_M, gemma4:e2b mantiene un consumo de ~1.84 GB de VRAM y genera de 36 a 42 tokens/segundo en GPUs modernas, permitiendo streaming SSE continuo con latencia al primer token (TTFT) inferior a 180 ms.",
    tokens: 52,
    activeTools: ["web", "docs"],
  },
  {
    id: "tooling",
    title: "Invocación de Herramientas",
    prompt: "Integrar herramienta de búsqueda y síntesis de voz en modo autónomo.",
    response:
      "El runtime local expone esquemas JSON Schema para cada herramienta. El modelo selecciona la función requerida emitiendo bloques estructurados <tool_call> validados antes de ejecutar la acción correspondiente.",
    tokens: 41,
    activeTools: ["web", "voice"],
  },
];

export default function PulsAiConsole() {
  const prefersReduced = useReducedMotion();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [docReaderEnabled, setDocReaderEnabled] = useState(true);
  const [voiceUiEnabled, setVoiceUiEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState(SCENARIOS[0].response);
  const [tokenCount, setTokenCount] = useState(SCENARIOS[0].tokens);
  const [generationTime, setGenerationTime] = useState("1.18 s");
  const inferenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (inferenceTimerRef.current) clearInterval(inferenceTimerRef.current);
    };
  }, []);

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  // Actualizar respuesta al cambiar de escenario
  const handleSelectScenario = (index: number) => {
    if (inferenceTimerRef.current) clearInterval(inferenceTimerRef.current);
    setIsGenerating(false);
    setSelectedScenarioIndex(index);
    const scen = SCENARIOS[index];
    setDisplayedText(scen.response);
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
      setDisplayedText(currentScenario.response);
      setTokenCount(currentScenario.tokens);
      setGenerationTime("0.95 s");
      return;
    }

    setIsGenerating(true);
    setDisplayedText("");
    const fullText = currentScenario.response;
    const words = fullText.split(" ");
    let currentIndex = 0;
    const startTime = performance.now();

    inferenceTimerRef.current = setInterval(() => {
      currentIndex += 2;
      if (currentIndex >= words.length) {
        setDisplayedText(fullText);
        setIsGenerating(false);
        const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);
        setGenerationTime(`${elapsedSec} s`);
        setTokenCount(currentScenario.tokens);
        if (inferenceTimerRef.current) clearInterval(inferenceTimerRef.current);
      } else {
        setDisplayedText(words.slice(0, currentIndex).join(" "));
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
          <span className="text-[#9AA5B8] uppercase">Runtime Ollama Local · gemma4:e2b</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-amber-500/10 border-amber-500/30 text-amber-300">
            PROTOTIPO EXPERIMENTAL
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border bg-[#141B2B] border-[#252D3A] text-[#AFC4E8]">
            MODELO LOCAL GEMMA
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
              <span>Terminal de Inferencia Local con Gemma // Model: gemma4:e2b</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400/90 font-medium">
              [PROTOTIPO EXPERIMENTAL · MODELO LOCAL GEMMA]
            </span>
          </div>

          {/* Panel de Herramientas Dinámicas (Tool Selector) */}
          <div className="p-3.5 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5B8]">Esquema de Herramientas Activas:</span>
              <span className="text-[11px] text-[#AFC4E8]">[CONFIGURACIÓN OLLAMA API]</span>
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
              <span className="text-[#9AA5B8] text-[11px] uppercase tracking-wider">Escenarios de Inferencia:</span>
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
                    {scen.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Prompt */}
            <div className="space-y-1">
              <div className="text-[10px] text-[#5CA8FF] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B85FF]" />
                <span>Prompt del Sistema / Usuario:</span>
              </div>
              <p className="p-2.5 rounded bg-[#0D121D] border border-[#252D3A] text-white text-xs leading-relaxed">
                &ldquo;{currentScenario.prompt}&rdquo;
              </p>
            </div>

            {/* Output / Streaming Tokens */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#AFC4E8] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                  <span>Respuesta Generada ({tokenCount} tokens)</span>
                </span>
                <span className="text-[#9AA5B8] font-mono">[SIMULACIÓN STREAMING] {generationTime}</span>
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
                  <span>~38 tok/s [REFERENCIA LOCAL]</span>
                </span>
                <span className="hidden sm:inline text-[#252D3A]">|</span>
                <span className="hidden sm:inline">VRAM: 1.84 GB [CUANTIZADO]</span>
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
                    <span>Generando tokens...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Ejecutar Inferencia</span>
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
              <span>Arquitectura & Privacidad</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              100% LOCAL
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-3 text-xs font-mono">
            <div className="text-[11px] text-white font-semibold flex items-center gap-2 border-b border-[#252D3A] pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#2B85FF]" />
              <span>Especificación Técnica Verificada</span>
            </div>

            <ul className="space-y-2 text-[#AFC4E8]">
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">Motor Inferencia:</span>
                <span className="text-white text-right">Ollama Daemon (127.0.0.1:11434)</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">Modelo Base:</span>
                <span className="text-white text-right">gemma4:e2b (Google DeepMind)</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">Cuantización:</span>
                <span className="text-[#5CA8FF] text-right">Q4_K_M (Equilibrada)</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">Ventana de Contexto:</span>
                <span className="text-white text-right">8,192 tokens</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">Framework Externo:</span>
                <span className="text-amber-300 text-right">Ninguno (Zero LangChain)</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">Base Vector Externa:</span>
                <span className="text-amber-300 text-right">Ninguna (Zero Vector DB)</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-[#9AA5B8]">Privacidad:</span>
                <span className="text-emerald-400 text-right">Inferencia Edge sin telemetría</span>
              </li>
            </ul>
          </div>

          {/* Gráfico SVG de Distribución de Recursos y Rendimiento */}
          <div className="p-4 rounded-xl bg-[#080B12] border border-[#252D3A] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5B8] uppercase text-[10px] tracking-wider">
                Distribución de VRAM y Carga
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">~38 tok/s [REFERENCIA LOCAL]</span>
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
                Libre: 5.76 GB
              </text>

              {/* Barra de progreso de inferencia estática */}
              <line x1="10" y1="62" x2="310" y2="62" stroke="#141B2B" strokeWidth="6" strokeLinecap="round" />
              <line x1="10" y1="62" x2="220" y2="62" stroke="#2B85FF" strokeWidth="6" strokeLinecap="round" />
              <text x="10" y="76" fill="#9AA5B8" fontSize="9" fontFamily="monospace">
                Tasa decodificación: ~38 tok/s [REFERENCIA EN GPU/CUDA]
              </text>
            </svg>

            <div className="p-2.5 rounded bg-[#0D121D] border border-[#252D3A] text-[11px] font-mono text-[#9AA5B8] leading-relaxed">
              <strong className="text-white block">Nota de Desarrollo:</strong>
              PulsAI opera como un cliente local liviano. No transmite prompts a servidores de terceros ni depende de modelos remotos cerrados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
