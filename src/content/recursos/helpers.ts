import type { Language } from "@/i18n/translations";
import { resourceArticles } from "./articles";
import type { LocalizedArticleContent, ResourceArticle } from "./types";
import { getResourcePath } from "./types";

export function getPublishedArticles(): ResourceArticle[] {
  return resourceArticles.filter((article) => article.published);
}

export function getArticleBySlug(lang: Language, slug: string): ResourceArticle | undefined {
  return getPublishedArticles().find((article) =>
    lang === "en" ? article.en.slug === slug : article.es.slug === slug
  );
}

export function getLocalizedArticleContent(
  article: ResourceArticle,
  lang: Language
): LocalizedArticleContent {
  return lang === "en" ? article.en : article.es;
}

/**
 * Mapea cualquier ruta editorial actual (/recursos o /recursos/en + slug)
 * hacia su equivalente exacto al cambiar de idioma en LanguageToggle.
 */
export function resolveAlternateRecursosPath(pathname: string, targetLang: Language): string {
  if (pathname === "/recursos" || pathname === "/recursos/en") {
    return getResourcePath(targetLang);
  }

  const enPrefix = "/recursos/en/";
  const esPrefix = "/recursos/";

  if (pathname.startsWith(enPrefix)) {
    const slug = pathname.slice(enPrefix.length);
    const article = getArticleBySlug("en", slug);
    if (article) {
      return getResourcePath(targetLang, targetLang === "en" ? article.en.slug : article.es.slug);
    }
    return getResourcePath(targetLang);
  }

  if (pathname.startsWith(esPrefix)) {
    const slug = pathname.slice(esPrefix.length);
    const article = getArticleBySlug("es", slug);
    if (article) {
      return getResourcePath(targetLang, targetLang === "en" ? article.en.slug : article.es.slug);
    }
    return getResourcePath(targetLang);
  }

  return getResourcePath(targetLang);
}

