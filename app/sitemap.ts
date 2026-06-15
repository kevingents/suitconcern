import type { MetadataRoute } from "next";
import { loadProducts } from "@/lib/catalog";
import { collections } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** XML-sitemap: publieke pagina's + collecties + producten (geen account/checkout). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    "",
    "/collecties",
    "/merken",
    "/voorraadprogramma",
    "/private-label",
    "/over-ons",
    "/contact",
    "/b2b-account-aanvragen",
    "/login",
  ].map((p) => ({ url: `${BASE}${p}`, lastModified: now, changeFrequency: "weekly" as const }));

  const cols = collections.map((c) => ({
    url: `${BASE}/collecties/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
  }));

  let products: MetadataRoute.Sitemap = [];
  try {
    products = (await loadProducts()).map((p) => ({
      url: `${BASE}/producten/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    /* val terug op alleen statische routes */
  }

  return [...staticRoutes, ...cols, ...products];
}
