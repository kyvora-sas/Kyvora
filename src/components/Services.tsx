"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Smartphone, Server, Bot, ArrowRight, CheckCircle2, AlertTriangle, ChevronDown, type LucideIcon } from "lucide-react";

interface ServiceDetail {
  id: string;
  num: string;
  title: string;
  icon: LucideIcon;
  shortDesc: string;
  whatWeBuild: string;
  needSolved: string;
  included: string[];
  limitationsAndDependencies: string[];
  howToQuote: string;
}

const servicesData: ServiceDetail[] = [
  {
    id: "web-development",
    num: "01",
    title: "Desarrollo Web & Landing Pages",
    icon: Globe,
    shortDesc: "Diseño y desarrollo de sitios web modernos, veloces y de alta conversión.",
    whatWeBuild:
      "Sitios web institucionales, páginas de aterrizaje (landing pages) para campañas comerciales, portafolios interactivos y portales de contenido estructurado desarrollados sobre arquitecturas modernas como Next.js y React.",
    needSolved:
      "Resuelve la falta de credibilidad, la lentitud de carga de plantillas pesadas y la baja tasa de conversión de visitantes en clientes potenciales.",
    included: [
      "Diseño UI/UX adaptado a la identidad de marca (Desktop y Móvil)",
      "Código semántico, accesible y optimizado para motores de búsqueda (SEO)",
      "Formularios funcionales con protección anti-spam y entrega por correo",
      "Puntuación alta en Google Lighthouse (>90 en métricas clave)",
      "Metadatos Open Graph para previsualización en WhatsApp y redes sociales",
    ],
    limitationsAndDependencies: [
      "El cliente debe proveer los textos finales, logotipos y material fotográfico oficial.",
      "El costo anual de nombre de dominio y hosting cloud corre por cuenta del cliente.",
      "No incluye pasarelas de pago transaccionales complejas a menos que se coticen como módulo adicional.",
    ],
    howToQuote:
      "Selecciona el tipo 'Página web' en nuestro formulario de contacto o escríbenos por WhatsApp con los enlaces de referencia y secciones requeridas.",
  },
  {
    id: "app-development",
    num: "02",
    title: "Aplicaciones Web y Móviles",
    icon: Smartphone,
    shortDesc: "Plataformas interactivas y aplicaciones móviles orientadas a resolver problemas concretos.",
    whatWeBuild:
      "Aplicaciones web progresivas (PWA), paneles de administración (dashboards) de usuario y clientes móviles desarrollados con tecnologías modernas como Next.js, React y Flutter.",
    needSolved:
      "Permite a negocios y startups materializar productos mínimos viables (MVP) o herramientas internas operativas sin lidiar con arquitecturas sobredimensionadas.",
    included: [
      "Flujos de autenticación segura de usuarios (Email/Password, OAuth)",
      "Diseño de interfaz interactiva con estados de carga y manejo de errores",
      "Modelado de base de datos y diseño de APIs RESTful o Server Actions",
      "Pruebas funcionales de los flujos críticos de la aplicación",
      "Despliegue configurado en entornos de staging y producción",
    ],
    limitationsAndDependencies: [
      "Las cuentas de desarrollador en Apple App Store y Google Play Store deben ser provistas por el cliente.",
      "Servicios de base de datos o almacenamiento de archivos (AWS, Supabase, Cloudinary) son pagados directamente al proveedor por el contratante.",
    ],
    howToQuote:
      "Envíanos una descripción de los roles de usuario esperados y las 3 o 4 pantallas principales de tu flujo para elaborar una estimación por hitos.",
  },
  {
    id: "custom-systems",
    num: "03",
    title: "Sistemas Personalizados de Software",
    icon: Server,
    shortDesc: "Software a la medida para procesos operativos, sincronización de datos y plataformas privadas.",
    whatWeBuild:
      "Herramientas de gestión interna, sistemas de facturación/inventario a medida, motores de cálculo, conexiones entre plataformas dispares y servicios de backend con bases de datos relacionales.",
    needSolved:
      "Elimina las limitaciones y costos recurrentes de licencias SaaS genéricas que no se adaptan a las particularidades operativas del negocio.",
    included: [
      "Levantamiento de especificación técnica y modelo de datos relacional",
      "Manejo de concurrencia, transacciones atómicas y seguridad de datos",
      "Paneles de reportería y exportación estructurada de información",
      "Roles, permisos granulares y registros de auditoría",
      "Documentación técnica de arquitectura y manual básico de administración",
    ],
    limitationsAndDependencies: [
      "Requiere disponibilidad del equipo del cliente durante la etapa de descubrimiento para definir reglas de negocio.",
      "Mantenimiento correctivo o evolutivo post-garantía se formaliza mediante acuerdos de nivel de servicio (SLA) mensuales.",
    ],
    howToQuote:
      "Agenda una sesión de diagnóstico inicial mediante nuestro formulario indicando el cuello de botella operativo que necesitas solucionar.",
  },
  {
    id: "automation-ai",
    num: "04",
    title: "Automatización e Integración de IA",
    icon: Bot,
    shortDesc: "Flujos de automatización y asistentes inteligentes para optimizar tareas repetitivas.",
    whatWeBuild:
      "Integraciones con modelos de lenguaje (LLMs de OpenAI, Anthropic o modelos abiertos), asistentes contextuales para atención preliminar, agentes de extracción de datos de documentos y automatización de procesos entre aplicaciones.",
    needSolved:
      "Reduce drásticamente el tiempo dedicado por el personal a tareas repetitivas de clasificación, respuesta a consultas frecuentes o transcripción de datos.",
    included: [
      "Diseño de prompts estructurados y canalización segura de datos hacia los modelos",
      "Almacenamiento y búsqueda vectorial si el caso requiere recuperación de documentos (RAG)",
      "Webhooks para activar automatizaciones ante eventos comerciales o de mensajería",
      "Manejo de fallos, reintentos y límites de tokens para control presupuestal",
    ],
    limitationsAndDependencies: [
      "El consumo de tokens de los modelos de IA es facturado directamente por los proveedores (OpenAI, Anthropic) al cliente.",
      "Los modelos de IA pueden presentar márgenes de incertidumbre ('alucinaciones'); se diseñan salvaguardas pero no sustituyen el juicio humano crítico en decisiones legales o médicas.",
    ],
    howToQuote:
      "Cuéntanos qué proceso repetitivo deseas automatizar y qué herramientas utilizas actualmente (WhatsApp, correo, hojas de cálculo, CRM).",
  },
];

export default function Services() {
  const [expandedId, setExpandedId] = useState<string | null>("web-development");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="servicios" className="py-24 md:py-36 bg-surface/50 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[var(--color-accent-cyan)] mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              <span>Capacidades de Ingeniería</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Servicios Comerciales
            </h2>
          </div>
          <p className="text-foreground-muted text-base max-w-md font-light">
            Soluciones estructuradas con alcance transparente. Especificamos con claridad qué construimos, qué incluye el entregable y qué dependencias existen.
          </p>
        </div>

        {/* Services Accordion / Detailed Grid */}
        <div className="space-y-6">
          {servicesData.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "bg-surface border-[var(--color-accent)]/50 shadow-2xl shadow-blue-900/10"
                    : "bg-surface/60 border-white/10 hover:border-white/20"
                }`}
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleExpand(service.id)}
                  className="w-full p-6 md:p-8 flex items-start justify-between text-left gap-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-4 md:gap-8">
                    <span className="text-sm font-mono text-[var(--color-accent-cyan)] pt-1.5 shrink-0">
                      {service.num}
                    </span>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-foreground-muted text-sm sm:text-base font-light max-w-2xl">
                        {service.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 p-2 rounded-full bg-white/5 text-foreground-muted hover:text-white transition-colors">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-[var(--color-accent-cyan)]" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="px-6 pb-8 md:px-8 md:pb-10 pt-2 border-t border-white/5 space-y-8 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-8 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent-cyan)]">
                          Qué se desarrolla
                        </h4>
                        <p className="text-foreground-muted leading-relaxed font-light">
                          {service.whatWeBuild}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent-cyan)]">
                          Necesidad que resuelve
                        </h4>
                        <p className="text-foreground-muted leading-relaxed font-light">
                          {service.needSolved}
                        </p>
                      </div>
                    </div>

                    {/* What's included */}
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                        Qué incluye el entregable
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3 text-xs md:text-sm text-foreground/90 font-light">
                        {service.included.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Limitations & Dependencies */}
                    <div className="p-4 rounded-xl bg-background/50 border border-amber-500/20 space-y-2 text-xs md:text-sm">
                      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Limitaciones y dependencias del servicio</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-foreground-muted font-light">
                        {service.limitationsAndDependencies.map((lim, idx) => (
                          <li key={idx}>{lim}</li>
                        ))}
                      </ul>
                    </div>

                    {/* How to Quote & CTA */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
                      <p className="text-xs text-foreground-muted">
                        <strong className="text-white">Cómo cotizar:</strong> {service.howToQuote}
                      </p>
                      <Link
                        href="#contacto"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-accent-cyan)] hover:underline shrink-0"
                      >
                        <span>Solicitar cotización de este servicio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
