"use client";

import Link from "next/link";
import { ArrowRight, Heart, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { useFavorites } from "@/lib/favorites";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

export function FavoritesView({ products }: { products: Product[] }) {
  const { isApproved } = useSession();
  const { items } = useFavorites();

  if (!isApproved) {
    return (
      <section className="bg-paper py-24 lg:py-32">
        <Container>
          <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
              <Lock className="size-5 text-ink" strokeWidth={1.75} />
            </span>
            <h1 className="mt-6 font-serif text-2xl text-ink">Log in voor uw favorieten</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Bewaar artikelen als favoriet voor een snelle herbestelling. Log in
              met uw goedgekeurde B2B-account of vraag er een aan.
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

  const favorites = products.filter((p) => items.includes(p.sku));

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">Mijn account</p>
          <h1 className="text-3xl sm:text-4xl">Favorieten</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Uw opgeslagen artikelen voor een snelle herbestelling.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="mt-12 flex max-w-md flex-col items-start rounded-card border border-line bg-white p-8 sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-full bg-paper">
              <Heart className="size-5 text-ink" strokeWidth={1.75} />
            </span>
            <h2 className="mt-6 font-serif text-xl text-ink">Nog geen favorieten</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Markeer artikelen met het hartje om ze hier terug te vinden.
            </p>
            <Link
              href="/collecties"
              className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
            >
              Naar de collecties
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {favorites.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
