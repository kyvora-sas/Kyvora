"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Zap, Shield, Send, Wifi, AlertCircle } from "lucide-react";

interface CommunityChannel {
  id: string;
  name: string;
  topic: string;
  activeClients: number;
  payloadAvgBytes: number;
}

const CHANNELS: CommunityChannel[] = [
  {
    id: "general",
    name: "#general-latam",
    topic: "Intercambio técnico y pruebas comunitarias de latencia",
    activeClients: 142,
    payloadAvgBytes: 68,
  },
  {
    id: "dev",
    name: "#flutter-realtime",
    topic: "Optimización de frames e hilos en cliente móvil Flutter",
    activeClients: 86,
    payloadAvgBytes: 52,
  },
  {
    id: "infra",
    name: "#websockets-perf",
    topic: "Benchmarking de concurrencia y pools de conexión PostgreSQL",
    activeClients: 64,
    payloadAvgBytes: 94,
  },
];

const INITIAL_MESSAGES: Record<string, Array<{ id: string; user: string; text: string; time: string; latency: number }>> = {
  general: [
    { id: "g1", user: "dev_alex", text: "Verificando sincronización de sockets en cliente Flutter...", time: "20:41:02", latency: 16 },
    { id: "g2", user: "kyv_node", text: "PostgreSQL persistió el mensaje con commit ACID.", time: "20:41:04", latency: 14 },
  ],
  dev: [
    { id: "d1", user: "mobile_lead", text: "Frame rate estable a 60 FPS en Android con stream provider.", time: "20:39:15", latency: 18 },
    { id: "d2", user: "flutter_fan", text: "Consumo de RAM del socket client reducido a 22 MB.", time: "20:40:01", latency: 12 },
  ],
  infra: [
    { id: "i1", user: "sys_ops", text: "Prueba de carga: 1.000 clientes simulados sobre WSS Gateway.", time: "20:35:10", latency: 14 },
    { id: "i2", user: "db_audit", text: "Índice B-Tree en messages(created_at) respondió en 2.4 ms.", time: "20:36:22", latency: 15 },
  ],
};

export default function PulsoConsole() {
  const [selectedChannel, setSelectedChannel] = useState<CommunityChannel>(CHANNELS[0]);
  const [channelMessages, setChannelMessages] = useState(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState("");
  const ackTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (ackTimerRef.current) clearTimeout(ackTimerRef.current);
    };
  }, []);

  const currentMessages = channelMessages[selectedChannel.id] || [];

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const nowTime = new Date().toTimeString().split(" ")[0];
    const userMsg = {
      id: String(Date.now()),
      user: "invitado_lab",
      text: userText,
      time: nowTime,
      latency: Math.floor(12 + Math.random() * 8),
    };

    setChannelMessages((prev) => ({
      ...prev,
      [selectedChannel.id]: [...(prev[selectedChannel.id] || []).slice(-4), userMsg],
    }));
    setInputMsg("");

    // Respuesta simulada de confirmación del gateway WebSocket
    if (ackTimerRef.current) clearTimeout(ackTimerRef.current);
    ackTimerRef.current = setTimeout(() => {
      const ackMsg = {
        id: String(Date.now() + 1),
        user: "pulso_wss",
        text: `Ack broadcast: paquete de ${userText.length * 2}B retransmitido a ${selectedChannel.activeClients} pares.`,
        time: new Date().toTimeString().split(" ")[0],
        latency: 14,
      };
      setChannelMessages((prev) => ({
        ...prev,
        [selectedChannel.id]: [...(prev[selectedChannel.id] || []).slice(-4), ackMsg],
      }));
    }, 450);
  };

  return (
    <div className="w-full rounded-2xl bg-[#080B12] border border-[#252D3A] overflow-hidden flex flex-col">
      {/* 1. Header de Telemetría HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0D121D] border-b border-[#252D3A] text-xs font-mono">
        <div className="flex items-center gap-2.5 text-[#AFC4E8]">
          <span className="p-1 rounded bg-[#141B2B] text-[#2B85FF] border border-[#252D3A]">
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span className="text-white font-semibold tracking-wider">LAB-02 // PULSO</span>
          <span className="text-[#252D3A]">|</span>
          <span className="text-[#9AA5B8] uppercase">Red Social & Mensajería de Baja Latencia</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-[#1677FF]/15 border-[#2B85FF]/40 text-[#5CA8FF]">
            FASE BETA
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border bg-[#141B2B] border-[#252D3A] text-[#AFC4E8]">
            NEXT.JS + FLUTTER + PG
          </span>
        </div>
      </div>

      {/* 2. Cuerpo Principal de la Consola: Arquitectura de Streaming & Chat Interactivo */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (7 cols): Arquitectura de Flujo & Simulador de Mensajes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#AFC4E8] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
              <span>Flujo de Datos en Tiempo Real (WebSockets WSS)</span>
            </span>
            <span className="text-[10px] font-mono text-[#9AA5B8]">
              [SIMULACIÓN VISUAL · AMBIENTE DE PRUEBAS]
            </span>
          </div>

          {/* Esquema SVG de Arquitectura de Pulso */}
          <div className="relative rounded-xl bg-[#0D121D] border border-[#252D3A] p-4 overflow-hidden">
            <svg
              viewBox="0 0 520 130"
              className="w-full h-auto select-none"
              aria-label="Esquema arquitectónico de Pulso conectando Flutter, WebSockets y PostgreSQL"
            >
              <defs>
                <linearGradient id="pulso-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1677FF" />
                  <stop offset="50%" stopColor="#2B85FF" />
                  <stop offset="100%" stopColor="#5CA8FF" />
                </linearGradient>
              </defs>

              {/* Caja 1: Clientes (Flutter / Next.js) */}
              <g transform="translate(15, 20)">
                <rect width="130" height="90" rx="8" fill="#080B12" stroke="#252D3A" strokeWidth="1.2" />
                <text x="65" y="32" textAnchor="middle" fill="#9AA5B8" fontSize="10" fontFamily="monospace">
                  CLIENTES
                </text>
                <text x="65" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Flutter / Web
                </text>
                <rect x="25" y="65" width="80" height="18" rx="4" fill="#141B2B" stroke="#252D3A" />
                <text x="65" y="77" textAnchor="middle" fill="#5CA8FF" fontSize="9" fontFamily="monospace">
                  Low Data Mode
                </text>
              </g>

              {/* Flecha 1 a 2 */}
              <line x1="145" y1="65" x2="195" y2="65" stroke="url(#pulso-line)" strokeWidth="1.5" />
              <polygon points="195,65 188,61 188,69" fill="#2B85FF" />
              <text x="170" y="58" textAnchor="middle" fill="#9AA5B8" fontSize="8" fontFamily="monospace">
                WSS
              </text>

              {/* Caja 2: Gateway WebSockets */}
              <g transform="translate(195, 20)">
                <rect width="130" height="90" rx="8" fill="#080B12" stroke="#2B85FF" strokeWidth="1.2" />
                <text x="65" y="32" textAnchor="middle" fill="#5CA8FF" fontSize="10" fontFamily="monospace">
                  GATEWAY WS
                </text>
                <text x="65" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Sala Concurrente
                </text>
                <rect x="25" y="65" width="80" height="18" rx="4" fill="#1677FF" opacity="0.2" />
                <text x="65" y="77" textAnchor="middle" fill="#2B85FF" fontSize="9" fontFamily="monospace">
                  Pub/Sub Router
                </text>
              </g>

              {/* Flecha 2 a 3 */}
              <line x1="325" y1="65" x2="375" y2="65" stroke="url(#pulso-line)" strokeWidth="1.5" />
              <polygon points="375,65 368,61 368,69" fill="#5CA8FF" />
              <text x="350" y="58" textAnchor="middle" fill="#9AA5B8" fontSize="8" fontFamily="monospace">
                ACID
              </text>

              {/* Caja 3: Base de Datos Relacional */}
              <g transform="translate(375, 20)">
                <rect width="130" height="90" rx="8" fill="#080B12" stroke="#252D3A" strokeWidth="1.2" />
                <text x="65" y="32" textAnchor="middle" fill="#9AA5B8" fontSize="10" fontFamily="monospace">
                  PERSISTENCIA
                </text>
                <text x="65" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  PostgreSQL
                </text>
                <rect x="25" y="65" width="80" height="18" rx="4" fill="#141B2B" stroke="#252D3A" />
                <text x="65" y="77" textAnchor="middle" fill="#AFC4E8" fontSize="9" fontFamily="monospace">
                  Índices B-Tree
                </text>
              </g>
            </svg>
          </div>

          {/* Consola Interactiva de Mensajería de Prueba */}
          <div className="rounded-xl bg-[#0D121D] border border-[#252D3A] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9AA5B8] flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#5CA8FF]" aria-hidden="true" />
                <span>Canal Activo: {selectedChannel.name}</span>
              </span>
              <span className="text-[10px] text-[#5CA8FF] font-mono">
                {selectedChannel.activeClients} pares [SIMULACIÓN]
              </span>
            </div>

            <div className="h-32 bg-[#080B12] rounded border border-[#252D3A]/60 p-2.5 overflow-y-auto space-y-1.5 font-mono text-xs">
              {currentMessages.map((m) => (
                <div key={m.id} className="flex items-start justify-between gap-2 text-[11px] leading-tight">
                  <div>
                    <span className="text-[#5CA8FF] font-semibold">@{m.user}: </span>
                    <span className="text-white">{m.text}</span>
                  </div>
                  <span className="text-[#9AA5B8] shrink-0 text-[10px]">
                    {m.time} ({m.latency}ms)
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendTestMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Escribe un mensaje de prueba al canal..."
                className="flex-1 bg-[#080B12] border border-[#252D3A] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#9AA5B8]/60 focus:outline-none focus:border-[#2B85FF] font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#1677FF] hover:bg-[#2B85FF] text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF]"
              >
                <Send className="w-3 h-3" aria-hidden="true" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Columna Derecha (5 cols): Selector de Canales & Parámetros */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#0D121D] border border-[#252D3A] space-y-4">
            <div className="flex items-center justify-between border-b border-[#252D3A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#9AA5B8]">Canal Comunitario</span>
                <h3 className="text-sm font-bold text-white font-mono">{selectedChannel.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#141B2B] text-[#5CA8FF] border border-[#252D3A]">
                SUB-BETA
              </span>
            </div>

            {/* Selector de Canales */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#9AA5B8] block">Seleccionar Sala de Chat</span>
              <div className="grid grid-cols-1 gap-1.5">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedChannel(ch)}
                    className={`w-full text-left p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer flex items-center justify-between ${
                      selectedChannel.id === ch.id
                        ? "bg-[#141B2B] border-[#2B85FF] text-white"
                        : "bg-[#080B12] border-[#252D3A] text-[#9AA5B8] hover:text-white"
                    }`}
                  >
                    <span>{ch.name}</span>
                    <span className="text-[10px] text-[#5CA8FF]">{ch.activeClients} pares</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">RTT Objetivo</span>
                  <span className="text-[9px] text-[#5CA8FF] font-semibold">[OBJETIVO]</span>
                </div>
                <span className="text-white font-medium block mt-1">~14 ms</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Payload Avg</span>
                  <span className="text-[9px] text-[#5CA8FF] font-semibold">[FORMATO]</span>
                </div>
                <span className="text-white font-medium block mt-1">{selectedChannel.payloadAvgBytes} B / msg</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Concurrencia</span>
                  <span className="text-[9px] text-amber-300 font-semibold">[SIMULACIÓN]</span>
                </div>
                <span className="text-white font-medium block mt-1">{selectedChannel.activeClients} clientes</span>
              </div>
              <div className="p-2.5 rounded bg-[#080B12] border border-[#252D3A]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9AA5B8]">Persistencia</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">[ARQUITECTURA]</span>
                </div>
                <span className="text-white font-medium block mt-1">PostgreSQL</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#080B12] border border-[#252D3A] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9AA5B8] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>Seguridad de Conexión</span>
                </span>
                <span className="text-emerald-400">TLS WSS + JWT</span>
              </div>
              <div className="text-[11px] text-[#AFC4E8]/80 leading-relaxed">
                Mensajería cifrada en tránsito con verificación de tokens de sesión y desacoplamiento de subscripciones por sala.
              </div>
            </div>
          </div>

          {/* Nota de Alcance Comunitario */}
          <div className="p-3.5 rounded-xl bg-[#141B2B] border border-[#252D3A] text-xs font-mono flex items-start gap-2.5 text-[#AFC4E8]">
            <AlertCircle className="w-4 h-4 text-[#5CA8FF] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed text-[11px]">
              <strong>Enfoque Comunitario:</strong> Pulso es una red social orientada a comunicación instantánea de baja latencia. No procesa signos vitales, telemetría cardíaca ni datos biomédicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
