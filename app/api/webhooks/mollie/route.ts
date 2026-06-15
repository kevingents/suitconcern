import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { getMolliePaymentStatus, mollieConfigured } from "@/lib/mollie";
import { OrderStatus, PaymentStatus } from "@prisma/client";

/**
 * Mollie-webhook: Mollie post hier de payment-id na een statuswijziging. We halen
 * de actuele status op en werken Payment + Order bij. Altijd 200 terug (Mollie-eis).
 */
export async function POST(req: Request): Promise<NextResponse> {
  if (!dbConfigured() || !mollieConfigured()) return NextResponse.json({ ok: true });

  try {
    const form = await req.formData();
    const molliePaymentId = String(form.get("id") || "");
    if (!molliePaymentId) return NextResponse.json({ ok: true });

    const status = await getMolliePaymentStatus(molliePaymentId);
    if (!status) return NextResponse.json({ ok: true });

    const payment = await db.payment.findUnique({ where: { molliePaymentId } });
    if (!payment) return NextResponse.json({ ok: true });

    const paymentStatus: PaymentStatus =
      status === "paid"
        ? PaymentStatus.PAID
        : status === "failed"
          ? PaymentStatus.FAILED
          : status === "expired"
            ? PaymentStatus.EXPIRED
            : status === "canceled"
              ? PaymentStatus.FAILED
              : PaymentStatus.OPEN;

    await db.payment.update({ where: { id: payment.id }, data: { status: paymentStatus } });

    if (status === "paid") {
      await db.order.update({ where: { id: payment.orderId }, data: { status: OrderStatus.PAID } });
    } else if (status === "expired" || status === "canceled") {
      await db.order.update({ where: { id: payment.orderId }, data: { status: OrderStatus.CANCELLED } });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[mollie webhook] faalde:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: true });
  }
}
