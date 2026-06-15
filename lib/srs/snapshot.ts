import "server-only";
import { list } from "@vercel/blob";

/**
 * Leest de SRS stock-snapshot voor de Suitconcern-filialen uit de (storegents)
 * Vercel-blobstore. Blob-layout (geschreven door storegents):
 *   srs-stock-snapshot/branch-702.json   (verkoop)
 *   srs-stock-snapshot/branch-704.json   (magazijn)
 * Rij-formaat: { barcode, sku, pieces, title, color, size, articleNumber?, unitPrice?, updatedAt }
 *
 * Dit is de leesbron voor de catalogus (zie lib/srs/catalog.ts) — geen live
 * SOAP per request. Token: STOREGENTS_BLOB_READ_WRITE_TOKEN (of BLOB_READ_WRITE_TOKEN).
 */

export const BRANCH_VERKOOP = process.env.SUITCONCERN_BRANCH_VERKOOP || "702";
export const BRANCH_MAGAZIJN = process.env.SUITCONCERN_BRANCH_MAGAZIJN || "704";

export type SnapshotRow = {
  barcode: string;
  sku: string;
  pieces: number;
  title: string;
  color: string;
  size: string;
  articleNumber?: string;
  unitPrice?: number;
  updatedAt?: string;
};

export type BranchSnapshot = { branchId: string; rows: SnapshotRow[]; updatedAt: string | null };

const TTL_MS = 5 * 60 * 1000;

function blobToken(): string | undefined {
  return process.env.STOREGENTS_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || undefined;
}

export function snapshotConfigured(): boolean {
  return Boolean(blobToken());
}

const _cache = new Map<string, { at: number; data: BranchSnapshot }>();
const _inflight = new Map<string, Promise<BranchSnapshot>>();

function normalizeRow(r: Record<string, unknown>): SnapshotRow | null {
  const barcode = String(r?.barcode ?? "").trim();
  const sku = String(r?.sku ?? barcode).trim();
  if (!sku && !barcode) return null;
  return {
    barcode,
    sku: sku || barcode,
    pieces: Number(r?.pieces) || 0,
    title: String(r?.title ?? "").trim(),
    color: String(r?.color ?? "").trim(),
    size: String(r?.size ?? "").trim(),
    articleNumber: String(r?.articleNumber ?? "").trim() || undefined,
    unitPrice: Number.isFinite(Number(r?.unitPrice)) ? Number(r?.unitPrice) : undefined,
    updatedAt: String(r?.updatedAt ?? "").trim() || undefined,
  };
}

async function fetchBranch(branchId: string): Promise<BranchSnapshot> {
  const empty: BranchSnapshot = { branchId, rows: [], updatedAt: null };
  const token = blobToken();
  if (!token) return empty;

  const path = `srs-stock-snapshot/branch-${branchId}.json`;
  const result = await list({ prefix: path, limit: 1, token });
  const blob = result.blobs.find((b) => b.pathname === path);
  if (!blob) return empty;

  const res = await fetch(`${blob.url}?_=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return empty;
  const data = (await res.json()) as { rows?: unknown[]; updatedAt?: string };
  const rows = Array.isArray(data?.rows)
    ? (data.rows.map((r) => normalizeRow(r as Record<string, unknown>)).filter(Boolean) as SnapshotRow[])
    : [];
  return { branchId, rows, updatedAt: data?.updatedAt ?? null };
}

/** Branch-snapshot met 5-min proces-cache. Faalt zacht naar een lege snapshot. */
export async function readBranchSnapshot(branchId: string): Promise<BranchSnapshot> {
  const cached = _cache.get(branchId);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;
  const existing = _inflight.get(branchId);
  if (existing) return existing;

  const p = fetchBranch(branchId)
    .catch((): BranchSnapshot => ({ branchId, rows: [], updatedAt: null }))
    .then((data) => {
      _cache.set(branchId, { at: Date.now(), data });
      return data;
    })
    .finally(() => _inflight.delete(branchId));
  _inflight.set(branchId, p);
  return p;
}

/** Beide Suitconcern-filialen (verkoop 702 + magazijn 704). */
export async function readSuitconcernSnapshots(): Promise<{ verkoop: BranchSnapshot; magazijn: BranchSnapshot }> {
  const [verkoop, magazijn] = await Promise.all([
    readBranchSnapshot(BRANCH_VERKOOP),
    readBranchSnapshot(BRANCH_MAGAZIJN),
  ]);
  return { verkoop, magazijn };
}
