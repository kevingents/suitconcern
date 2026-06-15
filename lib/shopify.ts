import "server-only";
import { loadPriceList, priceForSku } from "@/lib/pricing";
import type { Product, ProductVariant } from "@/lib/data";

/**
 * Productcatalogus uit de Shopify-master (rijke data: titel, maat, kleur, SKU).
 * Suitconcern toont GEEN Shopify-/GENTS-fotografie en NOOIT het "GENTS"-merk —
 * alleen de garment-data. Beeld komt uit de eigen mapping (fashn) of de illustratie;
 * prijzen uit de eigen prijslijst (met de Shopify-prijs als indicatieve seed).
 *
 * Activeren met SHOPIFY_SHOP_DOMAIN + SHOPIFY_ADMIN_ACCESS_TOKEN (Vercel-env).
 * Zonder die env valt de catalogus terug op SRS/mock.
 */

const API_VERSION = "2024-10";
const PER_COLLECTION = 40;
const MAX_PER_CATEGORY = 18;
const TTL_MS = 10 * 60 * 1000;

// Onze collectie-slug → Shopify-collection-handles (mannen, formele categorieën).
const COLLECTION_HANDLES: Record<string, string[]> = {
  pakken: ["pakken"],
  smokings: ["smoking", "smoking-black-tie", "dinner-jacket"],
  colberts: ["colberts"],
  gilets: ["gilets"],
  overhemden: ["overhemden", "business-overhemden", "basic-overhemden"],
  accessoires: ["stropdassen", "strikken", "pochets", "bretels", "manchetknopen", "riemen"],
};

const TONES = [
  "from-slate-800 to-slate-950",
  "from-neutral-800 to-black",
  "from-stone-700 to-stone-900",
  "from-zinc-900 to-black",
  "from-neutral-700 to-neutral-900",
  "from-slate-700 to-slate-900",
];
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function shopifyConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_SHOP_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN);
}

type ShopifyVariant = { sku?: string; barcode?: string; option1?: string; option2?: string; price?: string; inventory_quantity?: number };
type ShopifyProduct = { id: number; title: string; handle: string; tags?: string; vendor?: string; options?: { name: string }[]; variants?: ShopifyVariant[] };

async function shop<T>(path: string): Promise<T> {
  const domain = process.env.SHOPIFY_SHOP_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string;
  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/${path}`, {
    headers: { "X-Shopify-Access-Token": token },
    // Cacheable (ISR) i.p.v. no-store, zodat catalogus-pagina's statisch
    // geprerenderd kunnen worden en elke 10 min verversen.
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`Shopify ${path}: ${res.status}`);
  return (await res.json()) as T;
}

async function handleToId(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  for (const kind of ["smart_collections", "custom_collections"] as const) {
    const data = await shop<Record<string, { id: number; handle: string }[]>>(`${kind}.json?limit=250&fields=id,handle`);
    for (const c of data[kind] || []) map.set(c.handle, c.id);
  }
  return map;
}

const EXCLUDE = /dames|women|female|meisje|girl/i;

/** Verwijder elke "GENTS"-vermelding uit zichtbare tekst (merkregel). */
function stripGents(s: string): string {
  return String(s || "").replace(/\bgents\b/gi, "").replace(/\s{2,}/g, " ").trim();
}

function mapProduct(p: ShopifyProduct, collection: string, priceList: Record<string, number>): Product | null {
  const variants = p.variants || [];
  if (!variants.length) return null;

  const colors = [...new Set(variants.map((v) => (v.option1 || "").trim()).filter(Boolean))];
  const bySize = new Map<string, number>();
  for (const v of variants) {
    const size = (v.option2 || v.option1 || "One size").trim() || "One size";
    bySize.set(size, (bySize.get(size) || 0) + Math.max(0, Number(v.inventory_quantity) || 0));
  }
  const productVariants: ProductVariant[] = [...bySize.entries()]
    .map(([size, stock]) => ({ size, stock }))
    .sort((a, b) => a.size.localeCompare(b.size, "nl", { numeric: true }));

  const sku = (variants.find((v) => v.sku)?.sku || p.handle).trim();
  const shopPrice = Number(variants.find((v) => Number(v.price) > 0)?.price || 0);
  const seedExcl = shopPrice > 0 ? Math.round(shopPrice / 1.21) : 0; // indicatieve excl-btw seed
  const price = priceForSku(priceList, sku) ?? seedExcl;

  const slug = p.handle.toLowerCase().replace(/gents/gi, "").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "") || p.handle;

  return {
    slug,
    name: stripGents(p.title) || "Artikel",
    sku,
    brand: "", // NOOIT "GENTS"; echte merknaam is niet betrouwbaar beschikbaar
    collection,
    color: colors.length === 1 ? colors[0] : colors.length > 1 ? `${colors.length} kleuren` : "—",
    fit: "Modern fit",
    priceExclVat: price,
    tone: TONES[hash(sku || p.handle) % TONES.length],
    variants: productVariants,
    bestseller: false,
  } satisfies Product;
}

let _cache: { at: number; data: Product[] } | null = null;
let _inflight: Promise<Product[]> | null = null;

async function build(): Promise<Product[]> {
  const ids = await handleToId();
  const priceList = await loadPriceList();
  const out: Product[] = [];
  const seenSlugs = new Set<string>();

  for (const [slug, handles] of Object.entries(COLLECTION_HANDLES)) {
    const byId = new Map<number, ShopifyProduct>();
    for (const handle of handles) {
      const id = ids.get(handle);
      if (!id) continue;
      try {
        const data = await shop<{ products: ShopifyProduct[] }>(
          `products.json?collection_id=${id}&limit=${PER_COLLECTION}&fields=id,title,handle,tags,vendor,options,variants`,
        );
        for (const p of data.products || []) byId.set(p.id, p);
      } catch (e) {
        console.error(`[shopify] collectie ${handle} faalde:`, e instanceof Error ? e.message : e);
      }
    }
    const mapped = [...byId.values()]
      .filter((p) => !EXCLUDE.test(`${p.title} ${p.tags || ""}`))
      .map((p) => mapProduct(p, slug, priceList))
      .filter((p): p is Product => Boolean(p) && p!.variants.length > 0)
      .filter((p) => !seenSlugs.has(p.slug))
      .sort((a, b) => b.variants.reduce((s, v) => s + v.stock, 0) - a.variants.reduce((s, v) => s + v.stock, 0))
      .slice(0, MAX_PER_CATEGORY);
    for (const p of mapped) seenSlugs.add(p.slug);
    out.push(...mapped);
  }
  return out;
}

/** Volledige Shopify-catalogus als Product[], of null bij geen config/fout/leeg. */
export async function getShopifyCatalog(): Promise<Product[] | null> {
  if (!shopifyConfigured()) return null;
  if (_cache && Date.now() - _cache.at < TTL_MS) return _cache.data;
  if (_inflight) return _inflight;
  _inflight = build()
    .then((data) => {
      _cache = { at: Date.now(), data };
      return data;
    })
    .catch((e) => {
      console.error("[shopify] catalogus-build faalde:", e instanceof Error ? e.message : e);
      return [];
    })
    .finally(() => {
      _inflight = null;
    });
  const result = await _inflight;
  return result.length ? result : null;
}
