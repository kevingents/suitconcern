import { loadProducts } from "@/lib/catalog";
import { QuickOrder, type QuickOrderProduct } from "./quick-order";

export const metadata = {
  title: "Snel bestellen",
};

export default async function SnelBestellenPage() {
  const products = await loadProducts();
  const catalog: QuickOrderProduct[] = products.map((p) => ({
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    slug: p.slug,
    tone: p.tone,
    priceExclVat: p.priceExclVat,
    sizes: p.variants.map((v) => v.size),
    image: p.image,
  }));

  return <QuickOrder catalog={catalog} />;
}
