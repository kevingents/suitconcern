import type { Product } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organisatie-schema (site-breed, in de root layout). */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Suitconcern",
        url: BASE,
        description:
          "B2B-groothandel in gala- en bedrijfskleding voor retailers, herenmodezaken, bruidszaken en zakelijke afnemers.",
      }}
    />
  );
}

/**
 * Product-schema (PDP). BEWUST zonder prijs/offer: B2B-prijzen zijn login-gated,
 * maar de pagina blijft indexeerbaar voor vindbaarheid.
 */
export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
        ...(product.color ? { color: product.color } : {}),
        category: product.collection,
        ...(product.image ? { image: product.image } : {}),
        url: `${BASE}/producten/${product.slug}`,
      }}
    />
  );
}
