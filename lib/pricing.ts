import "server-only";
import { list } from "@vercel/blob";
import priceListSeed from "@/lib/data/price-list.json";

/**
 * Groothandel-prijslijst "in de tool" (config in de tool, niet in env).
 *
 * Bron van waarheid: blob `suitconcern/price-list.json` ({ prices: { sku: euro } }),
 * bewerkt via de admin-UI (volgt). Het lokale bestand lib/data/price-list.json is
 * de seed/fallback. Prijzen zijn EXCL. btw; klantgroep-korting komt er los
 * overheen (zie lib/session + components/shop/price-display).
 *
 * Heeft een SKU geen prijs in de lijst, dan seeden we (in de catalogus) met de
 * SRS unitPrice indien aanwezig; ontbreekt ook die, dan "prijs op aanvraag".
 */

export type PriceList = Record<string, number>;

const BLOB_PATH = "suitconcern/price-list.json";
const TTL_MS = 5 * 60 * 1000;

let _cache: { at: number; data: PriceList } | null = null;
let _inflight: Promise<PriceList> | null = null;

function seedPrices(): PriceList {
  const raw = (priceListSeed as { prices?: Record<string, unknown> })?.prices ?? {};
  const out: PriceList = {};
  for (const [sku, value] of Object.entries(raw)) {
    const n = Number(value);
    if (sku && Number.isFinite(n) && n > 0) out[sku.trim()] = n;
  }
  return out;
}

function blobToken(): string | undefined {
  return process.env.STOREGENTS_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || undefined;
}

async function fetchBlobPrices(): Promise<PriceList> {
  const token = blobToken();
  if (!token) return {};
  try {
    const result = await list({ prefix: BLOB_PATH, limit: 1, token });
    const blob = result.blobs.find((b) => b.pathname === BLOB_PATH);
    if (!blob) return {};
    const res = await fetch(`${blob.url}?_=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return {};
    const data = (await res.json()) as { prices?: Record<string, unknown> };
    const out: PriceList = {};
    for (const [sku, value] of Object.entries(data?.prices ?? {})) {
      const n = Number(value);
      if (sku && Number.isFinite(n) && n > 0) out[sku.trim()] = n;
    }
    return out;
  } catch {
    return {};
  }
}

/** Volledige prijslijst (blob-override over de seed). 5-min proces-cache. */
export async function loadPriceList(): Promise<PriceList> {
  if (_cache && Date.now() - _cache.at < TTL_MS) return _cache.data;
  if (_inflight) return _inflight;
  _inflight = fetchBlobPrices()
    .then((blobPrices) => {
      const data = { ...seedPrices(), ...blobPrices };
      _cache = { at: Date.now(), data };
      return data;
    })
    .finally(() => {
      _inflight = null;
    });
  return _inflight;
}

/** Basisprijs (excl. btw) voor een SKU, of undefined als niet ingesteld. */
export function priceForSku(list: PriceList, sku: string): number | undefined {
  const v = list[String(sku || "").trim()];
  return Number.isFinite(v) && v > 0 ? v : undefined;
}
