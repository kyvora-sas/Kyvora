"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartHandshake, ShieldCheck, ArrowRight, AlertCircle, Info } from "lucide-react";
import { wompiConfig } from "@/config/wompi";

export default function DonateSection() {
  const [selectedTarget, setSelectedTarget] = useState<string>("general");
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeTarget = wompiConfig.targets.find((t) => t.id === selectedTarget) || wompiConfig.targets[0];
  const finalAmountCOP = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const handleSelectSuggested = (amount: number) => {
    setIsCustom(false);
    setSelectedAmount(amount);
    setCustomAmount("");
    setErrorMsg(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    setCustomAmount(e.target.value.replace(/\D/g, ""));
    setErrorMsg(null);
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (finalAmountCOP < wompiConfig.minAmountCOP) {
      setErrorMsg(`El importe mínimo para realizar un aporte es de $${wompiConfig.minAmountCOP.toLocaleString("es-CO")} COP.`);
      return;
    }

    if (finalAmountCOP > wompiConfig.maxAmountCOP) {
      setErrorMsg(`El importe no puede superar $${wompiConfig.maxAmountCOP.toLocaleString("es-CO")} COP.`);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/donate/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCOP: finalAmountCOP,
          targetId: selectedTarget,
          donorName: donorName.trim() || undefined,
          donorEmail: donorEmail.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No fue posible inicializar la pasarela de pago.");
      }

      if (data.checkoutUrl) {
        // Redirigir al Checkout Web oficial de Wompi firmado por nuestro servidor
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No se recibió la URL de redirección segura de Wompi.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al conectar con la pasarela de pago.";
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="py-24 md:py-36 bg-surface/30 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] mb-3">
              <HeartHandshake className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Mecenazgo & Aportes Voluntarios</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Donate Us · Apoya el Laboratorio
            </h2>
          </div>
          <p className="text-foreground-muted text-base max-w-md font-light">
            Impulsa el desarrollo de herramientas abiertas, sensores IoT y proyectos experimentales concebidos en Colombia.
          </p>
        </div>

        {/* Contribution Interface Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-surface border border-white/10 p-6 sm:p-10 md:p-12 shadow-2xl shadow-black/80 space-y-10">
          {/* Step 1: Destination Selection */}
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-widest text-foreground-muted flex items-center justify-between">
              <span>1. Selecciona el destino de tu aporte</span>
              <span className="text-[var(--color-accent-cyan)] text-[11px] lowercase">transparente y verificable</span>
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {wompiConfig.targets.map((target) => {
                const isSelected = selectedTarget === target.id;
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => setSelectedTarget(target.id)}
                    className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isSelected
                        ? "bg-background border-[var(--color-accent)] shadow-md shadow-blue-900/30 ring-1 ring-[var(--color-accent)]"
                        : "bg-surface/50 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{target.title}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)]" />}
                    </div>
                    <p className="text-xs text-foreground-muted font-light leading-relaxed">
                      {target.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Amount Selection (Suggested + Custom) */}
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
              2. Elige o ingresa el importe (en Pesos Colombianos - COP)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {wompiConfig.suggestedAmounts.map((opt) => {
                const isSelected = !isCustom && selectedAmount === opt.amountCOP;
                return (
                  <button
                    key={opt.amountCOP}
                    type="button"
                    onClick={() => handleSelectSuggested(opt.amountCOP)}
                    className={`py-3.5 px-4 rounded-xl text-center border font-mono font-bold text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isSelected
                        ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-lg shadow-blue-600/30"
                        : "bg-background/80 text-foreground-muted border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {opt.popular && (
                      <span className="block text-[10px] uppercase tracking-widest text-cyan-300 font-sans mt-0.5 font-normal">
                        Sugerido
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="mt-3">
              <div
                className={`flex items-center gap-3 p-3.5 rounded-xl border bg-background/80 transition-colors ${
                  isCustom ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]" : "border-white/10"
                }`}
              >
                <span className="text-foreground-muted font-mono text-sm px-2">Otro Importe COP:</span>
                <input
                  type="text"
                  placeholder="Ej: 30000"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="bg-transparent text-white font-mono text-base outline-none w-full"
                  aria-label="Importe personalizado en COP"
                />
                <span className="text-xs font-mono text-foreground-muted shrink-0 pr-2">Mínimo: $10.000 COP</span>
              </div>
            </div>
          </div>

          {/* Step 3: Optional Donor Information */}
          <div className="space-y-4 pt-2">
            <label className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
              3. Datos del Aportante (Opcional)
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre o seudónimo (Opcional)"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="bg-background/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-foreground-muted/50 focus:border-[var(--color-accent)] focus:outline-none"
              />
              <input
                type="email"
                placeholder="Correo electrónico para comprobante (Opcional)"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="bg-background/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-foreground-muted/50 focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>

          {/* Step 4: Summary Box before Payment */}
          <div className="p-5 rounded-2xl bg-background/90 border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
              <span className="text-foreground-muted">Total Aporte Voluntario:</span>
              <span className="text-white font-bold text-base text-[var(--color-accent-cyan)]">
                ${finalAmountCOP > 0 ? finalAmountCOP.toLocaleString("es-CO") : "0"} COP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Destino Asignado:</span>
              <span className="text-white text-right font-sans font-medium">{activeTarget.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Pasarela de Procesamiento:</span>
              <span className="text-white flex items-center gap-1.5 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wompi Colombia (Bancolombia)</span>
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Trigger */}
          <div className="space-y-4">
            <button
              onClick={handleProceedToPayment}
              disabled={loading || finalAmountCOP < wompiConfig.minAmountCOP}
              className="w-full py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{loading ? "Generando transacción segura con Wompi..." : "Continuar al Pago con Wompi"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Legal Notice */}
            <div className="p-4 rounded-xl bg-surface/40 border border-white/5 space-y-2 text-[11px] text-foreground-muted/80 leading-relaxed font-light">
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-foreground-muted shrink-0 mt-0.5" />
                <p>
                  <strong>Aviso legal:</strong> Los aportes son transferencias voluntarias a una persona natural independiente en Colombia para el sostenimiento de sus proyectos tecnológicos y código abierto. <strong>No constituyen donaciones a entidades sin ánimo de lucro (ESAL)</strong> ni otorgan deducciones del impuesto sobre la renta. Consulta las{" "}
                  <Link href="/legal/donate" className="text-[var(--color-accent-cyan)] underline">
                    Condiciones Legales de Donate Us
                  </Link>{" "}
                  y nuestra{" "}
                  <Link href="/legal/pagos-reversiones" className="text-[var(--color-accent-cyan)] underline">
                    Política de Pagos y Reversiones
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
