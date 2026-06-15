"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useSession } from "@/lib/session";
import { ProductCard } from "@/components/shop/product-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

type SortKey = "populair" | "nieuw" | "prijs-op" | "prijs-af";

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function CategoryListing({ products }: { products: Product[] }) {
  const { isApproved } = useSession();
  const [brands, setBrands] = useState<string[]>([]);
  const [fits, setFits] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("populair");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const options = useMemo(
    () => ({
      brands: unique(products.map((p) => p.brand)).sort(),
      fits: unique(products.map((p) => p.fit)).sort(),
      colors: unique(products.map((p) => p.color)).sort(),
      sizes: unique(products.flatMap((p) => p.variants.map((v) => v.size))).sort(),
    }),
    [products],
  );

  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      if (brands.length && !brands.includes(p.brand)) return false;
      if (fits.length && !fits.includes(p.fit)) return false;
      if (colors.length && !colors.includes(p.color)) return false;
      if (sizes.length && !p.variants.some((v) => sizes.includes(v.size))) return false;
      if (inStockOnly && !p.variants.some((v) => v.stock > 0)) return false;
      return true;
    });

    const sorted = [...result];
    if (sort === "nieuw") {
      sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    } else if (sort === "prijs-op") {
      sorted.sort((a, b) => a.priceExclVat - b.priceExclVat);
    } else if (sort === "prijs-af") {
      sorted.sort((a, b) => b.priceExclVat - a.priceExclVat);
    } else {
      sorted.sort((a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)));
    }
    return sorted;
  }, [products, brands, fits, colors, sizes, inStockOnly, sort]);

  const activeCount = brands.length + fits.length + colors.length + sizes.length + (inStockOnly ? 1 : 0);

  function toggle(list: string[], set: (v: string[]) => void, value: string) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function reset() {
    setBrands([]);
    setFits([]);
    setColors([]);
    setSizes([]);
    setInStockOnly(false);
  }

  const filters = (
    <div className="space-y-7">
      <FilterGroup
        title="Merk"
        options={options.brands}
        selected={brands}
        onToggle={(v) => toggle(brands, setBrands, v)}
      />
      <FilterGroup
        title="Pasvorm"
        options={options.fits}
        selected={fits}
        onToggle={(v) => toggle(fits, setFits, v)}
      />
      <FilterGroup
        title="Maat"
        options={options.sizes}
        selected={sizes}
        onToggle={(v) => toggle(sizes, setSizes, v)}
        inline
      />
      <FilterGroup
        title="Kleur"
        options={options.colors}
        selected={colors}
        onToggle={(v) => toggle(colors, setColors, v)}
      />
      <div>
        <p className="mb-3 font-serif text-base text-ink">Voorraad</p>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="size-4 rounded border-line accent-ink"
          />
          Alleen op voorraad
        </label>
      </div>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      {/* Desktop filters */}
      <aside className="hidden lg:block">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-ink">Filters</h2>
          {activeCount > 0 ? (
            <button onClick={reset} className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline">
              Wissen ({activeCount})
            </button>
          ) : null}
        </div>
        <div className="mt-6">{filters}</div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-sm text-muted">
            <span className="text-ink">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "artikel" : "artikelen"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "lg:hidden")}
            >
              <SlidersHorizontal className="size-4" strokeWidth={1.75} />
              Filters{activeCount ? ` (${activeCount})` : ""}
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="hidden sm:inline">Sorteren</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 rounded-card border border-line bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
              >
                <option value="populair">Populair</option>
                <option value="nieuw">Nieuw</option>
                {isApproved ? <option value="prijs-op">Prijs oplopend</option> : null}
                {isApproved ? <option value="prijs-af">Prijs aflopend</option> : null}
              </select>
            </label>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-muted">Geen artikelen gevonden met deze filters.</p>
            <button onClick={reset} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}>
              Filters wissen
            </button>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-line px-5">
              <h2 className="font-serif text-lg text-ink">Filters</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Filters sluiten"
                className="inline-flex size-10 items-center justify-center rounded-card hover:bg-paper"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filters}</div>
            <div className="flex gap-2 border-t border-line p-4">
              <button onClick={reset} className={cn(buttonVariants({ variant: "outline", size: "md" }), "flex-1")}>
                Wissen
              </button>
              <button onClick={() => setDrawerOpen(false)} className={cn(buttonVariants({ variant: "primary", size: "md" }), "flex-1")}>
                Toon {filtered.length} artikelen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  inline = false,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  inline?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="mb-3 font-serif text-base text-ink">{title}</p>
      {inline ? (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className={cn(
                  "rounded-card border px-3 py-1.5 text-sm transition-colors",
                  active ? "border-ink bg-ink text-white" : "border-line text-ink/80 hover:border-ink",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5">
          {options.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="size-4 rounded border-line accent-ink"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
