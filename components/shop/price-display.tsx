"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useSession } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

/**
 * Toont prijzen uitsluitend voor een ingelogd én goedgekeurd account.
 * Past automatisch de klantkorting (klantgroep) toe en toont staffelprijs.
 * Gasten en pending-accounts zien een login-/aanvraag-CTA.
 */
export function PriceDisplay({
  product,
  size = "md",
}: {
  product: Pick<Product, "priceExclVat" | "tierPrice">;
  size?: "sm" | "md" | "lg";
}) {
  const { isApproved, discountPct, group } = useSession();

  if (!isApproved) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Lock className="size-3.5 shrink-0" strokeWidth={1.75} />
        <Link href="/login" className="font-medium text-ink underline-offset-4 hover:underline">
          Log in voor prijs
        </Link>
      </div>
    );
  }

  if (!product.priceExclVat || product.priceExclVat <= 0) {
    return (
      <div className="text-sm">
        <span className="font-medium text-ink">Prijs op aanvraag</span>
        <Link
          href="/contact"
          className="ml-2 text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Offerte aanvragen
        </Link>
      </div>
    );
  }

  const net = product.priceExclVat * (1 - discountPct / 100);
  const hasDiscount = discountPct > 0;

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-medium text-ink",
            size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl",
          )}
        >
          {formatPrice(net)}
        </span>
        {hasDiscount ? (
          <span className="text-sm text-muted line-through">
            {formatPrice(product.priceExclVat)}
          </span>
        ) : null}
        <span className="text-xs text-muted">excl. btw</span>
      </div>
      {hasDiscount ? (
        <p className="mt-0.5 text-xs text-accent-dark">
          {group}-korting · {discountPct}%
        </p>
      ) : null}
      {product.tierPrice ? (
        <p className="mt-0.5 text-xs text-muted">
          Vanaf {product.tierPrice.from} st. {formatPrice(product.tierPrice.priceExclVat)} p/st
        </p>
      ) : null}
    </div>
  );
}
