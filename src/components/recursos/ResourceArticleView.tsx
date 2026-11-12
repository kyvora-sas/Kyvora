import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Languages } from "lucide-react";
import type { Language } from "@/i18n/translations";
import type { ResourceArticle } from "@/content/recursos/types";
import { getResourcePath } from "@/content/recursos/types";
import { getLocalizedArticleContent, getPublishedArticles } from "@/content/recursos/helpers";
import { ArticleRenderer } from "./ArticleRenderer";
import { ResourceCard } from "./ResourceCard";
import { Button, Card, Container } from "@/components/ui";
import { siteConfig } from "@/config/site";

export function ResourceArticleView({
  article,
  lang,
}: {
  article: ResourceArticle;
  lang: Language;
}) {
  const isEn = lang === "en";
  const content = getLocalizedArticleContent(article, lang);
  const altLang: Language = isEn ? "es" : "en";
  const altContent = getLocalizedArticleContent(article, altLang);

  const canonicalUrl = `${siteConfig.url}${getResourcePath(lang, content.slug)}`;
  const altUrl = getResourcePath(altLang, altContent.slug);
  const hubUrl = getResourcePath(lang);

  const headings = content.blocks.filter((b) => b.type === "heading" && b.level === 2);
  const relatedArticles = getPublishedArticles().filter((a) => a.id !== article.id);

  const contactPreselectHref = `/?service=${encodeURIComponent(article.relatedServiceValue)}#contacto`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: content.title,
        description: content.metaDescription,
        image: `${siteConfig.url}/opengraph-image`,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        inLanguage: isEn ? "en-US" : "es-CO",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        author: {
          "@type": "Organization",
          name: article.authorName,
          url: siteConfig.url,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/icon.svg`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEn ? "Home" : "Inicio",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEn ? "Resources" : "Recursos",
            item: `${siteConfig.url}${hubUrl}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: content.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <main id="contenido-principal" className="min-h-screen bg-[#080B12] pt-28 sm:pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Container>
        {/* Top bar: Breadcrumb + Language Switch */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[rgba(175,196,232,0.12)] mb-10">
          <nav aria-label={isEn ? "Breadcrumb" : "Ruta de navegación"} className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8F9BB3]">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? "Home" : "Inicio"}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={hubUrl} className="hover:text-white transition-colors">
              {isEn ? "Resources" : "Recursos"}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#AFC4E8] truncate max-w-[260px] sm:max-w-md">{content.title}</span>
          </nav>

          <Link
            href={altUrl}
            hrefLang={altLang}
            className="inline-flex items-center gap-2 rounded-full border border-[#252D3A] bg-[#0D121D] hover:border-[#1677FF]/60 px-3.5 py-1.5 text-xs font-mono text-[#AFC4E8] hover:text-white transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
            <span>{isEn ? "Leer versión en Español" : "Read English version"}</span>
          </Link>
        </div>

        {/* Main Editorial Layout: Reading Column + Sticky Outline Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <article className="lg:col-span-8 space-y-8 max-w-[74ch]">
            <header className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1677FF]/45 bg-[#1677FF]/12 px-3 py-1 text-[#AFC4E8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]" aria-hidden="true" />
                  <span>{content.categoryLabel}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#8F9BB3]">
                  <Clock className="w-3.5 h-3.5 text-[#5CA8FF]" aria-hidden="true" />
                  <span>{content.readingTimeLabel}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#8F9BB3]">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {isEn ? "Published & updated:" : "Publicado y actualizado:"}{" "}
                    <time dateTime={article.updatedAt}>{article.updatedAt}</time>
                  </span>
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.14] tracking-tight text-balance">
                {content.title}
              </h1>

              <p className="text-lg sm:text-xl text-[#AFC4E8] leading-relaxed font-normal">
                {content.excerpt}
              </p>

              <div className="text-xs font-mono text-[#8F9BB3] pt-2 border-t border-[rgba(175,196,232,0.1)]">
                {isEn ? "By" : "Por"} <strong className="text-white font-medium">{article.authorName}</strong>
              </div>
            </header>

            <ArticleRenderer blocks={content.blocks} />

            {/* Inline Conversion CTA */}
            <Card variant="signal" padding="lg" className="mt-12 space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5CA8FF]">
                KYVORA Studio
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                {content.ctaTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#AFC4E8] leading-relaxed">
                {content.ctaDescription}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  href={contactPreselectHref}
                  rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                >
                  {content.ctaButtonLabel}
                </Button>
                <Button variant="secondary" href="/#precios">
                  {isEn ? "Reference pricing" : "Precios referenciales"}
                </Button>
              </div>
            </Card>

            <div className="pt-4">
              <Link
                href={hubUrl}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#AFC4E8] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isEn ? "Back to all resources" : "Volver a todos los recursos"}</span>
              </Link>
            </div>
          </article>

          {/* Desktop Sidebar: Contents + Studio Link */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {headings.length > 0 ? (
              <Card variant="surface" padding="md" className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#AFC4E8]">
                  {isEn ? "In this guide" : "Contenido de esta guía"}
                </p>
                <nav aria-label={isEn ? "Table of contents" : "Tabla de contenido"}>
                  <ul className="space-y-2 text-sm">
                    {headings.map((heading) =>
                      heading.type === "heading" ? (
                        <li key={heading.id}>
                          <a
                            href={`#${heading.id}`}
                            className="block py-1 text-[#8F9BB3] hover:text-white transition-colors leading-snug"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ) : null
                    )}
                  </ul>
                </nav>
              </Card>
            ) : null}

            <Card variant="elevated" padding="md" className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5CA8FF]">
                {isEn ? "Relevant Service" : "Servicio Relacionado"}
              </p>
              <p className="font-display text-lg font-bold text-white">
                {article.relatedServiceValue}
              </p>
              <p className="text-xs sm:text-sm text-[#8F9BB3] leading-relaxed">
                {isEn
                  ? "Jump directly to the KYVORA Studio quote form with this service category preselected."
                  : "Pasa directamente al formulario de contacto de KYVORA Studio con esta categoría ya preseleccionada."}
              </p>
              <Button
                variant="signal"
                size="sm"
                fullWidth
                href={contactPreselectHref}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                {isEn ? "Request Estimate" : "Solicitar Estimación"}
              </Button>
            </Card>
          </aside>
        </div>

        {/* Related Guides */}
        {relatedArticles.length > 0 ? (
          <section className="mt-20 pt-12 border-t border-[rgba(175,196,232,0.12)] space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">
              {isEn ? "More technical guides" : "Más guías técnicas"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <ResourceCard key={rel.id} article={rel} lang={lang} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}

