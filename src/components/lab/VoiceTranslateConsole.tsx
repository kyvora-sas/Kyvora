"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Volume2, ArrowRightLeft, Cpu, Play, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { useLanguage } from "@/context/LanguageContext";

interface TranslationPair {
  id: string;
  sourceLang: { es: string; en: string };
  targetLang: { es: string; en: string };
  sampleInput: string;
  sampleOutput: string;
  latencyMs: number;
}

const SAMPLE_PAIRS: TranslationPair[] = [
  {
    id: "es-en",
    sourceLang: { es: "Español (ES)", en: "Spanish (ES)" },
    targetLang: { es: "Inglés (EN)", en: "English (EN)" },
    sampleInput: "Convertimos ideas complejas en software real y mantenible.",
    sampleOutput: "We turn complex ideas into real, maintainable software.",
    latencyMs: 340,
  },
  {
    id: "en-es",
    sourceLang: { es: "Inglés (EN)", en: "English (EN)" },
    targetLang: { es: "Español (ES)", en: "Spanish (ES)" },
    sampleInput: "Building low-latency digital systems with purposeful engineering.",
    sampleOutput: "Construyendo sistemas digitales de baja latencia con ingeniería intencional.",
    latencyMs: 310,
  },
];

export default function VoiceTranslateConsole() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<"idle" | "listening" | "translating" | "synthesizing">("idle");
  const [echoCancellationEnabled, setEchoCancellationEnabled] = useState(true);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const currentPair = SAMPLE_PAIRS[selectedPairIndex];

  const handleSimulateTranslation = () => {
    if (isProcessing) return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setIsProcessing(true);
    setCurrentStep("listening");

    const t1 = setTimeout(() => {
      setCurrentStep("translating");
      const t2 = setTimeout(() => {
        setCurrentStep("synthesizing");
        const t3 = setTimeout(() => {
          setCurrentStep("idle");
          setIsProcessing(false);
        }, 1200);
        timersRef.current.push(t3);
      }, 1000);
      timersRef.current.push(t2);
    }, 800);
    timersRef.current.push(t1);
  };

  const handleSwapLanguages = () => {
    setSelectedPairIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div className="w-full rounded-2xl bg-[#080B12] border border-[#252D3A] overflow-hidden flex flex-col">
      {/* 1. Header de Telemetría HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0D121D] border-b border-[#252D3A] text-xs font-mono">
        <div className="flex items-center gap-2.5 text-[#AFC4E8]">
          <span className="p-1 rounded bg-[#141B2B] text-[#5CA8FF] border border-[#252D3A]">
            <Mic className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span className="text-white font-semibold tracking-wider">LAB-03 // VOICETRANSLATE</span>
          <span className="text-[#252D3A]">|</span>
          <span className="text-[#9AA5B8] uppercase">Web Speech API + Gemini Flash</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-[#1677FF]/15 border-[#2B85FF]/40 text-[#5CA8FF]">
            {isEn ? "BETA PHASE" : "FASE BETA"}
          </span>
          <a
            href="https://github.com/Kyvora-org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border bg-[#141B2B] hover:bg-[#1C263B] border-[#252D3A] text-white transition-colors"
          >
            <GithubIcon className="w-3 h-3 text-[#2B85FF]" />
            <span>Kyvora-org/VoiceTranslate</span>
          </a>
        </div>
      </div>

      {/* 2. Cuerpo Principal de la Consola: Pipeline de Audio & Interfaz */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (7 cols): Pipeline Visual & Simulación */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#AFC4E8] flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
              <span>
                {isEn
                  ? "3-Stage Multimodal Inference Pipeline"
                  : "Pipeline de Inferencia Multimodal en 3 Fases"}
              </span>
            </span>
            <span className="text-[10px] font-mono text-[#9AA5B8]">
              {isEn ? "[SEQUENCE DEMONSTRATION]" : "[DEMOSTRACIÓN DE SECUENCIA]"}
            </span>
          </div>

          {/* Fases Visuales del Pipeline */}
          <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
            {/* Paso 1: Escucha / Captura */}
            <div
              className={`p-3 rounded-xl border transition-colors ${
                currentStep === "listening"
                  ? "bg-[#141B2B] border-[#2B85FF] text-white"
                  : "bg-[#0D121D] border-[#252D3A] text-[#9AA5B8]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold">{isEn ? "STAGE 1" : "FASE 1"}</span>
                <Mic className={`w-3.5 h-3.5 ${currentStep === "listening" ? "text-[#5CA8FF] animate-pulse" : ""}`} />
              </div>
              <span className="block font-medium">{isEn ? "Transcription" : "Transcripción"}</span>
              <span className="text-[10px] text-[#AFC4E8]/80 block mt-0.5">Web Speech API</span>
            </div>

            {/* Paso 2: Inferencia Contextual Gemini */}
            <div
              className={`p-3 rounded-xl border transition-colors ${
                currentStep === "translating"
                  ? "bg-[#141B2B] border-[#2B85FF] text-white"
                  : "bg-[#0D121D] border-[#252D3A] text-[#9AA5B8]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold">{isEn ? "STAGE 2" : "FASE 2"}</span>
                <Cpu className={`w-3.5 h-3.5 ${currentStep === "translating" ? "text-[#5CA8FF] animate-spin" : ""}`} />
              </div>
              <span className="block font-medium">{isEn ? "Translation" : "Traducción"}</span>
              <span className="text-[10px] text-[#AFC4E8]/80 block mt-0.5">Gemini 2.5 Flash</span>
            </div>

            {/* Paso 3: Síntesis Auditiva */}
            <div
              className={`p-3 rounded-xl border transition-colors ${
                currentStep === "synthesizing"
                  ? "bg-[#141B2B] border-[#2B85FF] text-white"
                  : "bg-[#0D121D] border-[#252D3A] text-[#9AA5B8]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold">{isEn ? "STAGE 3" : "FASE 3"}</span>
                <Volume2 className={`w-3.5 h-3.5 ${currentStep === "synthesizing" ? "text-[#10B981] animate-bounce" : ""}`} />
              </div>
              <span className="block font-medium">{isEn ? "Voice Synthesis" : "Síntesis Voz"}</span>
              <span className="text-[10px] text-[#AFC4E8]/80 block mt-0.5">SpeechSynthesis</span>
            </div>
          </div>

          {/* VUMeter reactivo y cuadro de diálogo */}
          <div className="rounded-xl bg-[#0D121D] border border-[#252D3A] p-4 space-y-3 font-mono text-xs">
            {/* Visualización de Nivel de Decibelios */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9AA5B8]">
                  {isEn ? "Microphone Input Level" : "Nivel de Entrada Microfónico"}
                </span>
                <span className="text-[10px] text-[#5CA8FF]">
                  {isEn ? "[REACTIVE SIMULATION] -18 dBFS" : "[SIMULACIÓN REACTIVA] -18 dBFS"}
                </span>
              </div>
              <div className="grid grid-cols-16 gap-1 h-2 w-full bg-[#080B12] p-0.5 rounded border border-[#252D3A]">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full rounded-xs transition-colors ${
                      currentStep === "listening"
                        ? i < 11
                          ? "bg-[#10B981]"
                          : i < 14
                          ? "bg-amber-400"
                          : "bg-red-500"
                        : i < 3
                        ? "bg-[#252D3A]"
                        : "bg-[#141B2B]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tarjeta de Entrada (Origen) */}
            <div className="p-3 rounded-lg bg-[#080B12] border border-[#252D3A] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#9AA5B8]">
                <span>
                  {isEn ? "SOURCE" : "ORIGEN"}: {currentPair.sourceLang[language]}
                </span>
                <span className="text-[#5CA8FF]">
                  {isEn ? "Captured Voice" : "Voz Capturada"}
                </span>
              </div>
              <p className="text-white text-xs leading-relaxed font-sans font-light">
                &ldquo;{currentPair.sampleInput}&rdquo;
              </p>
            </div>

            {/* Tarjeta de Salida (Destino) */}
            <div className="p-3 rounded-lg bg-[#080B12] border border-[#252D3A] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#9AA5B8]">
                <span>
                  {isEn ? "TARGET" : "DESTINO"}: {currentPair.targetLang[language]}
                </span>
                <span className="text-[#10B981]">
                  {isEn ? "Synthesized Text & Audio" : "Texto y Audio Sintetizado"}
                </span>
              </div>
              <p className="text-[#AFC4E8] text-xs leading-relaxed font-sans font-light">
                &ldquo;{currentPair.sampleOutput}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 cols): Controles de Modo & Opciones */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#252D3A] pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#9AA5B8]">
                  {isEn ? "Conversation Mode" : "Modo Conversación"}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {isEn ? "Live Bidirectional" : "Bidireccional en Vivo"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleSwapLanguages}
                className="p-2 rounded bg-[#141B2B] hover:bg-[#1C263B] text-[#5CA8FF] border border-[#252D3A] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                title={isEn ? "Swap languages" : "Invertir idiomas"}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isEn ? "Swap" : "Invertir"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">{isEn ? "Avg Latency" : "Latencia Media"}</span>
                  <span className="text-[9px] text-[#5CA8FF] font-semibold">
                    {isEn ? "[TARGET]" : "[OBJETIVO]"}
                  </span>
                </div>
                <span className="text-white font-medium block mt-1">~{currentPair.latencyMs} ms</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">{isEn ? "TTS Engine" : "Motor TTS"}</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">
                    {isEn ? "[NATIVE API]" : "[API NATIVA]"}
                  </span>
                </div>
                <span className="text-emerald-400 font-medium block mt-1">SpeechSynthesis</span>
              </div>
            </div>

            {/* Conmutador de Prevención de Eco */}
            <div className="p-3 rounded bg-[#080B12] border border-[#252D3A] flex items-center justify-between">
              <div>
                <span className="text-white block text-[11px] font-medium">
                  {isEn ? "Acoustic Echo Cancellation" : "Supresión de Eco Acústico"}
                </span>
                <span className="text-[10px] text-[#9AA5B8]">
                  {isEn ? "[BROWSER API CONFIG]" : "[CONFIGURACIÓN BROWSER API]"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEchoCancellationEnabled(!echoCancellationEnabled)}
                className={`p-1.5 rounded border text-[11px] transition-colors cursor-pointer ${
                  echoCancellationEnabled
                    ? "bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]"
                    : "bg-[#141B2B] border-[#252D3A] text-[#9AA5B8]"
                }`}
              >
                {echoCancellationEnabled
                  ? isEn
                    ? "ACTIVE"
                    : "ACTIVO"
                  : isEn
                    ? "INACTIVE"
                    : "INACTIVO"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSimulateTranslation}
              disabled={isProcessing}
              className="w-full py-2.5 px-3 rounded-lg bg-[#1677FF] hover:bg-[#2B85FF] text-white text-xs font-mono tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {isProcessing
                  ? isEn
                    ? "Running translation..."
                    : "Ejecutando traducción..."
                  : isEn
                    ? "Simulate Full Pipeline"
                    : "Simular Flujo Completo"}
              </span>
            </button>

            <div className="p-3 rounded bg-[#080B12] border border-[#252D3A] text-[11px] text-[#AFC4E8]/80 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEn ? "Open Client Architecture" : "Arquitectura Abierta del Cliente"}</span>
              </div>
              <p>
                {isEn
                  ? "VoiceTranslate processes audio directly in the browser using standard Web Speech API, without relying on proprietary continuous transcription servers."
                  : "VoiceTranslate procesa la señal de audio directamente en el navegador mediante Web Speech API estándar, sin depender de servidores propietarios de transcripción continua."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
