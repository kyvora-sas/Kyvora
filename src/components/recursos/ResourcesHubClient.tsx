"use client";

import { useState } from "react";
import Link from "next/link";
import { Languages, ArrowRight } from "lucide-react";
import type { Language } from "@/i18n/translations";
import type { ResourceArticle, ResourceCategory } from "@/content/recursos/types";
import { ResourceCard } from "./ResourceCard";
import { Button, Container, EmptyState, ModularGrid, SectionHeader } from "@/components/ui";

export function ResourcesHubClient({
  articles,
  lang,
}: {
  articles: ResourceArticle[];
  lang: Language;
}) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | ResourceCategory>("all");
  const isEn = lang === "en";

  const categories: Array<{ id: "all" | ResourceCategory; label: string }> = isEn
    ? [
        { id: "all", label: "All guides" },
        { id: "costos", label: "Pricing & Scope" },
        { id: "arquitectura", label: "Architecture" },
        { id: "ia-automatizacion", label: "AI & Automation" },
      ]
    : [
        { id: "all", label: "Todas las guías" },
        { id: "costos", label: "Costos y Alcance" },
        { id: "arquitectura", label: "Arquitectura" },
        { id: "ia-automatizacion", label: "IA y Automatización" },
      ];

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((item) => item.category === selectedCategory);

  return (
    <main id="contenido-principal" className="min-h-screen bg-[#080B12] pt-28 sm:pt-32 pb-24">
      <Container>
        {/* Top bar: Breadcrumb + alternate language route */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[rgba(175,196,232,0.12)] mb-12">
          <nav aria-label={isEn ? "Breadcrumb" : "Ruta de navegación"} className="flex items-center gap-2 text-xs font-mono text-[#8F9BB3]">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? "Home" : "Inicio"}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#AFC4E8]">{isEn ? "Resources" : "Recursos"}</span>
          </nav>

          <Link
            href={isEn ? "/recursos" : "/recursos/en"}
            hrefLang={isEn ? "es" : "en"}
            className="inline-flex items-center gap-2 rounded-full border border-[#252D3A] bg-[#0D121D] hover:border-[#1677FF]/60 px-3.5 py-1.5 text-xs font-mono text-[#AFC4E8] hover:text-white transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
            <span>{isEn ? "Ver recursos en Español" : "Read Resources in English"}</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="space-y-8 mb-14">
          <SectionHeader
            headingLevel="h1"
            eyebrow={isEn ? "KYVORA Technical Guides" : "Guías Técnicas KYVORA"}
            title={
              isEn
                ? "Practical engineering resources for digital products"
                : "Recursos prácticos de ingeniería y producto digital"
            }
            description={
              isEn
                ? "Honest architectural analysis, realistic development scoping in Colombia, and criteria for building software and integrating AI without filler."
                : "Guías honestas sobre costos reales en Colombia, arquitectura web frente a aplicaciones y criterios prácticos para integrar IA sin humo ni relleno."
            }
          />

          {/* Category Filter */}
          <div role="group" aria-label={isEn ? "Filter by category" : "Filtrar por categoría"} className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                    active
                      ? "bg-[#1677FF]/20 text-white border-[#1677FF]/60"
                      : "bg-[#0D121D] text-[#8F9BB3] border-[#252D3A] hover:text-white hover:border-[rgba(175,196,232,0.28)]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <ModularGrid cols={3} gap="md">
            {filteredArticles.map((article) => (
              <ResourceCard key={article.id} article={article} lang={lang} />
            ))}
          </ModularGrid>
        ) : (
          <EmptyState
            title={isEn ? "No articles in this category yet" : "Aún no hay guías publicadas en esta categoría"}
            description={
              isEn
                ? "New guides are added only after full technical and editorial review."
                : "Solo publicamos piezas revisadas con utilidad real. Explora todas las guías disponibles mientras incorporamos nuevas ediciones."
            }
            action={
              <Button variant="secondary" size="sm" onClick={() => setSelectedCategory("all")}>
                {isEn ? "View all guides" : "Ver todas las guías"}
              </Button>
            }
          />
        )}

        {/* Bottom Studio Conversion Bridge */}
        <section className="mt-20 rounded-2xl border border-[#252D3A] bg-gradient-to-br from-[#0D121D] to-[#141B2B]/70 p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5CA8FF]">
              {isEn ? "KYVORA Studio · Ideas that take shape" : "KYVORA Studio · Ideas que toman forma"}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {isEn
                ? "Need help sizing a real software project?"
                : "¿Necesitas aterrizar el alcance técnico de tu proyecto?"}
            </h2>
            <p className="text-sm sm:text-base text-[#8F9BB3] leading-relaxed">
              {isEn
                ? "Explore our service lines and transparent reference pricing or message us directly with what you want to solve."
                : "Revisa nuestras líneas de servicio y rangos referenciales, o escríbenos directamente explicándonos qué problema operativo quieres resolver."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button variant="secondary" href="/#servicios">
              {isEn ? "View Services" : "Ver Servicios"}
            </Button>
            <Button
              variant="primary"
              href="/#contacto"
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            >
              {isEn ? "Start a Conversation" : "Conversar sobre un proyecto"}
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}

