import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/data";

export function Bestsellers({ products }: { products: Product[] }) {
  return (
    <section className="bg-paper py-20 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Topverkopers"
            title="Veel verkocht"
            description="De kerncollectie die onze dealers het hele jaar door bestellen."
          />
          <Link
            href="/collecties"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
          >
            Volledig assortiment
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
