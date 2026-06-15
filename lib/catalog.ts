import "server-only";
import { cache } from "react";
import { products as mockProducts, type Product } from "@/lib/data";
import { getSrsCatalog } from "@/lib/srs/catalog";
import productImagesJson from "@/lib/data/product-images.json";

/**
 * Eén catalogus-toegangslaag voor de pagina's. Bron = SRS (branch 702 + 704)
 * wanneer geconfigureerd, anders de mock-catalogus (lib/data). Zo draait de site
 * lokaal zonder secrets en schakelt hij vanzelf over op live SRS-data in productie.
 *
 * `cache()` dedupt per request, zodat één pagina niet meerdere blob-reads doet.
 */

const PRODUCT_IMAGES = productImagesJson as Record<string, { model?: string; detail?: string }>;

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
    const srs = await getSrsCatalog();
    if (srs && srs.length) return srs;
  } catch (e) {
    console.error("[catalog] SRS-catalogus faalde — val terug op mock:", e instanceof Error ? e.message : e);
  }
  return withImages(mockProducts);
});

export const catalogSource = cache(async (): Promise<"srs" | "mock"> => {
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
