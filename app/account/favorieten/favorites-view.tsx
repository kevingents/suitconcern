"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("account.favorieten");
  const ta = useTranslations("account");

  if (!isApproved) {
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

  const favorites = products.filter((p) => items.includes(p.sku));

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">{ta("eyebrow")}</p>
          <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{t("intro")}</p>
        </div>

        {favorites.length === 0 ? (
          <div className="mt-12 flex max-w-md flex-col items-start rounded-card border border-line bg-white p-8 sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-full bg-paper">
              <Heart className="size-5 text-ink" strokeWidth={1.75} />
            </span>
            <h2 className="mt-6 font-serif text-xl text-ink">{t("leegTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("leegText")}</p>
            <Link
              href="/collecties"
              className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
            >
              {t("naarCollecties")}
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
