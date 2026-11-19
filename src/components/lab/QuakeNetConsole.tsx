"use client";

import { useState, useRef, useEffect } from "react";
import { Activity, Radio, MapPin, Database, RefreshCw, AlertCircle } from "lucide-react";
import { useReducedMotion } from "framer-motion";

interface StationNode {
  id: string;
  name: string;
  code: string;
  lat: string;
  lng: string;
  depthKm: number;
  status: "CALIBRATING" | "LISTENING" | "SYNCED";
  packetsRx: number;
  lastPingMs: number;
}

const STATIONS: StationNode[] = [
  {
    id: "bog",
    name: "Estación Piloto Bogotá",
    code: "NODE-BOG-01",
    lat: "4.7110° N",
    lng: "74.0721° W",
    depthKm: 12.4,
    status: "SYNCED",
    packetsRx: 1420,
    lastPingMs: 38,
  },
  {
    id: "cali",
    name: "Estación Piloto Cali",
    code: "NODE-CLO-02",
    lat: "3.4516° N",
    lng: "76.5320° W",
    depthKm: 18.2,
    status: "LISTENING",
    packetsRx: 980,
    lastPingMs: 44,
  },
  {
    id: "med",
    name: "Estación Piloto Medellín",
    code: "NODE-MDE-03",
    lat: "6.2442° N",
    lng: "75.5812° W",
    depthKm: 15.0,
    status: "CALIBRATING",
    packetsRx: 610,
    lastPingMs: 52,
  },
];

export default function QuakeNetConsole() {
  const prefersReduced = useReducedMotion();
  const [selectedStation, setSelectedStation] = useState<StationNode>(STATIONS[0]);
  const [isPerturbationActive, setIsPerturbationActive] = useState<boolean>(false);
  const perturbationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (perturbationTimerRef.current) {
        clearTimeout(perturbationTimerRef.current);
      }
    };
  }, []);

  const triggerTestPerturbation = () => {
    if (isPerturbationActive) return;
    setIsPerturbationActive(true);
    if (perturbationTimerRef.current) clearTimeout(perturbationTimerRef.current);
    perturbationTimerRef.current = setTimeout(() => {
      setIsPerturbationActive(false);
    }, 2400);
  };

  return (
    <div className="w-full rounded-2xl bg-[#080B12] border border-[#252D3A] overflow-hidden flex flex-col">
      {/* 1. Header de Telemetría HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0D121D] border-b border-[#252D3A] text-xs font-mono">
        <div className="flex items-center gap-2.5 text-[#AFC4E8]">
          <span className="p-1 rounded bg-[#141B2B] text-[#5CA8FF] border border-[#252D3A]">
            <Radio className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span className="text-white font-semibold tracking-wider">LAB-01 // QUAKENET</span>
          <span className="text-[#252D3A]">|</span>
          <span className="text-[#9AA5B8] uppercase">Supabase + PostGIS + WebSockets</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-amber-500/10 border-amber-500/30 text-amber-300">
            PROTOTIPO EXPERIMENTAL
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border bg-[#141B2B] border-[#252D3A] text-[#AFC4E8]">
            IoT MICRO-SENSORES
          </span>
        </div>
      </div>

      {/* 2. Cuerpo Principal de la Consola: Topología Geoespacial & Oscilograma */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (7 cols): Mapa Vectorial de Red & Trazador */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#AFC4E8] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
              <span>Topología de Red Sísmica (PostGIS Nodes)</span>
            </span>
            <span className="text-[10px] font-mono text-[#9AA5B8]">
              [SIMULACIÓN VISUAL · DATOS DE LABORATORIO]
            </span>
          </div>

          {/* Gráfico SVG de Topología Nodal */}
          <div className="relative rounded-xl bg-[#0D121D] border border-[#252D3A] p-4 overflow-hidden">
            <svg
              viewBox="0 0 520 220"
              className="w-full h-auto select-none"
              aria-label="Mapa esquemático de estaciones QuakeNet con coordenadas PostGIS"
            >
              {/* Cuadrícula de coordenadas geoespaciales PostGIS */}
              <defs>
                <pattern id="quake-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37, 45, 58, 0.45)" strokeWidth="0.75" />
                </pattern>
                <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1677FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1677FF" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="520" height="220" fill="url(#quake-grid)" />

              {/* Hub Central Supabase / PostGIS */}
              <circle cx="260" cy="110" r="32" fill="url(#hub-glow)" />
              <circle cx="260" cy="110" r="6" fill="#1677FF" />
              <text x="260" y="132" textAnchor="middle" fill="#5CA8FF" fontSize="9" fontFamily="monospace">
                POSTGIS HUB
              </text>

              {/* Conexiones de WebSocket hacia los nodos */}
              <line x1="260" y1="110" x2="110" y2="70" stroke="#252D3A" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="260" y1="110" x2="140" y2="170" stroke="#252D3A" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="260" y1="110" x2="410" y2="90" stroke="#252D3A" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Nodo Bogotá (110, 70) */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedStation(STATIONS[0])}
                tabIndex={0}
                role="button"
                aria-label="NODE-BOG: Estación Bogotá"
                onKeyDown={(e) => e.key === "Enter" && setSelectedStation(STATIONS[0])}
              >
                <circle
                  cx="110"
                  cy="70"
                  r={selectedStation.id === "bog" ? "9" : "6"}
                  fill={selectedStation.id === "bog" ? "#2B85FF" : "#141B2B"}
                  stroke="#2B85FF"
                  strokeWidth="1.5"
                />
                <text x="110" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
                  NODE-BOG
                </text>
              </g>

              {/* Nodo Cali (140, 170) */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedStation(STATIONS[1])}
                tabIndex={0}
                role="button"
                aria-label="NODE-CLO: Estación Cali"
                onKeyDown={(e) => e.key === "Enter" && setSelectedStation(STATIONS[1])}
              >
                <circle
                  cx="140"
                  cy="170"
                  r={selectedStation.id === "cali" ? "9" : "6"}
                  fill={selectedStation.id === "cali" ? "#2B85FF" : "#141B2B"}
                  stroke="#2B85FF"
                  strokeWidth="1.5"
                />
                <text x="140" y="195" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
                  NODE-CLO
                </text>
              </g>

              {/* Nodo Medellín (410, 90) */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedStation(STATIONS[2])}
                tabIndex={0}
                role="button"
                aria-label="NODE-MDE: Estación Medellín"
                onKeyDown={(e) => e.key === "Enter" && setSelectedStation(STATIONS[2])}
              >
                <circle
                  cx="410"
                  cy="90"
                  r={selectedStation.id === "med" ? "9" : "6"}
                  fill={selectedStation.id === "med" ? "#2B85FF" : "#141B2B"}
                  stroke="#2B85FF"
                  strokeWidth="1.5"
                />
                <text x="410" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
                  NODE-MDE
                </text>
              </g>

              {/* Onda sísmica de prueba animada cuando se activa perturbación */}
              {isPerturbationActive && !prefersReduced && (
                <circle
                  cx="260"
                  cy="110"
                  r="75"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  className="animate-ping opacity-75"
                />
              )}
            </svg>
          </div>

          {/* Oscilograma Vectorial de Señal Sísmica */}
          <div className="rounded-xl bg-[#0D121D] border border-[#252D3A] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5B8] flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#5CA8FF]" aria-hidden="true" />
                <span>Canal Z (Acelerómetro MPU-6050 Simulado)</span>
              </span>
              <span className="text-[10px] text-[#5CA8FF] font-mono">
                {isPerturbationActive ? "TEST SIGNAL DETECTED" : "BASELINE STABLE"}
              </span>
            </div>

            <div className="h-16 w-full bg-[#080B12] rounded border border-[#252D3A]/60 flex items-center px-3 overflow-hidden">
              <svg viewBox="0 0 500 50" className="w-full h-10 select-none">
                <path
                  d={
                    isPerturbationActive
                      ? "M 0 25 Q 40 25, 80 25 T 140 25 Q 160 5, 175 45 T 195 10 T 215 38 T 235 15 T 255 35 T 285 25 L 500 25"
                      : "M 0 25 Q 25 24, 50 25 T 100 25 T 150 26 T 200 24 T 250 25 T 300 25 T 350 26 T 400 25 T 450 25 L 500 25"
                  }
                  fill="none"
                  stroke={isPerturbationActive ? "#F59E0B" : "#2B85FF"}
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 cols): Detalle del Nodo PostGIS & Parámetros */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-4">
            <div className="flex items-center justify-between border-b border-[#252D3A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#9AA5B8]">Estación Seleccionada</span>
                <h3 className="text-sm font-bold text-white font-mono">{selectedStation.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#141B2B] text-[#5CA8FF] border border-[#252D3A]">
                {selectedStation.code}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Latitud</span>
                  <span className="text-[9px] text-[#5CA8FF] font-semibold">[CONFIG]</span>
                </div>
                <span className="text-white font-medium block mt-1">{selectedStation.lat}</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Longitud</span>
                  <span className="text-[9px] text-[#5CA8FF] font-semibold">[CONFIG]</span>
                </div>
                <span className="text-white font-medium block mt-1">{selectedStation.lng}</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Profundidad</span>
                  <span className="text-[9px] text-amber-300 font-semibold">[CALIBRACIÓN]</span>
                </div>
                <span className="text-white font-medium block mt-1">{selectedStation.depthKm} km</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Telemetría Rx</span>
                  <span className="text-[9px] text-[#AFC4E8] font-semibold">[SIMULACIÓN]</span>
                </div>
                <span className="text-[#5CA8FF] font-medium block mt-1">{selectedStation.packetsRx} pkts ({selectedStation.lastPingMs} ms)</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#080B12] border border-[#252D3A] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9AA5B8] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
                  <span>Capa Espacial</span>
                </span>
                <span className="text-white">PostGIS ST_Point</span>
              </div>
              <div className="text-[11px] text-[#AFC4E8]/80 leading-relaxed">
                Almacenamiento relacional en Supabase con índices espaciales GiST para cálculo de distancias euclidianas entre estaciones.
              </div>
            </div>

            <button
              type="button"
              onClick={triggerTestPerturbation}
              disabled={isPerturbationActive}
              className="w-full py-2.5 px-3 rounded-lg bg-[#141B2B] hover:bg-[#1C263B] text-white border border-[#252D3A] hover:border-[#2B85FF]/60 text-xs font-mono tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#5CA8FF] ${isPerturbationActive ? "animate-spin" : ""}`} aria-hidden="true" />
              <span>{isPerturbationActive ? "Transmitiendo perturbación..." : "Simular Perturbación de Prueba"}</span>
            </button>
          </div>

          {/* Nota de Honestidad Técnica */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs font-mono flex items-start gap-2.5 text-amber-200/90">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed text-[11px]">
              <strong>Aclaración Técnica:</strong> QuakeNet es un proyecto de investigación en hardware IoT y bases de datos espaciales. No reemplaza a las redes sismológicas oficiales ni emite alertas tempranas certificadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
