"use client";

import Link from "next/link";
import { Check, ArrowRight, Info } from "lucide-react";
import { pricingConfig } from "@/config/pricing";

export default function PricingSection() {
  return (
    <section id="precios" className="py-24 md:py-36 bg-surface/40 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              <span>Transparencia Comercial</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Precios & Cotizaciones
            </h2>
          </div>
          <p className="text-foreground-muted text-base max-w-md font-light">
            Modelo mixto: tarifas estandarizadas para alcances acotados y cotizaciones individuales según la arquitectura requerida.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {pricingConfig.tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 ${
                tier.category === "alcance-variable"
                  ? "bg-surface border-2 border-[var(--color-accent)]/60 shadow-2xl shadow-blue-900/20 relative"
                  : "bg-surface/70 border border-white/10 hover:border-white/20"
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[var(--color-accent-cyan)]">
                    {tier.badge}
                  </span>
                  <span className="text-xs text-foreground-muted font-mono">
                    {tier.deliveryTimeEstimated}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-sm text-foreground-muted font-light leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="py-4 border-y border-white/5 space-y-1">
                  {tier.startingPriceCOP ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        ${tier.startingPriceCOP.toLocaleString("es-CO")}
                      </span>
                      <span className="text-xs font-mono text-foreground-muted">COP</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-white font-mono">
                      A Cotizar
                    </div>
                  )}
                  <p className="text-xs text-foreground-muted/80">{tier.priceNote}</p>
                </div>

                {/* Deliverables */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white">
                    Entregables incluidos:
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-foreground/85 font-light">
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <Link
                  href="#contacto"
                  className={`w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    tier.category === "alcance-variable"
                      ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Scope Factors Explanation Box */}
        <div className="mt-16 p-8 rounded-2xl bg-surface/50 border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-[var(--color-accent-cyan)] shrink-0" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Factores que determinan el costo en proyectos personalizados
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs md:text-sm">
            {pricingConfig.scopeFactorsExplanation.map((factor, idx) => (
              <div key={idx} className="space-y-2 p-4 rounded-xl bg-background/50 border border-white/5">
                <h4 className="font-semibold text-white">{factor.title}</h4>
                <p className="text-foreground-muted font-light leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-foreground-muted/70 italic border-t border-white/5 pt-4">
            * {pricingConfig.disclaimer} Consulta nuestras{" "}
            <Link href="/legal/contratacion" className="text-[var(--color-accent-cyan)] underline">
              Condiciones de Contratación
            </Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
