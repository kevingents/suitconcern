import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/shop/page-hero";
import { CategoryListing } from "@/components/shop/category-listing";
import { collections, getCollection } from "@/lib/data";
import { loadProductsByCollection } from "@/lib/catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collectie niet gevonden" };
  return {
    title: collection.title,
    description: `${collection.title} — ${collection.description} Inloggen voor prijzen en voorraad.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = await loadProductsByCollection(slug);

  return (
    <>
      <PageHero
        eyebrow="Collectie"
        title={collection.title}
        description={collection.description}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Collecties", href: "/collecties" },
          { label: collection.title },
        ]}
      />

      <section className="bg-white py-12 lg:py-16">
        <Container>
          <CategoryListing products={products} />
        </Container>
      </section>
    </>
  );
}
