"use client";

import { useRouter } from "next/navigation";
import { Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export interface ReorderItem {
  sku: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
  title: string | null;
}

/**
 * Voegt alle regels van een eerdere order opnieuw toe aan de winkelwagen en
 * navigeert naar /winkelwagen. Prijs is een snapshot uit de order; de actuele
 * korting/btw wordt in de winkelwagen herberekend.
 */
export function ReorderButton({ items }: { items: ReorderItem[] }) {
  const router = useRouter();
  const { add } = useCart();

  function handleReorder() {
    for (const item of items) {
      if (!item.sku || !item.size || item.quantity <= 0) continue;
      add({
        sku: item.sku,
        slug: "",
        name: item.title ?? item.sku,
        brand: "",
        size: item.size,
        qty: item.quantity,
        unitPriceExclVat: item.unitPriceCents / 100,
        tone: "from-neutral-800 to-black",
      });
    }
    router.push("/winkelwagen");
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleReorder}>
      <Repeat className="size-4" strokeWidth={1.75} />
      Opnieuw bestellen
    </Button>
  );
}
