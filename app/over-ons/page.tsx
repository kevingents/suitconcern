import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Headset,
  Ruler,
  Truck,
  Warehouse,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("overOns");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const valueIcons = [
  { icon: Warehouse, key: "Groothandel" },
  { icon: Truck, key: "Stock" },
  { icon: Ruler, key: "Maten" },
  { icon: Headset, key: "Service" },
] as const;

const statKeys = ["Ervaring", "Artikelen", "Levertijd", "Landen"] as const;

export default async function OverOnsPage() {
  const t = await getTranslations("overOns");
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
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={t("verhaalEyebrow")}
              title={t("verhaalTitle")}
              description={t("verhaalDescription")}
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
              <p>{t("verhaalP1")}</p>
              <p>{t("verhaalP2")}</p>
            </div>
          </div>
          <div>
            <PlaceholderImage
              tone="from-stone-700 to-neutral-950"
              ratio="aspect-[4/3]"
              label={t("imageLabel")}
              className="rounded-card"
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("waardenEyebrow")}
            title={t("waardenTitle")}
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueIcons.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.key}
                  className="rounded-card border border-line bg-white p-7"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-ink">
                    {t(`value${value.key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`value${value.key}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-y-10 rounded-card border border-line bg-paper px-6 py-12 text-center lg:grid-cols-4 lg:px-12">
            {statKeys.map((key) => (
              <div key={key}>
                <p className="font-serif text-3xl text-ink sm:text-4xl">
                  {t(`stat${key}Value`)}
                </p>
                <p className="mt-2 text-sm text-muted">{t(`stat${key}Label`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white pb-20 lg:pb-24">
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
