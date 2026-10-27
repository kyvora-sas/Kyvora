import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
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

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.6,
  }));
}
