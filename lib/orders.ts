import "server-only";
import { db } from "@/lib/db";
import { loadProducts } from "@/lib/catalog";
import { loadPriceList, priceForSku } from "@/lib/pricing";
import { OrderStatus, PaymentStatus, type PaymentMethod } from "@prisma/client";

const VAT_RATE = 0.21;

export interface OrderLineInput {
  sku: string;
  size: string;
  qty: number;
}

export interface ShippingInput {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface OrderTotals {
  subtotalCents: number; // excl. btw, vóór korting
  discountCents: number;
  vatCents: number;
  totalCents: number; // incl. btw
  lines: { sku: string; size: string; quantity: number; unitPriceCents: number; title: string }[];
}

export function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SC-${ymd}-${rand}`;
}

/**
 * Berekent de order-bedragen AUTORITATIEF server-side (prijslijst → catalogus),
 * met de klantgroep-korting. Negeert client-prijzen (tegen manipulatie).
 */
export async function computeOrder(items: OrderLineInput[], discountPct: number): Promise<OrderTotals> {
  const [products, priceList] = await Promise.all([loadProducts(), loadPriceList()]);
  const bySku = new Map(products.map((p) => [p.sku, p]));

  let subtotalCents = 0;
  let discountCents = 0;
  const lines: OrderTotals["lines"] = [];

  for (const it of items) {
    const qty = Math.max(0, Math.floor(it.qty));
    if (qty <= 0) continue;
    const product = bySku.get(it.sku);
    const baseEuro = priceForSku(priceList, it.sku) ?? product?.priceExclVat ?? 0;
    const baseCents = Math.round(baseEuro * 100);
    const netCents = Math.round(baseCents * (1 - discountPct / 100));
    subtotalCents += baseCents * qty;
    discountCents += (baseCents - netCents) * qty;
    lines.push({
      sku: it.sku,
      size: it.size,
      quantity: qty,
      unitPriceCents: netCents,
      title: product?.name ?? it.sku,
    });
  }

  const netSubtotal = subtotalCents - discountCents;
  const vatCents = Math.round(netSubtotal * VAT_RATE);
  const totalCents = netSubtotal + vatCents;
  return { subtotalCents, discountCents, vatCents, totalCents, lines };
}

/** Persisteert een order + regels + (open) betaling. Vereist een geldige company. */
export async function createOrder(args: {
  companyId: string;
  userId: string | null;
  discountPct: number;
  items: OrderLineInput[];
  shipping: ShippingInput;
  paymentMethod: PaymentMethod;
}) {
  const totals = await computeOrder(args.items, args.discountPct);
  if (!totals.lines.length) throw new Error("Lege order.");

  const number = generateOrderNumber();

  const order = await db.order.create({
    data: {
      number,
      companyId: args.companyId,
      userId: args.userId,
      status: OrderStatus.PENDING,
      subtotalCents: totals.subtotalCents,
      discountCents: totals.discountCents,
      vatCents: totals.vatCents,
      totalCents: totals.totalCents,
      paymentMethod: args.paymentMethod,
      shipName: args.shipping.name,
      shipStreet: args.shipping.street,
      shipPostalCode: args.shipping.postalCode,
      shipCity: args.shipping.city,
      shipCountry: args.shipping.country,
      items: { create: totals.lines },
      payments: {
        create: { status: PaymentStatus.OPEN, method: args.paymentMethod, amountCents: totals.totalCents },
      },
    },
    include: { payments: true },
  });

  return { order, totals };
}
