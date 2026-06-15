"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { ProductMedia } from "@/components/shop/product-media";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { cn, formatPrice } from "@/lib/utils";

const BTW_RATE = 0.21;

function GatedState() {
  const t = useTranslations("cart");
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
            <Lock className="size-5 text-ink" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 text-2xl text-ink">{t("gateTitle")}</h1>
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

export default function WinkelwagenPage() {
  const { isApproved, discountPct, group } = useSession();
  const { items, setQty, remove, subtotalExclVat } = useCart();
  const t = useTranslations("cart");

  const totals = useMemo(() => {
    const subtotal = subtotalExclVat;
    const discount = subtotal * (discountPct / 100);
    const netSubtotal = subtotal - discount;
    const vat = netSubtotal * BTW_RATE;
    const total = netSubtotal + vat;
    return { subtotal, discount, netSubtotal, vat, total };
  }, [subtotalExclVat, discountPct]);

  if (!isApproved) return <GatedState />;

  const hasDiscount = discountPct > 0;

  if (items.length === 0) {
    return (
      <section className="bg-paper py-24 lg:py-32">
        <Container>
          <div className="mx-auto flex max-w-md flex-col items-center rounded-card border border-line bg-white p-10 text-center sm:p-12">
            <span className="flex size-12 items-center justify-center rounded-full bg-paper">
              <ShoppingBag className="size-5 text-ink" strokeWidth={1.75} />
            </span>
            <h1 className="mt-6 font-serif text-2xl text-ink">{t("leegTitle")}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("leegText")}</p>
            <Link
              href="/collecties"
              className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
            >
              {t("naarCollecties")}
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">{t("eyebrow")}</p>
          <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{t("intro")}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* Regels */}
          <div>
            <ul className="space-y-4">
              {items.map((item) => {
                const unitNet = item.unitPriceExclVat * (1 - discountPct / 100);
                const lineTotal = unitNet * item.qty;
                const originalTotal = item.unitPriceExclVat * item.qty;

                return (
                  <li
                    key={`${item.sku}__${item.size}`}
                    className="rounded-card border border-line bg-white p-5"
                  >
                    <div className="flex gap-5">
                      <Link
                        href={`/producten/${item.slug}`}
                        className="block w-20 shrink-0 overflow-hidden rounded-card"
                        aria-label={item.name}
                      >
                        <ProductMedia
                          image={item.image}
                          tone={item.tone}
                          label={item.name}
                          ratio="aspect-[4/5]"
                          sizes="80px"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wider text-muted">
                              {item.brand}
                            </p>
                            <h2 className="mt-0.5 font-serif text-lg leading-snug text-ink">
                              <Link
                                href={`/producten/${item.slug}`}
                                className="hover:text-accent-dark"
                              >
                                {item.name}
                              </Link>
                            </h2>
                            <p className="mt-0.5 text-xs text-muted">
                              <span className="text-ink/70">{item.sku}</span> · {t("maat")}{" "}
                              {item.size}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(item.sku, item.size)}
                            aria-label={t("verwijderen", { name: item.name })}
                            className="shrink-0 rounded-card p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
                          >
                            <Trash2 className="size-4" strokeWidth={1.75} />
                          </button>
                        </div>

                        {/* Aantal + regelprijs */}
                        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setQty(item.sku, item.size, item.qty - 1)
                              }
                              aria-label={t("aantalVerlagen")}
                              className="flex size-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
                            >
                              <Minus className="size-3.5" strokeWidth={2} />
                            </button>
                            <span className="w-8 text-center text-sm tabular-nums text-ink">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQty(item.sku, item.size, item.qty + 1)
                              }
                              aria-label={t("aantalVerhogen")}
                              className="flex size-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
                            >
                              <Plus className="size-3.5" strokeWidth={2} />
                            </button>
                          </div>

                          <div className="text-right">
                            {hasDiscount ? (
                              <span className="mr-2 text-xs text-muted line-through tabular-nums">
                                {formatPrice(originalTotal)}
                              </span>
                            ) : null}
                            <span className="font-medium text-ink tabular-nums">
                              {formatPrice(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-xs text-muted">{t("prijsExclNote")}</p>
          </div>

          {/* Besteloverzicht */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line bg-white p-6">
              <h2 className="font-serif text-xl text-ink">{t("overzicht")}</h2>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">{t("subtotaal")}</dt>
                  <dd className="tabular-nums text-ink">{formatPrice(totals.subtotal)}</dd>
                </div>
                {hasDiscount ? (
                  <div className="flex justify-between">
                    <dt className="text-muted">
                      {t("klantkorting", { group: group ?? "", pct: discountPct })}
                    </dt>
                    <dd className="tabular-nums text-accent-dark">
                      − {formatPrice(totals.discount)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted">{t("btw")}</dt>
                  <dd className="tabular-nums text-ink">{formatPrice(totals.vat)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base">
                  <dt className="font-medium text-ink">{t("totaal")}</dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {formatPrice(totals.total)}
                  </dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-7 w-full")}
              >
                {t("naarAfrekenen")}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/collecties"
                className="mt-4 block text-center text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                {t("verderWinkelen")}
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
