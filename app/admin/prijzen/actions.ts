"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { savePriceList, priceListWritable } from "@/lib/pricing";
import { UserRole } from "@prisma/client";

export type SavePricesState = { ok: boolean; message?: string } | null;

/** Slaat de ingevoerde groothandelsprijzen op (blob). Alleen voor ADMIN. */
export async function savePrices(_prev: SavePricesState, formData: FormData): Promise<SavePricesState> {
  const session = await auth();
  if (!session?.user || session.user.role !== UserRole.ADMIN) redirect("/login");

  if (!priceListWritable()) {
    return { ok: false, message: "Geen blob-token geconfigureerd — de prijslijst kan niet worden opgeslagen." };
  }

  const prices: Record<string, number> = {};
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("price__")) continue;
    const sku = key.slice("price__".length);
    const n = parseFloat(String(value).replace(",", "."));
    if (sku && Number.isFinite(n) && n > 0) prices[sku] = n;
  }

  const ok = await savePriceList(prices);
  revalidatePath("/admin/prijzen");
  return ok
    ? { ok: true, message: `${Object.keys(prices).length} prijzen opgeslagen.` }
    : { ok: false, message: "Opslaan mislukt. Probeer het later opnieuw." };
}
