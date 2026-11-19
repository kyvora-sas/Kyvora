"use client";

import { useState, useRef, useEffect } from "react";
import { Film, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Eye, EyeOff, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function KyvoraStudioConsole() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [playheadPos, setPlayheadPos] = useState(140); // 10 to 470 px
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isTitlesVisible, setIsTitlesVisible] = useState(true);
  const [exportCodec, setExportCodec] = useState<"H.264" | "ProRes-Proxy" | "VP9">("H.264");
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setPlayheadPos((prev) => {
          if (prev >= 465) {
            setIsPlaying(false);
            return 465;
          }
          return prev + 3;
        });
      }, 66);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  const formattedTimecode = () => {
    const totalFrames = Math.floor((playheadPos / 470) * 1800); // 30 sec * 60 fps
    const sec = Math.floor(totalFrames / 60);
    const frames = totalFrames % 60;
    return `00:00:${String(sec).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
  };

  const handleStepPlayhead = (delta: number) => {
    setPlayheadPos((prev) => Math.max(10, Math.min(465, prev + delta)));
  };

  return (
    <div className="w-full rounded-2xl bg-[#080B12] border border-[#252D3A] overflow-hidden flex flex-col">
      {/* 1. Header de Telemetría HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0D121D] border-b border-[#252D3A] text-xs font-mono">
        <div className="flex items-center gap-2.5 text-[#AFC4E8]">
          <span className="p-1 rounded bg-[#141B2B] text-purple-400 border border-[#252D3A]">
            <Film className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span className="text-white font-semibold tracking-wider">LAB-04 // KYVORA STUDIO</span>
          <span className="text-[#252D3A]">|</span>
          <span className="text-[#9AA5B8] uppercase">
            {isEn
              ? "Desktop NLE Editor (Tauri 2 + FFmpeg 7)"
              : "Editor NLE de Escritorio (Tauri 2 + FFmpeg 7)"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-purple-500/10 border-purple-500/30 text-purple-300">
            {isEn ? "IN DEVELOPMENT" : "EN DESARROLLO"}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border bg-[#141B2B] border-[#252D3A] text-[#AFC4E8]">
            TAURI 2 + RUST + FFMPEG
          </span>
        </div>
      </div>

      {/* 2. Cuerpo Principal de la Consola: Timeline Multipista & Monitor de Previsualización */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (7 cols): Timeline Multipista Interactivo */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#AFC4E8] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
              <span>
                {isEn
                  ? "Multi-Track Timeline (.XTP Project)"
                  : "Línea de Tiempo Multipista (Proyecto .XTP)"}
              </span>
            </span>
            <span className="text-[10px] font-mono text-[#9AA5B8]">
              {isEn
                ? "[INTERACTIVE NLE SUITE SIMULATION]"
                : "[SIMULACIÓN INTERACTIVA DE SUITE NLE]"}
            </span>
          </div>

          {/* Línea de Tiempo NLE con Tracks V1, V2, A1 */}
          <div className="rounded-xl bg-[#0D121D] border border-[#252D3A] p-4 space-y-3 font-mono text-xs">
            {/* Cabecera de controles del reproductor */}
            <div className="flex items-center justify-between border-b border-[#252D3A] pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStepPlayhead(-40)}
                  className="p-1.5 rounded bg-[#080B12] hover:bg-[#141B2B] text-[#AFC4E8] border border-[#252D3A] cursor-pointer"
                  title={isEn ? "Step back 40 frames" : "Retroceder 40 frames"}
                >
                  <SkipBack className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 cursor-pointer font-semibold shadow-sm shadow-purple-600/30"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>
                    {isPlaying ? (isEn ? "Pause" : "Pausar") : isEn ? "Play" : "Reproducir"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStepPlayhead(40)}
                  className="p-1.5 rounded bg-[#080B12] hover:bg-[#141B2B] text-[#AFC4E8] border border-[#252D3A] cursor-pointer"
                  title={isEn ? "Step forward 40 frames" : "Avanzar 40 frames"}
                >
                  <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="px-3 py-1 rounded bg-[#080B12] border border-[#252D3A] text-purple-300 font-mono text-sm tracking-wider">
                {formattedTimecode()}
              </div>
            </div>

            {/* Representación SVG del Timeline y Tracks */}
            <div className="relative rounded-lg bg-[#080B12] border border-[#252D3A] p-2 overflow-x-auto">
              <svg viewBox="0 0 500 150" className="w-full h-auto select-none min-w-[420px]">
                {/* Regla de código de tiempo superior */}
                <rect x="0" y="0" width="500" height="20" fill="#0D121D" />
                <line x1="0" y1="20" x2="500" y2="20" stroke="#252D3A" strokeWidth="1" />
                <text x="15" y="14" fill="#9AA5B8" fontSize="9" fontFamily="monospace">00:00:00</text>
                <text x="135" y="14" fill="#9AA5B8" fontSize="9" fontFamily="monospace">00:00:10</text>
                <text x="255" y="14" fill="#9AA5B8" fontSize="9" fontFamily="monospace">00:00:20</text>
                <text x="375" y="14" fill="#9AA5B8" fontSize="9" fontFamily="monospace">00:00:30</text>

                {/* Pista T1: Títulos / Overlays */}
                <g transform="translate(0, 26)">
                  <rect x="5" y="0" width="40" height="30" rx="3" fill="#141B2B" stroke="#252D3A" />
                  <text x="25" y="18" textAnchor="middle" fill="#9AA5B8" fontSize="9" fontWeight="bold">T1</text>
                  <rect
                    x="55"
                    y="4"
                    width="200"
                    height="22"
                    rx="4"
                    fill={isTitlesVisible ? "#9333EA" : "#252D3A"}
                    opacity={isTitlesVisible ? 0.8 : 0.3}
                  />
                  <text x="70" y="18" fill="#FFFFFF" fontSize="9">
                    {isTitlesVisible
                      ? "LowerThird_Intro.xtp"
                      : isEn
                        ? "(Track Hidden)"
                        : "(Pista Oculta)"}
                  </text>
                </g>

                {/* Pista V1: Video Principal 1080p */}
                <g transform="translate(0, 62)">
                  <rect x="5" y="0" width="40" height="36" rx="3" fill="#141B2B" stroke="#252D3A" />
                  <text x="25" y="22" textAnchor="middle" fill="#5CA8FF" fontSize="9" fontWeight="bold">V1</text>
                  <rect x="55" y="2" width="380" height="32" rx="4" fill="#1677FF" opacity="0.8" />
                  <text x="70" y="22" fill="#FFFFFF" fontSize="9">
                    {isEn
                      ? "Main_Clip_1080p60.mp4 (FFmpeg Stream)"
                      : "Clip_Principal_1080p60.mp4 (FFmpeg Stream)"}
                  </text>
                </g>

                {/* Pista A1: Audio Estéreo 48kHz */}
                <g transform="translate(0, 104)">
                  <rect x="5" y="0" width="40" height="36" rx="3" fill="#141B2B" stroke="#252D3A" />
                  <text x="25" y="22" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">A1</text>
                  <rect
                    x="55"
                    y="2"
                    width="380"
                    height="32"
                    rx="4"
                    fill={isAudioMuted ? "#252D3A" : "#059669"}
                    opacity={isAudioMuted ? 0.3 : 0.8}
                  />
                  <text x="70" y="22" fill="#FFFFFF" fontSize="9">
                    {isAudioMuted
                      ? "Audio_Master_48kHz.wav (MUTED)"
                      : isEn
                        ? "Audio_Master_48kHz.wav (Active)"
                        : "Audio_Master_48kHz.wav (Activo)"}
                  </text>
                </g>

                {/* Cabezal de reproducción (Playhead) interactivo */}
                <line x1={playheadPos} y1="0" x2={playheadPos} y2="150" stroke="#F43F5E" strokeWidth="2" />
                <polygon
                  points={`${playheadPos - 6},0 ${playheadPos + 6},0 ${playheadPos},12`}
                  fill="#F43F5E"
                />
              </svg>
            </div>

            {/* Controles de pista y scrubber interactivo */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className={`p-1.5 rounded border text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                    isAudioMuted
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "bg-[#080B12] border-[#252D3A] text-[#AFC4E8]"
                  }`}
                >
                  {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>
                    {isAudioMuted
                      ? isEn
                        ? "A1 Muted"
                        : "A1 Desactivado"
                      : isEn
                        ? "A1 Active"
                        : "A1 Activo"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTitlesVisible(!isTitlesVisible)}
                  className={`p-1.5 rounded border text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                    !isTitlesVisible
                      ? "bg-[#252D3A] border-[#252D3A] text-[#9AA5B8]"
                      : "bg-[#080B12] border-[#252D3A] text-[#AFC4E8]"
                  }`}
                >
                  {!isTitlesVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>
                    {isTitlesVisible
                      ? isEn
                        ? "T1 Visible"
                        : "T1 Visible"
                      : isEn
                        ? "T1 Hidden"
                        : "T1 Oculto"}
                  </span>
                </button>
              </div>

              {/* Slider de Playhead */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9AA5B8]">Scrubber:</span>
                <input
                  type="range"
                  min="10"
                  max="465"
                  value={playheadPos}
                  onChange={(e) => setPlayheadPos(Number(e.target.value))}
                  className="w-28 accent-purple-500 cursor-pointer"
                  aria-label={isEn ? "Timeline playhead position" : "Posición de cabezal de tiempo"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 cols): Monitor de Previsualización & Motor FFmpeg */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#252D3A] pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#9AA5B8]">
                  {isEn ? "Preview Monitor" : "Monitor de Preview"}
                </span>
                <h3 className="text-sm font-bold text-white">1080p @ 60 FPS</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                {isEn ? ".XTP PROJECT" : "PROYECTO .XTP"}
              </span>
            </div>

            {/* Simulación de Visor de Video 16:9 */}
            <div className="aspect-[16/9] rounded-lg bg-[#05080E] border border-[#252D3A] flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="text-center space-y-1 z-10">
                <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block">
                  Frame #{Math.floor((playheadPos / 470) * 1800)}
                </span>
                <span className="text-white text-xs font-light block">
                  {isTitlesVisible
                    ? isEn
                      ? "Active Title: LowerThird_Intro"
                      : "Título Activo: LowerThird_Intro"
                    : isEn
                      ? "No overlays"
                      : "Sin overlays"}
                </span>
                <span className="text-[10px] text-[#9AA5B8] block">
                  {isAudioMuted
                    ? isEn
                      ? "Audio track muted"
                      : "Pista de audio silenciada"
                    : isEn
                      ? "Normalized 48 kHz stereo channel"
                      : "Canal estéreo 48 kHz normalizado"}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#080B12]/80 border border-[#252D3A] text-[9px] text-[#5CA8FF]">
                {isEn ? "[SIMULATED PREVIEW]" : "[PREVIEW SIMULADO]"}
              </div>
            </div>

            {/* Parámetros de Render y Exportación */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9AA5B8]">
                  {isEn ? "FFmpeg Export Profile" : "Perfil de Exportación FFmpeg"}
                </span>
                <span className="text-[9px] text-purple-300">
                  {isEn ? "[CONFIG]" : "[CONFIGURACIÓN]"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["H.264", "ProRes-Proxy", "VP9"] as const).map((codec) => (
                  <button
                    key={codec}
                    type="button"
                    onClick={() => setExportCodec(codec)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer text-[11px] ${
                      exportCodec === codec
                        ? "bg-purple-600/20 border-purple-500 text-purple-300 font-semibold"
                        : "bg-[#080B12] border-[#252D3A] text-[#9AA5B8] hover:text-white"
                    }`}
                  >
                    {codec}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">{isEn ? "Render Engine" : "Motor Render"}</span>
                  <span className="text-[9px] text-[#5CA8FF] font-semibold">
                    {isEn ? "[ARCHITECTURE]" : "[ARQUITECTURA]"}
                  </span>
                </div>
                <span className="text-white font-medium block mt-1">FFmpeg 7 CLI</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Runtime Host</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">
                    {isEn ? "[DESKTOP]" : "[ESCRITORIO]"}
                  </span>
                </div>
                <span className="text-emerald-400 font-medium block mt-1">Tauri 2 (Rust)</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#080B12] border border-[#252D3A] text-[11px] text-[#AFC4E8]/80 leading-relaxed">
              <strong>{isEn ? "NLE Architecture:" : "Arquitectura NLE:"}</strong>{" "}
              {isEn
                ? "Kyvora Studio is structured as a desktop monorepo. It uses native Windows streaming without heavy web canvas frameworks or external cloud compositing dependencies."
                : "Kyvora Studio está estructurado en monorepo de escritorio. Utiliza streaming nativo sobre Windows sin frameworks de canvas web pesados ni dependencias externas de composición en la nube."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
