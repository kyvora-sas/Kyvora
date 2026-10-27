"use client";

import { Search, FileCode2, CheckSquare, Code2, ShieldAlert, LifeBuoy } from "lucide-react";

const processSteps = [
  {
    num: "01",
    icon: Search,
    title: "Descubrimiento",
    desc: "Analizamos tu objetivo comercial o técnico, identificamos los cuellos de botella y evaluamos la viabilidad real de la solución.",
  },
  {
    num: "02",
    icon: FileCode2,
    title: "Definición del Alcance",
    desc: "Redactamos una especificación clara: pantallas, flujos de usuario, integraciones de terceros y arquitectura de software requerida.",
  },
  {
    num: "03",
    icon: CheckSquare,
    title: "Cotización y Acuerdo",
    desc: "Presentamos una propuesta transparente con costos, plazos por hitos y condiciones contractuales formales aceptadas por ambas partes.",
  },
  {
    num: "04",
    icon: Code2,
    title: "Diseño & Desarrollo",
    desc: "Implementamos la solución mediante código limpio, diseño responsive y revisiones periódicas para verificar avances de forma tangible.",
  },
  {
    num: "05",
    icon: ShieldAlert,
    title: "Pruebas & Entrega",
    desc: "Ejecutamos pruebas de rendimiento, seguridad y responsividad en múltiples dispositivos antes del despliegue final en producción.",
  },
  {
    num: "06",
    icon: LifeBuoy,
    title: "Soporte & Garantía",
    desc: "Acompañamos el lanzamiento con garantía técnica sobre el código entregado y opciones de mantenimiento continuo según lo pactado.",
  },
];

export default function ProcessSection() {
  return (
    <section id="proceso" className="py-24 md:py-36 bg-background border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              <span>Metodología de Trabajo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Proceso de Entrega
            </h2>
          </div>
          <p className="text-foreground-muted text-base max-w-md font-light">
            Un flujo claro desde el primer contacto hasta el soporte en producción. Cada proyecto cuenta con acuerdos específicos de plazos y entregables.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 md:p-8 rounded-2xl bg-surface/60 border border-white/10 hover:border-[var(--color-accent)]/40 transition-all duration-300 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-accent-cyan)] px-2.5 py-1 rounded bg-white/5 border border-white/5">
                    Fase {step.num}
                  </span>
                  <Icon className="w-5 h-5 text-foreground-muted group-hover:text-[var(--color-accent-cyan)] transition-colors" />
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-foreground-muted font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Advisory Note */}
        <div className="mt-12 text-center text-xs text-foreground-muted/70 font-mono">
          * Los plazos de desarrollo y condiciones técnicas particulares se formalizan individualmente en cada propuesta o contrato de servicios.
        </div>
      </div>
    </section>
  );
}
