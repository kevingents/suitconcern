"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Download, Lock, Minus, Plus, ShoppingBag } from "lucide-react";
import { useSession } from "@/lib/session";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/data";

export function ProductOrderPanel({ product }: { product: Product }) {
  const { isApproved, status, discountPct, group } = useSession();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);

  const totalUnits = useMemo(
    () => Object.values(qty).reduce((sum, n) => sum + n, 0),
    [qty],
  );

  // Staffelprijs toepassen wanneer de drempel gehaald wordt.
  const baseUnit =
    product.tierPrice && totalUnits >= product.tierPrice.from
      ? product.tierPrice.priceExclVat
      : product.priceExclVat;
  const netUnit = baseUnit * (1 - discountPct / 100);
  const totalExcl = netUnit * totalUnits;
  const hasPrice = product.priceExclVat > 0;

  function setSize(size: string, value: number) {
    setQty((prev) => ({ ...prev, [size]: Math.max(0, value) }));
    setAdded(false);
  }

  // ── Niet-goedgekeurd: prijs- en voorraad-gate ──────────────────
  if (!isApproved) {
    return (
      <div className="rounded-card border border-line bg-paper p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-card bg-white text-accent-dark">
            <Lock className="size-4" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="font-serif text-lg text-ink">
              {status === "pending" ? "Account in behandeling" : "Prijzen en voorraad afgeschermd"}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {status === "pending"
                ? "Uw account wordt beoordeeld. Zodra het is goedgekeurd, ziet u prijzen, voorraad en kunt u bestellen."
                : "Log in of vraag een B2B-account aan om prijzen en voorraad te bekijken en te bestellen."}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-muted">Beschikbare maten</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <span key={v.size} className="rounded-card border border-line bg-white px-3 py-1.5 text-sm text-ink/80">
                {v.size}
              </span>
            ))}
          </div>
        </div>

        {status !== "pending" ? (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href="/login" className={cn(buttonVariants({ variant: "primary", size: "md" }), "flex-1")}>
              Inloggen voor prijs
            </Link>
            <Link href="/b2b-account-aanvragen" className={cn(buttonVariants({ variant: "outline", size: "md" }), "flex-1")}>
              Account aanvragen
            </Link>
          </div>
        ) : (
          <Link href="/account" className={cn(buttonVariants({ variant: "outline", size: "md" }), "mt-6 w-full")}>
            Naar mijn account
          </Link>
        )}
      </div>
    );
  }

  // ── Goedgekeurd: maatmatrix + prijsberekening ──────────────────
  return (
    <div className="rounded-card border border-line bg-white p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          {hasPrice ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-ink">{formatPrice(netUnit)}</span>
                {discountPct > 0 ? (
                  <span className="text-sm text-muted line-through">{formatPrice(baseUnit)}</span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-muted">per stuk · excl. btw</p>
            </>
          ) : (
            <>
              <span className="font-serif text-2xl text-ink">Prijs op aanvraag</span>
              <p className="mt-0.5 text-xs text-muted">Vraag een offerte aan voor dit artikel.</p>
            </>
          )}
        </div>
        {hasPrice && discountPct > 0 ? (
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-dark">
            {group} · {discountPct}%
          </span>
        ) : null}
      </div>

      {product.tierPrice ? (
        <p className="mt-3 rounded-card bg-paper px-3 py-2 text-xs text-muted">
          Staffel: vanaf {product.tierPrice.from} stuks {formatPrice(product.tierPrice.priceExclVat)} per stuk
          {totalUnits >= product.tierPrice.from ? " — toegepast" : ""}
        </p>
      ) : null}

      {/* Maatmatrix */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base text-ink">Maatmatrix</h3>
          <span className="text-xs text-muted">Voorraad per maat</span>
        </div>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {product.variants.map((v) => (
            <div key={v.size} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-ink">{v.size}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs",
                    v.stock > 10 ? "text-emerald-700" : v.stock > 0 ? "text-amber-700" : "text-muted",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {v.stock > 0 ? `${v.stock} op voorraad` : "Uitverkocht"}
                </span>
              </div>
              <div className="flex items-center rounded-card border border-line">
                <button
                  onClick={() => setSize(v.size, (qty[v.size] ?? 0) - 1)}
                  disabled={!qty[v.size]}
                  aria-label={`Minder maat ${v.size}`}
                  className="inline-flex size-9 items-center justify-center text-ink disabled:opacity-30"
                >
                  <Minus className="size-3.5" strokeWidth={2} />
                </button>
                <input
                  type="number"
                  min={0}
                  max={v.stock}
                  value={qty[v.size] ?? 0}
                  onChange={(e) => setSize(v.size, Math.min(v.stock, Number(e.target.value) || 0))}
                  className="w-12 border-x border-line bg-transparent py-1.5 text-center text-sm text-ink focus:outline-none"
                />
                <button
                  onClick={() => setSize(v.size, Math.min(v.stock, (qty[v.size] ?? 0) + 1))}
                  disabled={(qty[v.size] ?? 0) >= v.stock}
                  aria-label={`Meer maat ${v.size}`}
                  className="inline-flex size-9 items-center justify-center text-ink disabled:opacity-30"
                >
                  <Plus className="size-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totaal */}
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <div>
          <p className="text-sm text-muted">{totalUnits} {totalUnits === 1 ? "stuk" : "stuks"} geselecteerd</p>
          {hasPrice ? (
            <>
              <p className="font-serif text-2xl text-ink">{formatPrice(totalExcl)}</p>
              <p className="text-xs text-muted">excl. btw</p>
            </>
          ) : (
            <p className="text-sm text-muted">Prijs volgt in de offerte</p>
          )}
        </div>
        {hasPrice ? (
          <Button
            onClick={() => totalUnits > 0 && setAdded(true)}
            disabled={totalUnits === 0}
            size="lg"
          >
            {added ? <Check className="size-4" strokeWidth={2} /> : <ShoppingBag className="size-4" strokeWidth={1.75} />}
            {added ? "Toegevoegd" : "In winkelwagen"}
          </Button>
        ) : (
          <Link href="/contact" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Offerte aanvragen
          </Link>
        )}
      </div>

      {added ? (
        <p className="mt-3 text-xs text-emerald-700">
          Toegevoegd aan winkelwagen.{" "}
          <Link href="/winkelwagen" className="underline underline-offset-4">
            Bekijk winkelwagen
          </Link>
        </p>
      ) : null}

      {/* Downloads */}
      <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
        <button className="inline-flex items-center gap-2 text-sm text-ink/80 underline-offset-4 hover:text-ink hover:underline">
          <Download className="size-4" strokeWidth={1.75} />
          Productblad (PDF)
        </button>
        <button className="inline-flex items-center gap-2 text-sm text-ink/80 underline-offset-4 hover:text-ink hover:underline">
          <Download className="size-4" strokeWidth={1.75} />
          Catalogus
        </button>
      </div>
    </div>
  );
}
