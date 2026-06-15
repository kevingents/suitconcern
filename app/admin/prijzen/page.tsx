import { loadProducts } from "@/lib/catalog";
import { loadPriceList, priceForSku, priceListWritable } from "@/lib/pricing";
import { PriceListForm, type PriceRow } from "./price-list-form";

export const dynamic = "force-dynamic";

export default async function AdminPrijzenPage() {
  const [products, priceList] = await Promise.all([loadProducts(), loadPriceList()]);
  const writable = priceListWritable();

  const rows: PriceRow[] = [...products]
    .sort((a, b) => a.collection.localeCompare(b.collection) || a.name.localeCompare(b.name))
    .map((p) => ({
      sku: p.sku,
      name: p.name,
      collection: p.collection,
      current: priceForSku(priceList, p.sku),
      hint: p.priceExclVat > 0 ? p.priceExclVat : undefined,
    }));

  return (
    <>
      <div className="mb-8">
        <p className="eyebrow text-accent-dark">Beheer</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">Groothandelsprijzen</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Stel de netto groothandelsprijs (excl. btw) per artikel in. De klantgroep-korting
          komt hier in de webshop automatisch overheen. Wijzigingen gelden direct.
        </p>
      </div>
      <PriceListForm rows={rows} writable={writable} />
    </>
  );
}
