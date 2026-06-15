"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, Lock, Plus, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { cn, formatPrice } from "@/lib/utils";

export interface QuickOrderProduct {
  sku: string;
  name: string;
  brand: string;
  slug: string;
  tone: string;
  priceExclVat: number;
  sizes: string[];
  image?: string;
}

interface Row {
  id: number;
  sku: string;
  size: string;
  qty: number;
}

let rowSeq = 0;
function newRow(): Row {
  rowSeq += 1;
  return { id: rowSeq, sku: "", size: "", qty: 1 };
}

function GatedState() {
  const t = useTranslations("quickOrder");
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
            <Lock className="size-5 text-ink" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 font-serif text-2xl text-ink">{t("gateTitle")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("gateText")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className={cn(buttonVariants({ variant: "primary" }))}>
              {t("inloggen")}
            </Link>
            <Link
              href="/b2b-account-aanvragen"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {t("accountAanvragen")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function QuickOrder({ catalog }: { catalog: QuickOrderProduct[] }) {
  const { isApproved } = useSession();
  const { add } = useCart();
  const t = useTranslations("quickOrder");
  const [rows, setRows] = useState<Row[]>(() => [newRow(), newRow(), newRow()]);
  const [addedCount, setAddedCount] = useState<number | null>(null);

  const bySku = useMemo(() => {
    const map = new Map<string, QuickOrderProduct>();
    for (const p of catalog) map.set(p.sku.toLowerCase(), p);
    return map;
  }, [catalog]);

  if (!isApproved) return <GatedState />;

  function lookup(sku: string) {
    const key = sku.trim().toLowerCase();
    if (!key) return undefined;
    return bySku.get(key);
  }

  function updateRow(id: number, patch: Partial<Row>) {
    setAddedCount(null);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        // Reset maat als de SKU verandert en de gekozen maat niet meer bestaat.
        if (patch.sku !== undefined) {
          const product = lookup(next.sku);
          if (!product || !product.sizes.includes(next.size)) next.size = "";
        }
        return next;
      }),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, newRow()]);
  }

  function removeRow(id: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  function handleAddToCart() {
    let added = 0;
    for (const row of rows) {
      const product = lookup(row.sku);
      if (!product || !row.size || row.qty <= 0) continue;
      if (!product.sizes.includes(row.size)) continue;
      add({
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        size: row.size,
        qty: row.qty,
        unitPriceExclVat: product.priceExclVat,
        tone: product.tone,
        image: product.image,
      });
      added += 1;
    }
    setAddedCount(added);
    if (added > 0) {
      setRows([newRow(), newRow(), newRow()]);
    }
  }

  const canSubmit = rows.some((r) => {
    const product = lookup(r.sku);
    return product && r.size && product.sizes.includes(r.size) && r.qty > 0;
  });

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">{t("eyebrow")}</p>
          <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{t("intro")}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-card border border-line bg-white">
          {/* Kop (desktop) */}
          <div className="hidden grid-cols-[1fr_1fr_120px_96px_44px] gap-4 border-b border-line bg-paper/60 px-6 py-3 text-xs uppercase tracking-wider text-muted sm:grid">
            <span>{t("colArtikelnummer")}</span>
            <span>{t("colArtikel")}</span>
            <span>{t("colMaat")}</span>
            <span>{t("colAantal")}</span>
            <span className="sr-only">{t("colVerwijderen")}</span>
          </div>

          <ul className="divide-y divide-line">
            {rows.map((row) => {
              const product = lookup(row.sku);
              const unknown = row.sku.trim().length > 0 && !product;
              return (
                <li
                  key={row.id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-[1fr_1fr_120px_96px_44px] sm:items-center"
                >
                  {/* SKU */}
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-muted sm:hidden">
                      {t("colArtikelnummer")}
                    </label>
                    <input
                      type="text"
                      inputMode="text"
                      value={row.sku}
                      onChange={(e) => updateRow(row.id, { sku: e.target.value })}
                      placeholder={t("skuPlaceholder")}
                      className={cn(
                        "h-11 w-full rounded-card border bg-white px-3 text-sm text-ink placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        unknown ? "border-red-300" : "border-line focus-visible:border-ink",
                      )}
                    />
                  </div>

                  {/* Resolved naam / status */}
                  <div className="min-w-0 text-sm">
                    {product ? (
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{product.name}</p>
                        <p className="truncate text-xs text-muted">
                          {product.brand} · {formatPrice(product.priceExclVat)} {t("exclBtw")}
                        </p>
                      </div>
                    ) : unknown ? (
                      <p className="text-xs text-red-600">{t("nietGevonden")}</p>
                    ) : (
                      <p className="text-xs text-muted/70">{t("vulSku")}</p>
                    )}
                  </div>

                  {/* Maat */}
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-muted sm:hidden">
                      {t("colMaat")}
                    </label>
                    <select
                      value={row.size}
                      disabled={!product}
                      onChange={(e) => updateRow(row.id, { size: e.target.value })}
                      className="h-11 w-full rounded-card border border-line bg-white px-3 text-sm text-ink focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{t("colMaat")}</option>
                      {product?.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Aantal */}
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-muted sm:hidden">
                      {t("colAantal")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={row.qty}
                      onChange={(e) =>
                        updateRow(row.id, { qty: Math.max(1, Number(e.target.value) || 1) })
                      }
                      className="h-11 w-full rounded-card border border-line bg-white px-3 text-sm tabular-nums text-ink focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>

                  {/* Verwijderen */}
                  <div className="flex sm:justify-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      aria-label={t("regelVerwijderen")}
                      className="flex size-9 items-center justify-center rounded-card text-muted transition-colors hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="size-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-4 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              <Plus className="size-4" strokeWidth={1.75} />
              {t("regelToevoegen")}
            </button>

            <Button type="button" onClick={handleAddToCart} disabled={!canSubmit}>
              {t("toevoegenAanWinkelwagen")}
            </Button>
          </div>
        </div>

        {addedCount !== null ? (
          addedCount > 0 ? (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-line bg-white px-6 py-4 text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-ink">
                <Check className="size-4 text-accent-dark" strokeWidth={2} />
                {t("regelsToegevoegd", { count: addedCount })}
              </span>
              <Link
                href="/winkelwagen"
                className="inline-flex items-center gap-1.5 font-medium text-ink underline-offset-4 hover:underline"
              >
                {t("naarWinkelwagen")}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">{t("geenGeldigeRegels")}</p>
          )
        ) : null}
      </Container>
    </section>
  );
}
