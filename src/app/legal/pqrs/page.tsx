"use client";

import { useState } from "react";
import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { ArrowRight, CheckCircle2, AlertCircle, Clock, ShieldCheck, Printer } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PqrsPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [applicantInfo, setApplicantInfo] = useState<{ nombre: string; email: string; tipo: string; motivo: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const tipo = (formData.get("tipo") as string) || (isEn ? "Petition" : "Petición");
    const nombre = (formData.get("nombre") as string) || "";
    const email = (formData.get("email") as string) || "";
    const documento = (formData.get("documento") as string) || "";
    const motivo = (formData.get("motivo") as string) || "";
    const descripcion = (formData.get("descripcion") as string) || "";
    const aceptaPolitica = formData.get("aceptaPolitica") === "on";
    const website_hp = (formData.get("website_hp") as string) || ""; // Honeypot

    if (!aceptaPolitica) {
      setStatus("error");
      setErrorMessage(
        isEn
          ? "You must expressly authorize personal data processing to lodge a PQRS claim."
          : "Debes autorizar expresamente el tratamiento de tus datos personales para radicar la PQRS."
      );
      return;
    }

    try {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const generatedTicket = `PQRS-KYV-${dateStr}-${randomSuffix}`;
      const formattedSubmissionDate = now.toLocaleString(isEn ? "en-US" : "es-CO", {
        timeZone: "America/Bogota",
        dateStyle: "full",
        timeStyle: "short",
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: `${nombre} [Doc: ${documento || "No informado"}]`,
          email,
          tipoProyecto: `PQRS OFICIAL [${tipo}] - Radicado ${generatedTicket}`,
          descripcion: `Radicado Oficial: ${generatedTicket}\nFecha de Radicación: ${formattedSubmissionDate}\nTipo de Trámite: ${tipo}\nAsunto / Motivo: ${motivo}\n\nDetalle de los hechos y pretensiones:\n${descripcion}`,
          presupuesto: `PQRS Código: ${generatedTicket}`,
          website_hp,
          aceptaPolitica: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (isEn
              ? "Unable to submit claim at this moment. Please try again later."
              : "No fue posible radicar la solicitud en este momento. Por favor intente más tarde.")
        );
      }

      setTicketId(generatedTicket);
      setSubmissionDate(formattedSubmissionDate);
      setApplicantInfo({ nombre, email, tipo, motivo });
      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isEn
          ? "Error submitting claim."
          : "Error al radicar la solicitud.";
      setStatus("error");
      setErrorMessage(msg);
    }
  };

  const handlePrintVoucher = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isEn) {
    return (
      <LegalLayout
        title="Official Claims & PQRS Channel"
        subtitle="Centralized operational system for lodging, tracking, and managing formal Petitions, Complaints, Claims (PQRS), and Payment Reversals in Colombia."
        lastUpdated="October 27, 2026"
        normativeBase="Law 1755 of 2015, Law 1480 of 2011, Law 2439 of 2024 & Decree 587 of 2016"
      >
        {/* 1. Operational Framework and Statutory Deadlines */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Operational Framework and Statutory Response Deadlines</h2>
          <p>
            In strict compliance with the constitutional right of petition (Article 23 of the Colombian Constitution and <strong>Statutory Law 1755 of 2015</strong>), the Consumer Protection Statute (<strong>Law 1480 of 2011</strong>), and <strong>Law 2439 of 2024</strong> on electronic commerce, <strong>{legalConfig.brandName}</strong> provides this centralized channel to guarantee traceable, accountable, and timely responses to all submissions.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-sm mt-4 font-light">
            <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-[var(--color-accent-cyan)] font-mono text-xs uppercase font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Petitions &amp; Inquiries</span>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Requests for technical information, service clarifications, or Habeas Data consultations.
              </p>
              <div className="text-white font-medium text-xs pt-1 border-t border-white/5">
                Statutory Term: Up to 10 business days
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Complaints &amp; Claims</span>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Dissatisfaction with support channels, software deliverable defects, or data suppression requests.
              </p>
              <div className="text-white font-medium text-xs pt-1 border-t border-white/5">
                Statutory Term: Up to 15 business days
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Payment Reversals</span>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Claims concerning fraud, unrequested debits, non-delivery, or defective software (Decree 587/2016).
              </p>
              <div className="text-white font-medium text-xs pt-1 border-t border-white/5">
                Notice within 5 days; 15 days resolution
              </div>
            </div>
          </div>
        </section>

        {/* 2. Online Filing Module */}
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Official Online Filing Module</h2>

          {status === "success" ? (
            <div className="p-8 bg-surface border border-emerald-500/30 rounded-2xl space-y-5">
              <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl">
                <CheckCircle2 className="w-7 h-7 shrink-0" />
                <span>Official PQRS Filing Certificate</span>
              </div>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Your request has been successfully recorded in our legal tracking system with the following details:
              </p>

              <div className="bg-background/90 p-5 rounded-xl border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-foreground-muted">Official Filing Code:</span>
                  <span className="text-[var(--color-accent-cyan)] font-bold text-sm">{ticketId}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-foreground-muted">Filing Date &amp; Time:</span>
                  <span className="text-white">{submissionDate}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-foreground-muted">Applicant Name:</span>
                  <span className="text-white">{applicantInfo?.nombre}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-foreground-muted">Notification Email:</span>
                  <span className="text-white">{applicantInfo?.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-foreground-muted">Claim Type:</span>
                  <span className="text-white">{applicantInfo?.tipo}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-foreground-muted">Subject:</span>
                  <span className="text-white font-sans">{applicantInfo?.motivo}</span>
                </div>
              </div>

              <p className="text-xs text-foreground-muted leading-relaxed">
                An electronic copy of this filing has been dispatched to KYVORA&apos;s legal compliance team. You will receive a substantiated response at your notification email within the statutory terms of Law 1755 of 2015 and Law 1480 of 2011.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 no-print">
                <button
                  type="button"
                  onClick={handlePrintVoucher}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                  <span>Print Filing Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="text-xs font-mono text-[var(--color-accent-cyan)] hover:underline"
                >
                  Submit another claim
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Do not fill if human</label>
                <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="tipo" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                    Claim Type *
                  </label>
                  <select
                    required
                    id="tipo"
                    name="tipo"
                    className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:border-[var(--color-accent)] focus:outline-none text-sm cursor-pointer"
                    defaultValue="Petition"
                  >
                    <option value="Petition">Petition (Information inquiry or clarification)</option>
                    <option value="Complaint">Complaint (Dissatisfaction with service or channel)</option>
                    <option value="Claim">Claim (Dissatisfaction with software, product, or warranty)</option>
                    <option value="Reversal">Payment Reversal Request (Decree 587/2016)</option>
                    <option value="Habeas Data">Exercise of Habeas Data Rights (Law 1581/2012)</option>
                    <option value="Suggestion">Suggestion or commendation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                    Applicant Full Name *
                  </label>
                  <input
                    required
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Your complete name"
                    className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                    Notification Email Address *
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="documento" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                    National ID / Tax ID / Passport (Optional)
                  </label>
                  <input
                    id="documento"
                    name="documento"
                    type="text"
                    placeholder="e.g., ID 1020304050"
                    className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="motivo" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                  Subject or Transaction / Contract Reference *
                </label>
                <input
                  required
                  id="motivo"
                  name="motivo"
                  type="text"
                  placeholder="e.g., Contract #04 or Wompi Reference KYV-DON-..."
                  className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="descripcion" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                  Detailed Description of Facts and Specific Claim *
                </label>
                <textarea
                  required
                  id="descripcion"
                  name="descripcion"
                  rows={5}
                  placeholder="Provide complete facts, relevant dates, and the specific resolution requested from KYVORA..."
                  className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm resize-y min-h-[140px]"
                ></textarea>
              </div>

              {/* Consent checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  required
                  type="checkbox"
                  id="aceptaPolitica"
                  name="aceptaPolitica"
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-background text-[var(--color-accent)] focus:ring-[var(--color-accent-cyan)] cursor-pointer"
                />
                <label htmlFor="aceptaPolitica" className="text-xs text-foreground-muted leading-relaxed cursor-pointer font-light">
                  I authorize KYVORA to process my personal data for the reception, processing, investigation, and formal notification of this request, in accordance with the{" "}
                  <Link href="/legal/datos-personales" target="_blank" className="text-[var(--color-accent-cyan)] underline">
                    Personal Data Processing Policy
                  </Link>{" "}
                  (Statutory Law 1581 of 2012).
                </label>
              </div>

              {status === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
              >
                <span>{status === "loading" ? "Submitting claim..." : "Submit Formal PQRS Claim"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

        {/* 3. Alternative Channels and SIC Escalation */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Alternative Channels and Escalation to Supervisory Authority</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            If you prefer direct communication or preliminary consultation, our verified channels are at your disposal:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-foreground-muted font-light">
            <li>
              <strong>Direct Support Email:</strong>{" "}
              <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline font-medium">
                {legalConfig.owner.legalEmail}
              </a>
            </li>
            <li>
              <strong>Official Support WhatsApp:</strong>{" "}
              <a href={siteConfig.contacts.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-cyan)] underline font-medium">
                {legalConfig.owner.phone}
              </a>
            </li>
            <li>
              <strong>Escalation to the Superintendence of Industry and Commerce (SIC):</strong> Should you consider that your consumer rights or personal data protection faculties have not been resolved within legal deadlines, after exhausting direct procedures with KYVORA you may file a complaint with the{" "}
              <a href={legalConfig.supervisoryAuthority.pqrsSicUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-cyan)] underline font-medium">
                Superintendence of Industry and Commerce (SIC)
              </a>.
            </li>
          </ul>
        </section>
      </LegalLayout>
    );
  }

  // Spanish (Default)
  return (
    <LegalLayout
      title="Canal Oficial de Reclamaciones y PQRS"
      subtitle="Sistema operativo de radicación, trazabilidad y gestión formal de Peticiones, Quejas, Reclamos y Solicitudes de reversión en Colombia."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Ley 1755 de 2015, Ley 1480 de 2011, Ley 2439 de 2024 & Decreto 587 de 2016"
    >
      {/* 1. Marco Operativo y Plazos Legales */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. Marco Operativo y Plazos Legales de Respuesta</h2>
        <p>
          En estricto cumplimiento del derecho fundamental de petición (artículo 23 de la Constitución Política y <strong>Ley 1755 de 2015</strong>), el Estatuto del Consumidor (<strong>Ley 1480 de 2011</strong>) y la <strong>Ley 2439 de 2024</strong> sobre comercio electrónico, <strong>{legalConfig.brandName}</strong> dispone de este canal centralizado para garantizar la radicación, trazabilidad, constancia y respuesta oportuna a toda solicitud.
        </p>

        <div className="grid md:grid-cols-3 gap-4 text-sm mt-4 font-light">
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--color-accent-cyan)] font-mono text-xs uppercase font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Peticiones y Consultas</span>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Solicitudes de información técnica, aclaración de alcances o consultas de Hábeas Data.
            </p>
            <div className="text-white font-medium text-xs pt-1 border-t border-white/5">
              Término legal: Hasta 10 días hábiles
            </div>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Quejas y Reclamos</span>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Inconformidad con la atención, reclamos sobre entregables de software o solicitudes de supresión de datos.
            </p>
            <div className="text-white font-medium text-xs pt-1 border-t border-white/5">
              Término legal: Hasta 15 días hábiles
            </div>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reversión del Pago</span>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Solicitudes por fraude, cobros no autorizados, servicio no prestado o producto defectuoso (Decreto 587/2016).
            </p>
            <div className="text-white font-medium text-xs pt-1 border-t border-white/5">
              Notificación en 5 días; trámite en 15 días
            </div>
          </div>
        </div>
      </section>

      {/* 2. Módulo de Radicación en Línea */}
      <section className="space-y-6 pt-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Formulario Oficial de Radicación en Línea</h2>
        
        {status === "success" ? (
          <div className="p-8 bg-surface border border-emerald-500/30 rounded-2xl space-y-5">
            <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl">
              <CheckCircle2 className="w-7 h-7 shrink-0" />
              <span>Constancia Oficial de Radicación de PQRS</span>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Su solicitud ha sido registrada exitosamente en nuestro sistema de radicación de peticiones y reclamaciones con los siguientes datos de trazabilidad legal:
            </p>
            
            <div className="bg-background/90 p-5 rounded-xl border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Número de Radicado Oficial:</span>
                <span className="text-[var(--color-accent-cyan)] font-bold text-sm">{ticketId}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Fecha y Hora de Radicación:</span>
                <span className="text-white">{submissionDate}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Solicitante:</span>
                <span className="text-white">{applicantInfo?.nombre}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Correo de Notificación:</span>
                <span className="text-white">{applicantInfo?.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                <span className="text-foreground-muted">Tipo de Trámite:</span>
                <span className="text-white">{applicantInfo?.tipo}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-foreground-muted">Asunto:</span>
                <span className="text-white font-sans">{applicantInfo?.motivo}</span>
              </div>
            </div>

            <p className="text-xs text-foreground-muted leading-relaxed">
              Una copia electrónica con los detalles de este radicado ha sido notificada al equipo de atención y cumplimiento legal de KYVORA. Recibirá respuesta motivada en su correo electrónico dentro del término legal estipulado en la Ley 1755 de 2015 y la Ley 1480 de 2011.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 no-print">
              <button
                type="button"
                onClick={handlePrintVoucher}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                <span>Imprimir Comprobante de Radicación</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-xs font-mono text-[var(--color-accent-cyan)] hover:underline"
              >
                Radicar otra solicitud distinta
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
            {/* Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">No llenar si eres humano</label>
              <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="tipo" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                  Tipo de Solicitud *
                </label>
                <select
                  required
                  id="tipo"
                  name="tipo"
                  className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:border-[var(--color-accent)] focus:outline-none text-sm cursor-pointer"
                  defaultValue="Petición"
                >
                  <option value="Petición">Petición (Consulta o solicitud de información)</option>
                  <option value="Queja">Queja (Inconformidad con la atención o canal)</option>
                  <option value="Reclamo">Reclamo (Inconformidad con servicio, producto o garantía)</option>
                  <option value="Reversión">Solicitud de Reversión del Pago (Decreto 587/2016)</option>
                  <option value="Hábeas Data">Ejercicio de Derechos de Hábeas Data (Ley 1581/2012)</option>
                  <option value="Sugerencia">Sugerencia o felicitación</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="nombre" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                  Nombre Completo del Solicitante *
                </label>
                <input
                  required
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre y apellidos completos"
                  className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                  Correo Electrónico de Notificación *
                </label>
                <input
                  required
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="documento" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                  Documento de Identidad (C.C. / NIT / Pasaporte)
                </label>
                <input
                  id="documento"
                  name="documento"
                  type="text"
                  placeholder="Ej: C.C. 1.020.304.050"
                  className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="motivo" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                Asunto o Referencia Transaccional / Contractual *
              </label>
              <input
                required
                id="motivo"
                name="motivo"
                type="text"
                placeholder="Ej: Contrato de desarrollo web #04 o Referencia Wompi KYV-DON-..."
                className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="descripcion" className="text-xs font-mono uppercase tracking-wider text-foreground-muted block">
                Descripción Detallada de los Hechos y Pretensión Concreta *
              </label>
              <textarea
                required
                id="descripcion"
                name="descripcion"
                rows={5}
                placeholder="Explica detalladamente los hechos que motivan la solicitud, las fechas relevantes y lo que pretendes que KYVORA resuelva de manera puntual..."
                className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm resize-y min-h-[140px]"
              ></textarea>
            </div>

            {/* Consent checkbox (required, not pre-checked) */}
            <div className="flex items-start gap-3 pt-2">
              <input
                required
                type="checkbox"
                id="aceptaPolitica"
                name="aceptaPolitica"
                className="mt-1 h-4 w-4 rounded border-white/20 bg-background text-[var(--color-accent)] focus:ring-[var(--color-accent-cyan)] cursor-pointer"
              />
              <label htmlFor="aceptaPolitica" className="text-xs text-foreground-muted leading-relaxed cursor-pointer font-light">
                Autorizo a KYVORA el tratamiento de mis datos personales para la recepción, trámite, investigación y notificación de la respuesta de esta solicitud, conforme a la{" "}
                <Link href="/legal/datos-personales" target="_blank" className="text-[var(--color-accent-cyan)] underline">
                  Política de Tratamiento de Datos Personales
                </Link>{" "}
                (Ley 1581 de 2012).
              </label>
            </div>

            {status === "error" && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              <span>{status === "loading" ? "Radicando solicitud..." : "Radicar PQRS Formal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </section>

      {/* 3. Canales Alternativos y Escalamiento ante la SIC */}
      <section className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Canales Alternativos y Escalamiento ante la Autoridad de Control</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Si prefiere radicar su comunicación directamente por correo electrónico o consultar dudas previas, ponemos a su disposición nuestros canales directos verificados:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-foreground-muted font-light">
          <li>
            <strong>Correo electrónico directo de atención:</strong>{" "}
            <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline font-medium">
              {legalConfig.owner.legalEmail}
            </a>
          </li>
          <li>
            <strong>WhatsApp oficial de soporte:</strong>{" "}
            <a href={siteConfig.contacts.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-cyan)] underline font-medium">
              {legalConfig.owner.phone}
            </a>
          </li>
          <li>
            <strong>Escalamiento ante la Superintendencia de Industria y Comercio (SIC):</strong> En caso de considerar que su reclamación como consumidor o titular de datos personales no ha sido atendida en los términos de ley, o de persistir una inconformidad tras haber agotado el trámite directo con KYVORA, puede acudir ante la{" "}
            <a href={legalConfig.supervisoryAuthority.pqrsSicUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-cyan)] underline font-medium">
              Superintendencia de Industria y Comercio (SIC)
            </a>.
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
