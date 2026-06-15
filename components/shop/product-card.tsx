"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useSession } from "@/lib/session";
import { ProductMedia } from "@/components/shop/product-media";
import { FavoriteButton } from "@/components/shop/favorite-button";
import { PriceDisplay } from "@/components/shop/price-display";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const { isApproved } = useSession();
  const sizes = product.variants.map((v) => v.size).join(" · ");

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-card">
        <Link href={`/producten/${product.slug}`} className="block">
          <ProductMedia
            image={product.image}
            tone={product.tone}
            label={product.name}
            category={product.collection}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.isNew ? (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-ink">
              Nieuw
            </span>
          ) : null}
          {product.bestseller ? (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-ink">
              Veel verkocht
            </span>
          ) : null}
        </div>
        <FavoriteButton sku={product.sku} className="absolute right-3 top-3" />
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-wider text-muted">{product.brand}</p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-ink">
          <Link href={`/producten/${product.slug}`} className="hover:text-accent-dark">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-muted">
          {product.color} · {product.fit}
        </p>

        {isApproved ? (
          <p className="mt-2 text-xs text-muted">
            <span className="text-ink/70">{product.sku}</span> · Maten {sizes}
          </p>
        ) : null}

        <div className="mt-3 flex items-end justify-between gap-3">
          <PriceDisplay product={product} size="sm" />
          {isApproved ? (
            <Link
              href={`/producten/${product.slug}`}
              aria-label={`${product.name} toevoegen`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "size-9 px-0")}
            >
              <Plus className="size-4" strokeWidth={1.75} />
            </Link>
          ) : (
            <Link
              href="/b2b-account-aanvragen"
              className="text-xs font-medium text-ink underline-offset-4 hover:underline"
            >
              Account aanvragen
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
