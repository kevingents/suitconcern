import "server-only";
import { readSuitconcernSnapshots, snapshotConfigured, type SnapshotRow } from "@/lib/srs/snapshot";
import { loadPriceList, priceForSku } from "@/lib/pricing";
import productImagesJson from "@/lib/data/product-images.json";
import type { Product, ProductVariant } from "@/lib/data";

/**
 * Bouwt de Suitconcern-productcatalogus uit de SRS branch-snapshots
 * (702 verkoop + 704 magazijn). Geaggregeerd op SKU, met voorraad per maat
 * (som over kleuren én beide filialen).
 *
 * Prijzen komen NIET uit SRS-stock: we nemen de groothandel-prijslijst (tool),
 * met SRS unitPrice als seed waar beschikbaar; anders 0 = "prijs op aanvraag".
 * Afbeeldingen komen uit de eigen mapping (fashn.ai output), NOOIT uit SRS.
 */

const PRODUCT_IMAGES = productImagesJson as Record<string, { model?: string; detail?: string }>;

// Vaste, rustige gradient-tonen voor de placeholder zolang er geen eigen beeld is.
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

function slugify(s: string): string {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // combineer-diacrieten verwijderen
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Heuristische indeling op titel → collectie-slug (gevalideerd zodra SRS live is). */
function classifyCollection(title: string): string {
  const t = title.toLowerCase();
  if (/(smoking|tuxedo|tux)/.test(t)) return "smokings";
  if (/(gilet|waistcoat|vest)/.test(t)) return "gilets";
  if (/(colbert|blazer|jasje|sako)/.test(t)) return "colberts";
  if (/(overhemd|shirt|hemd)/.test(t)) return "overhemden";
  if (/(pak|kostuum|suit|broek|pantalon)/.test(t)) return "pakken";
  if (/(das|stropdas|strik|pochet|bretel|riem|manchet|sjaal|sok)/.test(t)) return "accessoires";
  return "pakken";
}

type Group = {
  sku: string;
  title: string;
  colors: Set<string>;
  unitPrice?: number;
  bySize: Map<string, number>;
};

function aggregate(rows: SnapshotRow[]): Group[] {
  const groups = new Map<string, Group>();
  for (const r of rows) {
    const sku = String(r.sku || r.barcode || "").trim();
    if (!sku) continue;
    let g = groups.get(sku);
    if (!g) {
      g = { sku, title: "", colors: new Set(), unitPrice: undefined, bySize: new Map() };
      groups.set(sku, g);
    }
    if (!g.title && r.title) g.title = r.title;
    if (r.color) g.colors.add(r.color);
    if (g.unitPrice === undefined && Number(r.unitPrice) > 0) g.unitPrice = Number(r.unitPrice);
    const size = r.size || "One size";
    g.bySize.set(size, (g.bySize.get(size) || 0) + (Number(r.pieces) || 0));
  }
  return Array.from(groups.values());
}

/**
 * De volledige SRS-catalogus als Product[], of null wanneer niet geconfigureerd
 * of leeg (zodat de aanroeper terugvalt op de mock-catalogus).
 */
export async function getSrsCatalog(): Promise<Product[] | null> {
  if (!snapshotConfigured()) return null;

  const { verkoop, magazijn } = await readSuitconcernSnapshots();
  const allRows = [...verkoop.rows, ...magazijn.rows];
  if (!allRows.length) return null;

  const priceList = await loadPriceList();
  const groups = aggregate(allRows);
  const usedSlugs = new Set<string>();

  const products: Product[] = groups.map((g) => {
    const name = g.title || g.sku;
    let slug = slugify(name) || slugify(g.sku);
    if (usedSlugs.has(slug)) slug = `${slug}-${slugify(g.sku)}`.slice(0, 70);
    usedSlugs.add(slug);

    const colors = Array.from(g.colors);
    const color = colors.length === 1 ? colors[0] : colors.length > 1 ? `${colors.length} kleuren` : "—";

    const variants: ProductVariant[] = Array.from(g.bySize.entries())
      .map(([size, stock]) => ({ size, stock }))
      .sort((a, b) => a.size.localeCompare(b.size, "nl", { numeric: true }));

    const price = priceForSku(priceList, g.sku) ?? g.unitPrice ?? 0;
    const imgs = PRODUCT_IMAGES[g.sku];

    return {
      slug,
      name,
      sku: g.sku,
      brand: "",
      collection: classifyCollection(name),
      color,
      fit: "Modern fit",
      priceExclVat: price,
      tone: TONES[hash(g.sku) % TONES.length],
      image: imgs?.model || undefined,
      detailImage: imgs?.detail || undefined,
      variants,
      bestseller: false,
    } satisfies Product;
  });

  // Stabiele volgorde: meeste voorraad eerst.
  products.sort(
    (a, b) =>
      b.variants.reduce((s, v) => s + v.stock, 0) - a.variants.reduce((s, v) => s + v.stock, 0) ||
      a.name.localeCompare(b.name, "nl"),
  );
  return products;
}
