import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Factory,
  Package,
  PenTool,
  Ruler,
  Sparkles,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privateLabel");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const offerings = [
  { icon: Tag, key: "Labels" },
  { icon: PenTool, key: "Ontwerp" },
  { icon: Ruler, key: "Maatlijn" },
  { icon: Package, key: "Verpakking" },
] as const;

const process = [
  { icon: Users, step: "01", key: "Intake" },
  { icon: PenTool, step: "02", key: "Ontwerp" },
  { icon: Factory, step: "03", key: "Productie" },
  { icon: Truck, step: "04", key: "Levering" },
] as const;

const benefits = [
  { icon: Sparkles, key: "Merk" },
  { icon: Ruler, key: "Pasvorm" },
  { icon: Factory, key: "Productie" },
  { icon: Truck, key: "Nalevering" },
] as const;

export default async function PrivateLabelPage() {
  const t = await getTranslations("privateLabel");
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
              eyebrow={t("maatwerkEyebrow")}
              title={t("maatwerkTitle")}
              description={t("maatwerkDescription")}
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
              <p>{t("maatwerkP1")}</p>
            </div>
          </div>
          <div>
            <PlaceholderImage
              tone="from-stone-700 to-neutral-900"
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
            eyebrow={t("offeringsEyebrow")}
            title={t("offeringsTitle")}
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map((offering) => {
              const Icon = offering.icon;
              return (
                <div
                  key={offering.key}
                  className="rounded-card border border-line bg-white p-7"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-ink">
                    {t(`offer${offering.key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`offer${offering.key}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("trajectEyebrow")}
            title={t("trajectTitle")}
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.step}
                  className="relative rounded-card border border-line bg-white p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-card bg-paper text-accent-dark">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </span>
                    <span className="font-serif text-2xl text-line-dark">
                      {phase.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-lg text-ink">
                    {t(`proc${phase.key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`proc${phase.key}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("voordelenEyebrow")}
            title={t("voordelenTitle")}
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.key}
                  className="flex items-start gap-4 rounded-card border border-line bg-white p-7"
                >
                  <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-serif text-base text-ink">
                      {t(`benefit${benefit.key}Title`)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {t(`benefit${benefit.key}Desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
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
            <div className="mt-9 flex justify-center">
              <Link
                href="/contact"
                className={buttonVariants({ variant: "light", size: "lg" })}
              >
                {tc("contactOpnemen")}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
