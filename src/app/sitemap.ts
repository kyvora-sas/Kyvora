import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedArticles } from "@/content/recursos/helpers";
import { getResourcePath } from "@/content/recursos/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/legal/datos-personales",
    "/legal/privacidad",
    "/legal/terminos",
    "/legal/contratacion",
    "/legal/pagos-reversiones",
    "/legal/pqrs",
    "/legal/cookies",
    "/legal/donate",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.6,
  }));

  const resourceHubEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/recursos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/recursos/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  const articleEntries: MetadataRoute.Sitemap = getPublishedArticles().flatMap((article) => {
    const lastMod = new Date(`${article.updatedAt}T12:00:00Z`);
    return [
      {
        url: `${siteConfig.url}${getResourcePath("es", article.es.slug)}`,
        lastModified: lastMod,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      },
      {
        url: `${siteConfig.url}${getResourcePath("en", article.en.slug)}`,
        lastModified: lastMod,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      },
    ];
  });

  return [...staticEntries, ...resourceHubEntries, ...articleEntries];
}
