import Link from "next/link";
import { Container } from "@/components/ui/container";
import { brands } from "@/lib/data";

export function BrandsStrip() {
  return (
    <section className="border-y border-line bg-white py-14">
      <Container>
        <p className="eyebrow text-center text-muted">
          Toonaangevende merken in ons assortiment
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href="/merken"
              className="group text-center"
              title={brand.note}
            >
              <span className="font-serif text-2xl tracking-tight text-ink/40 transition-colors group-hover:text-ink sm:text-3xl">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
