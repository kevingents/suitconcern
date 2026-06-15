"use server";

import { auth } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";
import { createOrder, generateOrderNumber, type OrderLineInput, type ShippingInput } from "@/lib/orders";
import { createMolliePayment, mollieConfigured } from "@/lib/mollie";
import { PaymentMethod } from "@prisma/client";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export interface PlaceOrderInput {
  items: OrderLineInput[];
  shipping: ShippingInput;
  paymentMethod: string;
  /** Client-hint; in echte modus wint de server-sessie. */
  discountPct: number;
}

export type PlaceOrderResult = {
  ok: boolean;
  orderNumber?: string;
  redirectUrl?: string;
  error?: string;
};

function toPaymentMethod(value: string): PaymentMethod {
  const v = String(value || "").toUpperCase();
  return (Object.values(PaymentMethod) as string[]).includes(v)
    ? (v as PaymentMethod)
    : PaymentMethod.IDEAL;
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const items = (input.items || []).filter((i) => i && i.sku && i.size && i.qty > 0);
  if (!items.length) return { ok: false, error: "Uw winkelwagen is leeg." };

  const method = toPaymentMethod(input.paymentMethod);

  // ── Demo-modus (geen database): geen persistentie/Mollie, wel een bevestiging.
  if (!dbConfigured()) {
    return { ok: true, orderNumber: generateOrderNumber() };
  }

  // ── Echte modus: vereist ingelogd + goedgekeurd account.
  const session = await auth();
  const user = session?.user;
  if (!user) return { ok: false, error: "Log in om te bestellen." };
  const approved = user.status === "approved" || user.role === "ADMIN";
  if (!approved) return { ok: false, error: "Uw account is nog niet goedgekeurd." };
  if (!user.companyId) return { ok: false, error: "Er is geen bedrijf aan uw account gekoppeld." };

  // Achteraf op factuur alleen als het bij dit bedrijf is toegestaan.
  if (method === PaymentMethod.INVOICE) {
    const company = await db.company.findUnique({ where: { id: user.companyId } });
    if (!company?.allowInvoicePayment) {
      return { ok: false, error: "Betalen op factuur is niet geactiveerd voor uw account." };
    }
  }

  try {
    const { order, totals } = await createOrder({
      companyId: user.companyId,
      userId: user.id,
      discountPct: user.discountPct ?? 0,
      items,
      shipping: input.shipping,
      paymentMethod: method,
    });

    // Op factuur → geen online betaling; order staat klaar voor verwerking.
    if (method === PaymentMethod.INVOICE) {
      return { ok: true, orderNumber: order.number };
    }

    // Online betaling via Mollie (indien geconfigureerd).
    if (mollieConfigured()) {
      const payment = await createMolliePayment({
        amountCents: totals.totalCents,
        description: `Suitconcern order ${order.number}`,
        orderNumber: order.number,
        redirectUrl: `${SITE}/bedankt?order=${order.number}`,
        webhookUrl: `${SITE}/api/webhooks/mollie`,
      });
      if (payment) {
        await db.payment.updateMany({
          where: { orderId: order.id },
          data: { molliePaymentId: payment.molliePaymentId },
        });
        return { ok: true, orderNumber: order.number, redirectUrl: payment.checkoutUrl };
      }
    }

    // Geen Mollie geconfigureerd of betaling niet aangemaakt: order staat PENDING.
    return { ok: true, orderNumber: order.number };
  } catch (e) {
    console.error("[placeOrder] faalde:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Er ging iets mis bij het plaatsen van de order. Probeer het later opnieuw." };
  }
}
