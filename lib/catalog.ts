import "server-only";
import { cache } from "react";
import { products as mockProducts, type Product } from "@/lib/data";
import { getShopifyCatalog } from "@/lib/shopify";
import { getSrsCatalog } from "@/lib/srs/catalog";
import productImagesJson from "@/lib/data/product-images.json";
import catalogSnapshotJson from "@/lib/data/catalog-snapshot.json";

/**
 * Eén catalogus-toegangslaag voor de pagina's. Bronvolgorde:
 *   1. Live Shopify (wanneer SHOPIFY_*-env aanwezig is)
 *   2. Statische snapshot (lib/data/catalog-snapshot.json) — de echte catalogus
 *      die in de repo is gebakken, zodat de site ook op Vercel zonder Shopify-env
 *      echte producten + eigen beeld toont. Regenereren met de snapshot-route.
 *   3. SRS (branch 702 + 704) wanneer geconfigureerd
 *   4. Mock-catalogus (lib/data)
 *
 * `cache()` dedupt per request, zodat één pagina niet meerdere blob-reads doet.
 */

const PRODUCT_IMAGES = productImagesJson as Record<string, { model?: string; detail?: string }>;
const CATALOG_SNAPSHOT = catalogSnapshotJson as Product[];

/** Plak eigen Suitconcern-beeld (fashn.ai: model + detail) op de mock-producten. */
function withImages(list: Product[]): Product[] {
  return list.map((p) => {
    const imgs = PRODUCT_IMAGES[p.sku];
    if (!imgs) return p;
    return {
      ...p,
      image: p.image ?? imgs.model ?? undefined,
      detailImage: p.detailImage ?? imgs.detail ?? undefined,
    };
  });
}

export const loadProducts = cache(async (): Promise<Product[]> => {
  try {
    const shop = await getShopifyCatalog();
    if (shop && shop.length) return withImages(shop);
  } catch (e) {
    console.error("[catalog] Shopify-catalogus faalde:", e instanceof Error ? e.message : e);
  }
  if (CATALOG_SNAPSHOT.length) return withImages(CATALOG_SNAPSHOT);
  try {
    const srs = await getSrsCatalog();
    if (srs && srs.length) return withImages(srs);
  } catch (e) {
    console.error("[catalog] SRS-catalogus faalde:", e instanceof Error ? e.message : e);
  }
  return withImages(mockProducts);
});

export const catalogSource = cache(async (): Promise<"shopify" | "snapshot" | "srs" | "mock"> => {
  try {
    const shop = await getShopifyCatalog();
    if (shop && shop.length) return "shopify";
  } catch {
    /* val terug */
  }
  if (CATALOG_SNAPSHOT.length) return "snapshot";
  try {
    const srs = await getSrsCatalog();
    if (srs && srs.length) return "srs";
  } catch {
    /* val terug */
  }
  return "mock";
});

export async function loadProduct(slug: string): Promise<Product | undefined> {
  return (await loadProducts()).find((p) => p.slug === slug);
}

export async function loadProductsByCollection(slug: string): Promise<Product[]> {
  return (await loadProducts()).filter((p) => p.collection === slug);
}

export async function loadBestsellers(limit = 4): Promise<Product[]> {
  const all = await loadProducts();
  const flagged = all.filter((p) => p.bestseller);
  return (flagged.length ? flagged : all).slice(0, limit);
}
