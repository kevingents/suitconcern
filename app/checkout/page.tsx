"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CreditCard,
  Landmark,
  Lock,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { placeOrder } from "./actions";
import { cn, formatPrice } from "@/lib/utils";

const BTW_RATE = 0.21;

const STEPS = ["Gegevens", "Verzending", "Betaling", "Controle"] as const;

const SHIPPING_OPTIONS = [
  {
    id: "standaard",
    label: "Standaard levering",
    note: "1–3 werkdagen · op factuur- of afleveradres",
  },
  {
    id: "express",
    label: "Express levering",
    note: "Volgende werkdag · toeslag wordt bij afrekenen berekend",
  },
  {
    id: "afhalen",
    label: "Afhalen showroom",
    note: "Gratis · op afspraak in de showroom",
  },
] as const;

interface PaymentOption {
  id: string;
  label: string;
  icon: LucideIcon;
  note?: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "IDEAL", label: "iDEAL", icon: Landmark },
  { id: "BANCONTACT", label: "Bancontact", icon: CreditCard },
  { id: "CREDITCARD", label: "Creditcard", icon: CreditCard },
  { id: "APPLEPAY", label: "Apple Pay", icon: Smartphone },
  { id: "KLARNA", label: "Klarna Zakelijk", icon: Wallet },
  { id: "BANKTRANSFER", label: "Vooraf bankoverschrijving", icon: Banknote },
  {
    id: "INVOICE",
    label: "Op factuur (achteraf)",
    icon: Building2,
    note: "Alleen indien geactiveerd voor uw account.",
  },
];

interface ShippingForm {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

function GatedState({ empty }: { empty: boolean }) {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
            <Lock className="size-5 text-ink" strokeWidth={1.75} />
          </span>
          {empty ? (
            <>
              <h1 className="mt-6 text-2xl text-ink">Uw winkelwagen is leeg</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Voeg eerst artikelen toe aan uw winkelwagen voordat u afrekent.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/collecties"
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  Naar de collecties
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-6 text-2xl text-ink">Log in om te bestellen</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Afrekenen en prijzen zijn uitsluitend beschikbaar voor een
                ingelogd én goedgekeurd B2B-account. Vraag een account aan of
                log in om uw bestelling af te ronden.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/login" className={cn(buttonVariants({ variant: "primary" }))}>
                  Inloggen
                </Link>
                <Link
                  href="/b2b-account-aanvragen"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Account aanvragen
                </Link>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {STEPS.map((label, index) => {
        const stepNo = index + 1;
        const isDone = stepNo < current;
        const isActive = stepNo === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors",
                isActive && "border-ink bg-ink text-white",
                isDone && "border-accent bg-accent text-ink",
                !isActive && !isDone && "border-line text-muted",
              )}
            >
              {isDone ? <Check className="size-3.5" strokeWidth={2.5} /> : stepNo}
            </span>
            <span
              className={cn(
                "text-sm",
                isActive ? "font-medium text-ink" : "text-muted",
              )}
            >
              {label}
            </span>
            {stepNo < STEPS.length ? (
              <span className="mx-1 hidden h-px w-6 bg-line sm:block" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

const inputClass =
  "h-11 w-full rounded-card border border-line bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";
const labelClass = "mb-1.5 block text-xs font-medium text-ink";

export default function CheckoutPage() {
  const router = useRouter();
  const { isApproved, discountPct, group, company } = useSession();
  const { items, subtotalExclVat } = useCart();

  const [step, setStep] = useState(1);
  const [shipmentMethod, setShipmentMethod] = useState<string>(SHIPPING_OPTIONS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_OPTIONS[0].id);
  const [shipping, setShipping] = useState<ShippingForm>({
    name: company ?? "",
    street: "",
    postalCode: "",
    city: "",
    country: "Nederland",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const subtotal = subtotalExclVat;
    const discount = subtotal * (discountPct / 100);
    const netSubtotal = subtotal - discount;
    const vat = netSubtotal * BTW_RATE;
    const total = netSubtotal + vat;
    return { subtotal, discount, netSubtotal, vat, total };
  }, [subtotalExclVat, discountPct]);

  if (!isApproved) return <GatedState empty={false} />;
  if (items.length === 0) return <GatedState empty />;

  const hasDiscount = discountPct > 0;
  const isLastStep = step === STEPS.length;

  function updateShipping<K extends keyof ShippingForm>(key: K, value: string) {
    setShipping((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(STEPS.length, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    setError(null);
    try {
      const res = await placeOrder({
        items: items.map((i) => ({ sku: i.sku, size: i.size, qty: i.qty })),
        shipping,
        paymentMethod,
        discountPct,
      });
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }
      if (res.ok) {
        router.push(`/bedankt?order=${res.orderNumber ?? ""}`);
        return;
      }
      setError(res.error ?? "Er ging iets mis bij het plaatsen van de bestelling.");
      setPlacing(false);
    } catch {
      setError("Er ging iets mis bij het plaatsen van de bestelling. Probeer het opnieuw.");
      setPlacing(false);
    }
  }

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">Afrekenen</p>
          <h1 className="text-3xl sm:text-4xl">Bestelling afronden</h1>
        </div>

        <div className="mt-10 overflow-x-auto rounded-card border border-line bg-white px-5 py-4">
          <StepIndicator current={step} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* Stap-inhoud */}
          <div>
            <div className="rounded-card border border-line bg-white p-6 sm:p-8">
              {step === 1 ? (
                <div>
                  <h2 className="font-serif text-xl text-ink">Gegevens</h2>
                  <p className="mt-1 text-sm text-muted">
                    Vul uw bedrijfs- en afleveradres in.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className={labelClass}>
                        Bedrijfsnaam
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={shipping.name}
                        onChange={(e) => updateShipping("name", e.target.value)}
                        placeholder="Uw bedrijfsnaam"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="street" className={labelClass}>
                        Straat en huisnummer
                      </label>
                      <input
                        id="street"
                        type="text"
                        value={shipping.street}
                        onChange={(e) => updateShipping("street", e.target.value)}
                        placeholder="Voorbeeldstraat 12"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className={labelClass}>
                        Postcode
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        value={shipping.postalCode}
                        onChange={(e) => updateShipping("postalCode", e.target.value)}
                        placeholder="1234 AB"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className={labelClass}>
                        Plaats
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={shipping.city}
                        onChange={(e) => updateShipping("city", e.target.value)}
                        placeholder="Plaatsnaam"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="country" className={labelClass}>
                        Land
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={shipping.country}
                        onChange={(e) => updateShipping("country", e.target.value)}
                        placeholder="Nederland"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <h2 className="font-serif text-xl text-ink">Verzending</h2>
                  <p className="mt-1 text-sm text-muted">Kies een leveroptie.</p>
                  <div className="mt-6 space-y-3">
                    {SHIPPING_OPTIONS.map((option) => {
                      const selected = shipmentMethod === option.id;
                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors",
                            selected ? "border-ink bg-paper" : "border-line hover:border-ink/40",
                          )}
                        >
                          <input
                            type="radio"
                            name="verzending"
                            value={option.id}
                            checked={selected}
                            onChange={() => setShipmentMethod(option.id)}
                            className="mt-0.5 size-4 accent-ink"
                          />
                          <span className="flex items-start gap-3">
                            <Truck className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={1.75} />
                            <span>
                              <span className="block text-sm font-medium text-ink">
                                {option.label}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted">
                                {option.note}
                              </span>
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <h2 className="font-serif text-xl text-ink">Betaling</h2>
                  <p className="mt-1 text-sm text-muted">Kies een betaalmethode.</p>
                  <div className="mt-6 space-y-3">
                    {PAYMENT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const selected = paymentMethod === option.id;
                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors",
                            selected ? "border-ink bg-paper" : "border-line hover:border-ink/40",
                          )}
                        >
                          <input
                            type="radio"
                            name="betaling"
                            value={option.id}
                            checked={selected}
                            onChange={() => setPaymentMethod(option.id)}
                            className="mt-0.5 size-4 accent-ink"
                          />
                          <span className="flex items-start gap-3">
                            <Icon className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={1.75} />
                            <span>
                              <span className="block text-sm font-medium text-ink">
                                {option.label}
                              </span>
                              {option.note ? (
                                <span className="mt-0.5 block text-xs text-muted">
                                  {option.note}
                                </span>
                              ) : null}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div>
                  <h2 className="font-serif text-xl text-ink">Controle</h2>
                  <p className="mt-1 text-sm text-muted">
                    Controleer uw bestelling voordat u deze plaatst.
                  </p>

                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {items.map((item) => {
                      const unitNet = item.unitPriceExclVat * (1 - discountPct / 100);
                      return (
                        <li
                          key={`${item.sku}__${item.size}`}
                          className="flex items-center justify-between gap-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted">
                              {item.brand} · {item.sku} · Maat {item.size} · {item.qty}{" "}
                              {item.qty === 1 ? "stuk" : "stuks"}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm tabular-nums text-ink">
                            {formatPrice(unitNet * item.qty)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <dl className="mt-5 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Aflevering aan</dt>
                      <dd className="text-right text-ink">
                        {shipping.name || "—"}
                        {shipping.city ? (
                          <span className="block text-xs text-muted">
                            {shipping.street}, {shipping.postalCode} {shipping.city}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : null}

              {error ? (
                <div className="mt-6 rounded-card border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {/* Stap-navigatie */}
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
                {step > 1 ? (
                  <Button variant="outline" onClick={prev} disabled={placing}>
                    <ArrowLeft className="size-4" strokeWidth={1.75} />
                    Vorige
                  </Button>
                ) : (
                  <Link
                    href="/winkelwagen"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <ArrowLeft className="size-4" strokeWidth={1.75} />
                    Winkelwagen
                  </Link>
                )}

                {isLastStep ? (
                  <Button onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? "Bezig…" : "Bestelling plaatsen"}
                    {placing ? null : <Check className="size-4" strokeWidth={2} />}
                  </Button>
                ) : (
                  <Button onClick={next}>
                    Volgende
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-6 text-xs text-muted">
              Prijzen zijn excl. btw; klantkorting is al verwerkt.
            </p>
          </div>

          {/* Compact besteloverzicht */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line bg-white p-6">
              <h2 className="font-serif text-xl text-ink">Uw bestelling</h2>

              <ul className="mt-5 space-y-2.5 border-b border-line pb-5 text-sm">
                {items.map((item) => {
                  const unitNet = item.unitPriceExclVat * (1 - discountPct / 100);
                  return (
                    <li
                      key={`${item.sku}__${item.size}`}
                      className="flex justify-between gap-3"
                    >
                      <span className="min-w-0 text-muted">
                        <span className="text-ink/80">{item.qty}×</span> {item.name}
                        <span className="text-ink/50"> · {item.size}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-ink">
                        {formatPrice(unitNet * item.qty)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotaal (excl. btw)</dt>
                  <dd className="tabular-nums text-ink">{formatPrice(totals.subtotal)}</dd>
                </div>
                {hasDiscount ? (
                  <div className="flex justify-between">
                    <dt className="text-muted">
                      Klantkorting · {group} · {discountPct}%
                    </dt>
                    <dd className="tabular-nums text-accent-dark">
                      − {formatPrice(totals.discount)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted">Btw 21%</dt>
                  <dd className="tabular-nums text-ink">{formatPrice(totals.vat)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base">
                  <dt className="font-medium text-ink">Totaal (incl. btw)</dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {formatPrice(totals.total)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
