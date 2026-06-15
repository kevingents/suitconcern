import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("pages");
  const tcol = await getTranslations("home.collections");

  return (
    <>
      <PageHero
        eyebrow={t("collectie")}
        title={tcol(`${slug}.title`)}
        description={tcol(`${slug}.description`)}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("collecties"), href: "/collecties" },
          { label: tcol(`${slug}.title`) },
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
