import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/shop/page-hero";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { collections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collecties",
  description:
    "Ontdek het volledige assortiment van Suitconcern — pakken, smokings, colberts, gilets, overhemden en accessoires voor de zakelijke afnemer.",
};

export default function CollectiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Assortiment"
        title="Collecties"
        description="Een slim afgestemd assortiment gala- en bedrijfskleding — altijd uit voorraad, in een ruime matenrange."
        crumbs={[{ label: "Home", href: "/" }, { label: "Collecties" }]}
      />

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Link
                key={c.slug}
                href={`/collecties/${c.slug}`}
                className="group relative overflow-hidden rounded-card"
              >
                <PlaceholderImage
                  tone={c.tone}
                  category={c.slug}
                  ratio="aspect-[4/3]"
                  className="transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl text-white">{c.title}</h2>
                      <p className="mt-1 text-sm text-white/70">{c.description}</p>
                      <p className="mt-2 text-xs text-white/50">{c.count} artikelen</p>
                    </div>
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-accent group-hover:text-ink">
                      <ArrowUpRight className="size-4" strokeWidth={1.75} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
