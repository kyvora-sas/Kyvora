"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { GithubIcon, InstagramIcon } from "@/components/SocialIcons";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      tipoProyecto: formData.get("tipoProyecto"),
      descripcion: formData.get("descripcion"),
      presupuesto: formData.get("presupuesto"),
      website_hp: formData.get("website_hp"), // Honeypot field
      aceptaPolitica: formData.get("aceptaPolitica") === "on",
    };

    if (!payload.aceptaPolitica) {
      setStatus("error");
      setErrorMessage("Debes autorizar el tratamiento de datos personales para enviar tu mensaje.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ocurrió un error al enviar el mensaje.");
      }

      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el envío.";
      setStatus("error");
      setErrorMessage(msg);
    }
  };

  return (
    <section id="contacto" className="py-24 md:py-36 bg-background border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct info & channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                <span>Contacto Directo</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
                ¿Tienes algo que construir?
              </h2>
              <p className="text-foreground-muted text-base sm:text-lg font-light leading-relaxed">
                Cuéntanos qué tienes en mente. No necesitas tener todo especificado desde el primer día: nosotros te ayudamos a estructurar la arquitectura técnica y el alcance.
              </p>
            </div>

            {/* Direct Verified Channels */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-foreground-muted">
                Canales oficiales verificados
              </h3>

              <div className="space-y-3 font-mono text-sm">
                <a
                  href={siteConfig.contacts.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-surface border border-white/5 hover:border-[var(--color-accent)]/50 transition-colors flex items-center gap-3 text-white group"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{siteConfig.contacts.whatsappNumber}</span>
                  <span className="ml-auto text-[10px] text-emerald-400 uppercase tracking-widest font-sans">
                    WhatsApp
                  </span>
                </a>

                <a
                  href={`mailto:${siteConfig.contacts.email}`}
                  className="p-3.5 rounded-xl bg-surface border border-white/5 hover:border-[var(--color-accent)]/50 transition-colors flex items-center gap-3 text-white group"
                >
                  <Mail className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>{siteConfig.contacts.email}</span>
                  <span className="ml-auto text-[10px] text-blue-400 uppercase tracking-widest font-sans">
                    Email
                  </span>
                </a>

                <a
                  href={siteConfig.contacts.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-surface border border-white/5 hover:border-white/20 transition-colors flex items-center gap-3 text-foreground-muted hover:text-white group"
                >
                  <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>github.com/Kyvora-org</span>
                  <span className="ml-auto text-[10px] text-foreground-muted uppercase tracking-widest font-sans">
                    GitHub
                  </span>
                </a>

                <a
                  href={siteConfig.contacts.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-surface border border-white/5 hover:border-pink-500/30 transition-colors flex items-center gap-3 text-foreground-muted hover:text-white group"
                >
                  <InstagramIcon className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>@_kyvora_</span>
                  <span className="ml-auto text-[10px] text-pink-400 uppercase tracking-widest font-sans">
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Functional Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl bg-surface border border-white/10 shadow-2xl shadow-black/80">
              {status === "success" ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                      Mensaje recibido correctamente
                    </h3>
                    <p className="text-foreground-muted text-sm max-w-md mx-auto leading-relaxed">
                      Revisaremos tu requerimiento y nos pondremos en contacto contigo a la brevedad posible.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Honeypot field (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">No llenar este campo si eres humano</label>
                    <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        Nombre completo *
                      </label>
                      <input
                        required
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Ej: Daniel Morales"
                        disabled={status === "loading"}
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        Correo electrónico *
                      </label>
                      <input
                        required
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@empresa.com"
                        disabled={status === "loading"}
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="tipoProyecto" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        Tipo de servicio *
                      </label>
                      <select
                        required
                        id="tipoProyecto"
                        name="tipoProyecto"
                        disabled={status === "loading"}
                        defaultValue=""
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors cursor-pointer"
                      >
                        <option value="" disabled>
                          Selecciona una categoría
                        </option>
                        <option value="Landing Page / Web">Desarrollo Web & Landing Page</option>
                        <option value="Aplicación Web/Móvil">Aplicación Web o Móvil (MVP)</option>
                        <option value="Sistema a Medida">Sistema Personalizado de Software</option>
                        <option value="Automatización / IA">Automatización e Integración de IA</option>
                        <option value="Otro">Otro requerimiento técnico</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="presupuesto" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                        Presupuesto estimado (Opcional)
                      </label>
                      <input
                        id="presupuesto"
                        name="presupuesto"
                        type="text"
                        placeholder="Ej: $2.000.000 COP o $1.000 USD"
                        disabled={status === "loading"}
                        className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="descripcion" className="text-xs font-mono uppercase tracking-widest text-foreground-muted block">
                      Descripción del proyecto o necesidad *
                    </label>
                    <textarea
                      required
                      id="descripcion"
                      name="descripcion"
                      rows={4}
                      placeholder="Cuéntanos el propósito de tu proyecto, qué funcionalidades clave imaginas o qué problema necesitas resolver..."
                      disabled={status === "loading"}
                      className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white placeholder-foreground-muted/40 focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors resize-y min-h-[120px]"
                    ></textarea>
                  </div>

                  {/* Mandatory Colombian Data Protection Checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      required
                      type="checkbox"
                      id="aceptaPolitica"
                      name="aceptaPolitica"
                      disabled={status === "loading"}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-background text-[var(--color-accent)] focus:ring-[var(--color-accent-cyan)] cursor-pointer"
                    />
                    <label htmlFor="aceptaPolitica" className="text-xs text-foreground-muted leading-relaxed cursor-pointer font-light">
                      Autorizo a KYVORA el tratamiento de mis datos de contacto exclusivamente para atender y dar respuesta a esta consulta comercial, conforme a la{" "}
                      <Link href="/legal/datos-personales" target="_blank" className="text-[var(--color-accent-cyan)] underline">
                        Política de Tratamiento de Datos Personales
                      </Link>{" "}
                      (Ley 1581 de 2012).
                    </label>
                  </div>

                  {status === "error" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{status === "loading" ? "Transmitiendo mensaje..." : "Enviar Mensaje"}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
