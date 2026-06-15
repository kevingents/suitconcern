import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/shop/breadcrumb";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductOrderPanel } from "@/components/shop/product-order-panel";
import { ProductTabs } from "@/components/shop/product-tabs";
import { ProductCard } from "@/components/shop/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductJsonLd } from "@/components/seo/json-ld";
import { getCollection } from "@/lib/data";
import { loadProduct, loadProducts } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await loadProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Product niet gevonden" };
  return {
    title: `${product.name} — ${product.brand}`,
    description: `${product.name} (${product.color}, ${product.fit}) van ${product.brand}. ${product.sku}. Inloggen voor prijzen en voorraad.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const collection = getCollection(product.collection);
  const all = await loadProducts();

  const related = all
    .filter((p) => p.collection === product.collection && p.slug !== product.slug)
    .slice(0, 4);

  const crossSell = ["gilets", "colberts", "overhemden"]
    .filter((c) => c !== product.collection)
    .map((c) => all.find((p) => p.collection === c))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="border-b border-line bg-white">
        <Container className="py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Collecties", href: "/collecties" },
              ...(collection ? [{ label: collection.title, href: `/collecties/${collection.slug}` }] : []),
              { label: product.name },
            ]}
          />
        </Container>
      </div>

      <section className="bg-white py-10 lg:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductGallery
              tone={product.tone}
              name={product.name}
              image={product.image}
              detailImage={product.detailImage}
            />

            <div>
              <p className="text-xs uppercase tracking-wider text-muted">{product.brand}</p>
              <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{product.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span>Art.nr {product.sku}</span>
                <span className="text-line">·</span>
                <span>{product.color}</span>
                <span className="text-line">·</span>
                <span>{product.fit}</span>
              </div>

              <div className="mt-7">
                <ProductOrderPanel product={product} />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <ProductTabs product={product} />
          </div>
        </Container>
      </section>

      {crossSell.length > 0 ? (
        <section className="bg-paper py-16 lg:py-20">
          <Container>
            <SectionHeading eyebrow="Maak het af" title="Bijpassend assortiment" />
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {crossSell.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="bg-white py-16 lg:py-20">
          <Container>
            <SectionHeading
              eyebrow="Meer uit deze collectie"
              title={collection ? collection.title : "Gerelateerde producten"}
            />
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
