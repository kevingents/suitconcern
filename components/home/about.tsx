import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { buttonVariants } from "@/components/ui/button";
import siteImages from "@/lib/data/site-images.json";

export function About() {
  const t = useTranslations("home.about");
  const points = t.raw("points") as string[];
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
          <ul className="mt-8 space-y-3.5">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-ink/80">
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Link href="/over-ons" className={buttonVariants({ variant: "outline", size: "md" })}>
              {t("cta")}
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <PlaceholderImage
            tone="from-stone-700 to-neutral-950"
            ratio="aspect-[4/3]"
            label={t("imageLabel")}
            src={siteImages.about}
            className="rounded-card"
          />
        </div>
      </Container>
    </section>
  );
}
