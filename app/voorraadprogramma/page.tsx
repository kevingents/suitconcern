import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { buttonVariants } from "@/components/ui/button";
import { collections } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("voorraad");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const stepNumbers = ["01", "02", "03"] as const;
const benefitKeys = ["benefit1", "benefit2", "benefit3", "benefit4", "benefit5", "benefit6"] as const;

const stockCollections = collections.filter((collection) => collection.featured);

export default async function VoorraadprogrammaPage() {
  const t = await getTranslations("voorraad");
  const tc = await getTranslations("cta");
  const tcol = await getTranslations("home.collections");
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
              eyebrow={t("principeEyebrow")}
              title={t("principeTitle")}
              description={t("principeDescription")}
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
              <p>{t("principeP1")}</p>
            </div>
          </div>
          <div>
            <PlaceholderImage
              tone="from-neutral-800 to-black"
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
            eyebrow={t("stappenEyebrow")}
            title={t("stappenTitle")}
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stepNumbers.map((num, i) => (
              <div
                key={num}
                className="rounded-card border border-line bg-white p-8"
              >
                <span className="font-serif text-3xl text-accent-dark">
                  {num}
                </span>
                <h3 className="mt-4 font-serif text-lg text-ink">
                  {t(`step${i + 1}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`step${i + 1}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={t("voordelenEyebrow")}
              title={t("voordelenTitle")}
            />
            <ul className="mt-8 space-y-3.5">
              {benefitKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-3 text-sm text-ink/80"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-accent-dark">{t("categorieEyebrow")}</p>
            <h2 className="mt-3 text-3xl text-ink sm:text-4xl">{t("categorieTitle")}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              {t("categorieText")}
            </p>
            <div className="mt-8 space-y-3">
              {stockCollections.map((collection) => (
                <div
                  key={collection.slug}
                  className="flex items-center justify-between rounded-card border border-line bg-paper px-5 py-4"
                >
                  <div>
                    <p className="font-serif text-base text-ink">
                      {tcol(`${collection.slug}.title`)}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {tcol(`${collection.slug}.description`)}
                    </p>
                  </div>
                  <span className="ml-4 shrink-0 text-sm text-muted">
                    {collection.count} {t("artikelen")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper pb-20 lg:pb-24">
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
                href="/login"
                className={buttonVariants({ variant: "light-outline", size: "lg" })}
              >
                {tc("inloggen")}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
