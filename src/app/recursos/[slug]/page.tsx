import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResourceArticleView } from "@/components/recursos/ResourceArticleView";
import { getArticleBySlug, getPublishedArticles } from "@/content/recursos/helpers";
import { getResourcePath } from "@/content/recursos/types";

export async function generateStaticParams() {
  return getPublishedArticles().map((article) => ({
    slug: article.es.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("es", slug);
  if (!article) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const esPath = getResourcePath("es", article.es.slug);
  const enPath = getResourcePath("en", article.en.slug);

  return {
    title: article.es.seoTitle,
    description: article.es.metaDescription,
    keywords: article.es.keywords,
    alternates: {
      canonical: esPath,
      languages: {
        es: esPath,
        en: enPath,
      },
    },
    openGraph: {
      title: article.es.title,
      description: article.es.metaDescription,
      url: esPath,
      type: "article",
      locale: "es_CO",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorName],
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: article.es.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.es.title,
      description: article.es.metaDescription,
      images: ["/twitter-image"],
    },
  };
}

export default async function RecursoArticleEsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug("es", slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ResourceArticleView article={article} lang="es" />
      <Footer />
    </>
  );
}

