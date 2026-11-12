import type { Language } from "@/i18n/translations";
import type { ContactServiceOption } from "@/lib/service-selection";

export type ResourceCategory = "costos" | "arquitectura" | "ia-automatizacion";

export type ResourceBlock =
  | {
      type: "heading";
      level: 2 | 3;
      id: string;
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      ordered?: boolean;
      items: Array<{
        title?: string;
        text: string;
      }>;
    }
  | {
      type: "table";
      caption?: string;
      headers: string[];
      rows: string[][];
    }
  | {
      type: "callout";
      tone: "info" | "decision" | "warning";
      title: string;
      text: string;
    }
  | {
      type: "code";
      filename?: string;
      language: string;
      code: string;
    }
  | {
      type: "figure";
      src: string;
      alt: string;
      caption?: string;
    };

export interface LocalizedArticleContent {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  categoryLabel: string;
  readingTimeLabel: string;
  keywords: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  blocks: ResourceBlock[];
}

export interface ResourceArticle {
  id: string;
  category: ResourceCategory;
  published: boolean;
  publishedAt: string; // YYYY-MM-DD real
  updatedAt: string;   // YYYY-MM-DD real
  readingMinutes: number;
  authorName: string;
  relatedServiceValue: Exclude<ContactServiceOption, "">;
  es: LocalizedArticleContent;
  en: LocalizedArticleContent;
}

export function getResourcePath(lang: Language, slug?: string): string {
  if (lang === "en") {
    return slug ? `/recursos/en/${slug}` : "/recursos/en";
  }
  return slug ? `/recursos/${slug}` : "/recursos";
}
