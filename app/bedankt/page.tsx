import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { ClearCart } from "./clear-cart";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("bedankt");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function BedanktPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const t = await getTranslations("bedankt");

  return (
    <section className="bg-paper py-20 lg:py-28">
      <ClearCart />
      <Container>
        <div className="mx-auto max-w-xl rounded-card border border-line bg-white p-8 text-center sm:p-12">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
            <Check className="size-8" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 font-serif text-3xl text-ink sm:text-4xl">{t("title")}</h1>
          {order ? (
            <p className="mt-3 text-sm text-muted">
              {t.rich("ordernummer", {
                order,
                b: (chunks) => <span className="font-medium text-ink">{chunks}</span>,
              })}
            </p>
          ) : null}
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">{t("text")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/account" className={buttonVariants({ variant: "primary", size: "lg" })}>
              {t("naarAccount")}
            </Link>
            <Link href="/collecties" className={buttonVariants({ variant: "outline", size: "lg" })}>
              {t("verderWinkelen")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
