import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { brands } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("merken");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function MerkenPage() {
  const t = await getTranslations("merken");
  const tc = await getTranslations("cta");
  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <p className="eyebrow text-accent">{t("heroEyebrow")}</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-2xl text-white/70">{t("heroText")}</p>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("sectionEyebrow")}
            title={t("sectionTitle")}
            description={t("sectionDescription")}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col rounded-card border border-line bg-white p-7"
              >
                <h2 className="font-serif text-2xl text-ink">{brand.name}</h2>
                <p className="mt-2 text-sm text-muted">{brand.note}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
                  {tc("bekijkProducten")}
                  <ArrowRight className="size-4" strokeWidth={1.75} />
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-card bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(200,178,138,0.22),transparent_60%)]" />
            <p className="eyebrow text-accent">{t("ctaEyebrow")}</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
              {t("ctaText")}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/b2b-account-aanvragen"
                className={buttonVariants({ variant: "light", size: "lg" })}
              >
                {tc("accountAanvragen")}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "light-outline", size: "lg" })}
              >
                {tc("contactOpnemen")}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
