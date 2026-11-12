import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { Language } from "@/i18n/translations";
import type { ResourceArticle } from "@/content/recursos/types";
import { getResourcePath } from "@/content/recursos/types";
import { getLocalizedArticleContent } from "@/content/recursos/helpers";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui";

export function ResourceCard({
  article,
  lang,
}: {
  article: ResourceArticle;
  lang: Language;
}) {
  const content = getLocalizedArticleContent(article, lang);
  const href = getResourcePath(lang, content.slug);

  return (
    <Card variant="interactive" padding="md" as="article" className="flex flex-col justify-between h-full group">
      <div className="space-y-4">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1677FF]/40 bg-[#1677FF]/12 px-2.5 py-1 text-[#AFC4E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]" aria-hidden="true" />
              <span>{content.categoryLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#8F9BB3]">
              <Clock className="w-3.5 h-3.5 text-[#5CA8FF]" aria-hidden="true" />
              <span>{content.readingTimeLabel}</span>
            </span>
          </div>

          <h2 className="font-display text-xl font-bold text-white leading-snug group-hover:text-[#2B85FF] transition-colors pt-1">
            <Link
              href={href}
              className="focus:outline-none focus-visible:underline"
            >
              {content.title}
            </Link>
          </h2>
        </CardHeader>

        <CardBody className="text-sm text-[#8F9BB3] leading-relaxed">
          <p>{content.excerpt}</p>
        </CardBody>
      </div>

      <CardFooter className="pt-4 mt-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#8F9BB3]">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <time dateTime={article.updatedAt}>{article.updatedAt}</time>
        </span>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#5CA8FF] group-hover:text-white transition-colors"
        >
          <span>{lang === "en" ? "Read guide" : "Leer guía"}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}

