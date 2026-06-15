import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Lock, PackageOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";
import { cn, formatPrice } from "@/lib/utils";
import { ReorderButton } from "./reorder-button";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.orders");
  return { title: t("metaTitle") };
}

const LOCALE_TAGS: Record<string, string> = {
  nl: "nl-NL",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
};

function dateLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale] ?? "nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function InfoState({ title, body }: { title: string; body: string }) {
  const t = await getTranslations("account.orders");
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
            <Lock className="size-5 text-ink" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 font-serif text-2xl text-ink">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
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

export default async function BestellingenPage() {
  const t = await getTranslations("account.orders");
  const ta = await getTranslations("account");
  const locale = await getLocale();

  if (!dbConfigured()) {
    return (
      <section className="bg-paper py-24 lg:py-32">
        <Container>
          <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
              <PackageOpen className="size-5 text-ink" strokeWidth={1.75} />
            </span>
            <h1 className="mt-6 font-serif text-2xl text-ink">{t("dbTitle")}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("dbText")}</p>
          </div>
        </Container>
      </section>
    );
  }

  const session = await auth();
  const user = session?.user;
  const approved = user?.status === "approved" || user?.role === "ADMIN";

  if (!user || !approved || !user.companyId) {
    return <InfoState title={t("gateTitle")} body={t("gateText")} />;
  }

  const orders = await db.order.findMany({
    where: { companyId: user.companyId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">{ta("eyebrow")}</p>
          <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{t("intro")}</p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-12 flex max-w-md flex-col items-start rounded-card border border-line bg-white p-8 sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-full bg-paper">
              <PackageOpen className="size-5 text-ink" strokeWidth={1.75} />
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
          <ul className="mt-12 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-card border border-line bg-white p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">{t("ordernummer")}</p>
                      <p className="mt-0.5 font-serif text-lg text-ink">{order.number}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">{t("datum")}</p>
                      <p className="mt-0.5 text-sm text-ink">{dateLabel(order.createdAt, locale)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">{t("status")}</p>
                      <p className="mt-0.5 text-sm text-ink">{t(`statusLabels.${order.status}`)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">{t("totaal")}</p>
                      <p className="mt-0.5 text-sm font-medium tabular-nums text-ink">
                        {formatPrice(order.totalCents / 100)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <ReorderButton
                      items={order.items.map((i) => ({
                        sku: i.sku,
                        size: i.size,
                        quantity: i.quantity,
                        unitPriceCents: i.unitPriceCents,
                        title: i.title,
                      }))}
                    />
                  </div>
                </div>

                <p className="mt-4 border-t border-line pt-4 text-xs text-muted">
                  {t("artikelen", { count: order.items.length })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
