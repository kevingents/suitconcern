"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { useSession } from "@/lib/session";
import { products, type Product } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";

const BTW_RATE = 0.21;
/** Indicatieve verzendkosten (excl. btw) — definitief tarief volgt bij afrekenen. */
const SHIPPING_EXCL_VAT = 9.95;

/** Demo-regels: een paar producten met een voorgeselecteerde maatverdeling. */
const DEMO_LINES: { slug: string; quantities: Record<string, number> }[] = [
  { slug: "kingsley-pak-navy", quantities: { "48": 2, "50": 3, "52": 1 } },
  { slug: "oxford-overhemd-wit", quantities: { "40": 4, "41": 4, "42": 2 } },
  { slug: "milano-colbert-antraciet", quantities: { "48": 1, "50": 2 } },
];

interface CartLine {
  product: Product;
  quantities: Record<string, number>;
}

function GatedState() {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
            <Lock className="size-5 text-ink" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 text-2xl text-ink">Log in om te bestellen</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Bestellen en prijzen zijn uitsluitend beschikbaar voor een ingelogd
            én goedgekeurd B2B-account. Vraag een account aan of log in om uw
            winkelwagen te bekijken.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className={cn(buttonVariants({ variant: "primary" }))}>
              Inloggen
            </Link>
            <Link
              href="/b2b-account-aanvragen"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Account aanvragen
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function WinkelwagenPage() {
  const { isApproved, discountPct, group } = useSession();

  const [lines, setLines] = useState<CartLine[]>(() =>
    DEMO_LINES.flatMap((line) => {
      const product = products.find((p) => p.slug === line.slug);
      return product ? [{ product, quantities: { ...line.quantities } }] : [];
    }),
  );

  function updateQty(slug: string, size: string, delta: number) {
    setLines((prev) =>
      prev.map((line) =>
        line.product.slug === slug
          ? {
              ...line,
              quantities: {
                ...line.quantities,
                [size]: Math.max(0, (line.quantities[size] ?? 0) + delta),
              },
            }
          : line,
      ),
    );
  }

  function removeLine(slug: string) {
    setLines((prev) => prev.filter((line) => line.product.slug !== slug));
  }

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => {
      const qty = Object.values(line.quantities).reduce((a, b) => a + b, 0);
      return sum + qty * line.product.priceExclVat;
    }, 0);
    const discount = subtotal * (discountPct / 100);
    const netSubtotal = subtotal - discount;
    const shipping = netSubtotal > 0 ? SHIPPING_EXCL_VAT : 0;
    const vat = (netSubtotal + shipping) * BTW_RATE;
    const total = netSubtotal + shipping + vat;
    return { subtotal, discount, netSubtotal, shipping, vat, total };
  }, [lines, discountPct]);

  if (!isApproved) return <GatedState />;

  const hasDiscount = discountPct > 0;

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">Bestellen</p>
          <h1 className="text-3xl sm:text-4xl">Winkelwagen</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Controleer uw selectie en pas de aantallen per maat aan voordat u
            naar het afrekenen gaat.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* Regels */}
          <div>
            {lines.length === 0 ? (
              <div className="flex flex-col items-center rounded-card border border-line bg-white p-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-paper">
                  <ShoppingBag className="size-5 text-ink" strokeWidth={1.75} />
                </span>
                <p className="mt-5 font-serif text-lg text-ink">Uw winkelwagen is leeg</p>
                <Link
                  href="/collecties"
                  className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
                >
                  Verder winkelen
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {lines.map((line) => {
                  const { product } = line;
                  const unitNet = product.priceExclVat * (1 - discountPct / 100);
                  const lineQty = Object.values(line.quantities).reduce(
                    (a, b) => a + b,
                    0,
                  );
                  const lineTotal = lineQty * unitNet;

                  return (
                    <li
                      key={product.slug}
                      className="rounded-card border border-line bg-white p-5"
                    >
                      <div className="flex gap-5">
                        <Link
                          href={`/producten/${product.slug}`}
                          className="block w-20 shrink-0 overflow-hidden rounded-card"
                        >
                          <PlaceholderImage tone={product.tone} ratio="aspect-[4/5]" />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-wider text-muted">
                                {product.brand}
                              </p>
                              <h2 className="mt-0.5 font-serif text-lg leading-snug text-ink">
                                <Link
                                  href={`/producten/${product.slug}`}
                                  className="hover:text-accent-dark"
                                >
                                  {product.name}
                                </Link>
                              </h2>
                              <p className="mt-0.5 text-xs text-muted">
                                <span className="text-ink/70">{product.sku}</span> ·{" "}
                                {product.color} · {product.fit}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeLine(product.slug)}
                              aria-label={`${product.name} verwijderen`}
                              className="shrink-0 rounded-card p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
                            >
                              <Trash2 className="size-4" strokeWidth={1.75} />
                            </button>
                          </div>

                          {/* Maatverdeling */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {Object.entries(line.quantities).map(([size, qty]) => (
                              <div
                                key={size}
                                className="flex items-center gap-2 rounded-card border border-line px-2 py-1.5"
                              >
                                <span className="w-8 text-center text-xs font-medium text-ink">
                                  {size}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => updateQty(product.slug, size, -1)}
                                    aria-label={`Maat ${size} verlagen`}
                                    className="flex size-6 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-40"
                                    disabled={qty === 0}
                                  >
                                    <Minus className="size-3" strokeWidth={2} />
                                  </button>
                                  <span className="w-6 text-center text-sm tabular-nums text-ink">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQty(product.slug, size, 1)}
                                    aria-label={`Maat ${size} verhogen`}
                                    className="flex size-6 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
                                  >
                                    <Plus className="size-3" strokeWidth={2} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Regelprijs */}
                          <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
                            <div className="text-xs text-muted">
                              {lineQty} {lineQty === 1 ? "stuk" : "stuks"} ·{" "}
                              <span className="text-ink/70">{formatPrice(unitNet)}</span> p/st
                              {hasDiscount ? (
                                <span className="ml-1 text-muted line-through">
                                  {formatPrice(product.priceExclVat)}
                                </span>
                              ) : null}
                            </div>
                            <span className="font-medium text-ink">
                              {formatPrice(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="mt-6 text-xs text-muted">
              Demo-winkelwagen — nog niet gekoppeld aan backend.
            </p>
          </div>

          {/* Besteloverzicht */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line bg-white p-6">
              <h2 className="font-serif text-xl text-ink">Overzicht</h2>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotaal (excl. btw)</dt>
                  <dd className="tabular-nums text-ink">{formatPrice(totals.subtotal)}</dd>
                </div>
                {hasDiscount ? (
                  <div className="flex justify-between">
                    <dt className="text-muted">
                      {group}-korting · {discountPct}%
                    </dt>
                    <dd className="tabular-nums text-accent-dark">
                      − {formatPrice(totals.discount)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted">Verzendkosten</dt>
                  <dd className="tabular-nums text-ink">
                    {totals.shipping > 0 ? formatPrice(totals.shipping) : "Wordt berekend"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Btw 21%</dt>
                  <dd className="tabular-nums text-ink">{formatPrice(totals.vat)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base">
                  <dt className="font-medium text-ink">Totaal (incl. btw)</dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {formatPrice(totals.total)}
                  </dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "mt-7 w-full",
                  lines.length === 0 && "pointer-events-none opacity-50",
                )}
                aria-disabled={lines.length === 0}
              >
                Naar afrekenen
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/collecties"
                className="mt-4 block text-center text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Verder winkelen
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
