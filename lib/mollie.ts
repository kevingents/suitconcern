import "server-only";
import { createMollieClient, type MollieClient } from "@mollie/api-client";

/**
 * Mollie-betalingen. Degradeert netjes: zonder MOLLIE_API_KEY wordt er geen
 * betaling aangemaakt (de order valt dan terug op een demo-/factuurafronding).
 * Secret (MOLLIE_API_KEY) hoort in Vercel-env.
 */

export function mollieConfigured(): boolean {
  return Boolean(process.env.MOLLIE_API_KEY);
}

let _client: MollieClient | null = null;
function client(): MollieClient | null {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) return null;
  if (!_client) _client = createMollieClient({ apiKey });
  return _client;
}

function euro(cents: number): string {
  return (cents / 100).toFixed(2);
}

export async function createMolliePayment(opts: {
  amountCents: number;
  description: string;
  orderNumber: string;
  redirectUrl: string;
  webhookUrl?: string;
}): Promise<{ molliePaymentId: string; checkoutUrl: string } | null> {
  const c = client();
  if (!c) return null;
  try {
    const payment = await c.payments.create({
      amount: { currency: "EUR", value: euro(opts.amountCents) },
      description: opts.description,
      redirectUrl: opts.redirectUrl,
      ...(opts.webhookUrl ? { webhookUrl: opts.webhookUrl } : {}),
      metadata: { orderNumber: opts.orderNumber },
    });
    const checkoutUrl =
      (typeof payment.getCheckoutUrl === "function" ? payment.getCheckoutUrl() : null) ??
      payment._links?.checkout?.href ??
      null;
    if (!checkoutUrl) return null;
    return { molliePaymentId: payment.id, checkoutUrl };
  } catch (e) {
    console.error("[mollie] payment create faalde:", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function getMolliePaymentStatus(molliePaymentId: string): Promise<string | null> {
  const c = client();
  if (!c) return null;
  try {
    const payment = await c.payments.get(molliePaymentId);
    return payment.status;
  } catch (e) {
    console.error("[mollie] payment get faalde:", e instanceof Error ? e.message : e);
    return null;
  }
}
