import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { collections } from "@/lib/data";

export function CollectionsGrid() {
  const featured = collections.filter((c) => c.featured).slice(0, 5);

  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Assortiment"
            title="Onze collecties"
            description="Een slim afgestemd assortiment voor elke gelegenheid — van zakelijk tot ceremonie."
          />
          <Link
            href="/collecties"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
          >
            Bekijk alle producten
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {featured.map((c, i) => (
            <Link
              key={c.slug}
              href={`/collecties/${c.slug}`}
              className={`group relative overflow-hidden rounded-card ${
                i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <PlaceholderImage
                tone={c.tone}
                ratio={i === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[420px]" : "aspect-[4/5]"}
                className="transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="font-serif text-xl text-white sm:text-2xl">{c.title}</h3>
                  <p className="mt-1 text-xs text-white/70">{c.count} artikelen</p>
                </div>
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-accent group-hover:text-ink">
                  <ArrowUpRight className="size-4" strokeWidth={1.75} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
