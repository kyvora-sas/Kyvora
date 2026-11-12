import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResourceArticleView } from "@/components/recursos/ResourceArticleView";
import { getArticleBySlug, getPublishedArticles } from "@/content/recursos/helpers";
import { getResourcePath } from "@/content/recursos/types";

export async function generateStaticParams() {
  return getPublishedArticles().map((article) => ({
    slug: article.en.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("en", slug);
  if (!article) {
    return {
      title: "Article not found",
    };
  }

  const esPath = getResourcePath("es", article.es.slug);
  const enPath = getResourcePath("en", article.en.slug);

  return {
    title: article.en.seoTitle,
    description: article.en.metaDescription,
    keywords: article.en.keywords,
    alternates: {
      canonical: enPath,
      languages: {
        es: esPath,
        en: enPath,
      },
    },
    openGraph: {
      title: article.en.title,
      description: article.en.metaDescription,
      url: enPath,
      type: "article",
      locale: "en_US",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorName],
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: article.en.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.en.title,
      description: article.en.metaDescription,
      images: ["/twitter-image"],
    },
  };
}

export default async function RecursoArticleEnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug("en", slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ResourceArticleView article={article} lang="en" />
      <Footer />
    </>
  );
}

