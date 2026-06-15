"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import { useSession } from "@/lib/session";
import { products, type Product } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";

const BTW_RATE = 0.21;
const SHIPPING_EXCL_VAT = 9.95;

/** Demo-regels voor het besteloverzicht in de checkout. */
const DEMO_LINES: { slug: string; qty: number }[] = [
  { slug: "kingsley-pak-navy", qty: 6 },
  { slug: "oxford-overhemd-wit", qty: 10 },
];

const STEPS = [
  "Winkelwagen",
  "Gegevens",
  "Verzending",
  "Betaling",
  "Controle",
] as const;

const SHIPPING_OPTIONS = [
  {
    id: "standaard",
    label: "Standaard levering",
    note: "1–3 werkdagen · op factuuradres of afleveradres",
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
  disabled?: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "ideal", label: "iDEAL", icon: Landmark },
  { id: "bancontact", label: "Bancontact", icon: CreditCard },
  { id: "creditcard", label: "Creditcard", icon: CreditCard },
  { id: "applepay", label: "Apple Pay", icon: Smartphone },
  { id: "klarna", label: "Klarna Zakelijk", icon: Wallet },
  { id: "overschrijving", label: "Vooraf bankoverschrijving", icon: Banknote },
  {
    id: "opfactuur",
    label: "Op factuur (achteraf)",
    icon: Building2,
    note: "Alleen beschikbaar als dit voor uw account is geactiveerd.",
    disabled: true,
  },
];

function GatedState() {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
            <Lock className="size-5 text-ink" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 text-2xl text-ink">Log in om te bestellen</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Afrekenen en prijzen zijn uitsluitend beschikbaar voor een ingelogd
            én goedgekeurd B2B-account. Vraag een account aan of log in om uw
            bestelling af te ronden.
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

function Field({
  label,
  id,
  defaultValue,
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  id: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { isApproved, discountPct, group, company } = useSession();

  const [step, setStep] = useState(2); // start bij Gegevens; Winkelwagen is afgerond
  const [shipping, setShipping] = useState<string>(SHIPPING_OPTIONS[0].id);
  const [payment, setPayment] = useState<string>(PAYMENT_OPTIONS[0].id);
  const [placed, setPlaced] = useState(false);

  const lines = useMemo(
    () =>
      DEMO_LINES.flatMap((line) => {
        const product = products.find((p) => p.slug === line.slug);
        return product ? [{ product, qty: line.qty }] : [];
      }),
    [],
  );

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, { product, qty }) => sum + qty * product.priceExclVat,
      0,
    );
    const discount = subtotal * (discountPct / 100);
    const netSubtotal = subtotal - discount;
    const shippingCost = shipping === "afhalen" ? 0 : SHIPPING_EXCL_VAT;
    const vat = (netSubtotal + shippingCost) * BTW_RATE;
    const total = netSubtotal + shippingCost + vat;
    return { subtotal, discount, netSubtotal, shipping: shippingCost, vat, total };
  }, [lines, discountPct, shipping]);

  if (!isApproved) return <GatedState />;

  const hasDiscount = discountPct > 0;
  const isLastStep = step === STEPS.length;

  function next() {
    setStep((s) => Math.min(STEPS.length, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(2, s - 1));
  }
  function placeOrder() {
    setPlaced(true);
  }

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">Afrekenen</p>
          <h1 className="text-3xl sm:text-4xl">Bestelling afronden</h1>
        </div>

        <div className="mt-10 overflow-x-auto rounded-card border border-line bg-white px-5 py-4">
          <StepIndicator current={placed ? STEPS.length : step} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* Stap-inhoud */}
          <div>
            {placed ? (
              <div className="rounded-card border border-line bg-white p-8 text-center sm:p-10">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent">
                  <Check className="size-5 text-ink" strokeWidth={2.5} />
                </span>
                <h2 className="mt-6 font-serif text-2xl text-ink">
                  Bedankt voor uw bestelling
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Uw bestelling is geregistreerd. U ontvangt een bevestiging per
                  e-mail met de verdere afhandeling.
                </p>
                <p className="mt-6 text-xs text-muted">
                  Demo: Mollie-betaling wordt nog niet uitgevoerd.
                </p>
                <Link
                  href="/collecties"
                  className={cn(buttonVariants({ variant: "outline" }), "mt-7")}
                >
                  Verder winkelen
                </Link>
              </div>
            ) : (
              <div className="rounded-card border border-line bg-white p-6 sm:p-8">
                {step === 2 ? (
                  <div>
                    <h2 className="font-serif text-xl text-ink">Gegevens</h2>
                    <p className="mt-1 text-sm text-muted">
                      Vul uw factuur- en afleveradres in.
                    </p>

                    <h3 className="mt-7 text-sm font-medium text-ink">Factuuradres</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Bedrijfsnaam"
                        id="bedrijfsnaam"
                        defaultValue={company ?? ""}
                        placeholder="Uw bedrijfsnaam"
                        className="sm:col-span-2"
                      />
                      <Field label="Contactpersoon" id="contactpersoon" placeholder="Voor- en achternaam" />
                      <Field label="E-mailadres" id="email" type="email" placeholder="naam@bedrijf.nl" />
                      <Field label="Straat en huisnummer" id="straat" placeholder="Voorbeeldstraat 12" className="sm:col-span-2" />
                      <Field label="Postcode" id="postcode" placeholder="1234 AB" />
                      <Field label="Plaats" id="plaats" placeholder="Plaatsnaam" />
                      <Field label="Btw-nummer" id="btw" placeholder="NL000000000B00" />
                      <Field label="Telefoonnummer" id="telefoon" type="tel" placeholder="06 12345678" />
                    </div>

                    <h3 className="mt-9 text-sm font-medium text-ink">Afleveradres</h3>
                    <p className="mt-1 text-xs text-muted">
                      Laat leeg om op het factuuradres te leveren.
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Bedrijfsnaam" id="lever-bedrijfsnaam" placeholder="Gelijk aan factuuradres" className="sm:col-span-2" />
                      <Field label="Straat en huisnummer" id="lever-straat" placeholder="Voorbeeldstraat 12" className="sm:col-span-2" />
                      <Field label="Postcode" id="lever-postcode" placeholder="1234 AB" />
                      <Field label="Plaats" id="lever-plaats" placeholder="Plaatsnaam" />
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div>
                    <h2 className="font-serif text-xl text-ink">Verzending</h2>
                    <p className="mt-1 text-sm text-muted">Kies een leveroptie.</p>
                    <div className="mt-6 space-y-3">
                      {SHIPPING_OPTIONS.map((option) => {
                        const selected = shipping === option.id;
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
                              onChange={() => setShipping(option.id)}
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

                {step === 4 ? (
                  <div>
                    <h2 className="font-serif text-xl text-ink">Betaling</h2>
                    <p className="mt-1 text-sm text-muted">Kies een betaalmethode.</p>
                    <div className="mt-6 space-y-3">
                      {PAYMENT_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const selected = payment === option.id && !option.disabled;
                        return (
                          <label
                            key={option.id}
                            className={cn(
                              "flex items-start gap-3 rounded-card border p-4 transition-colors",
                              option.disabled
                                ? "cursor-not-allowed border-line bg-paper/60 opacity-60"
                                : selected
                                  ? "cursor-pointer border-ink bg-paper"
                                  : "cursor-pointer border-line hover:border-ink/40",
                            )}
                          >
                            <input
                              type="radio"
                              name="betaling"
                              value={option.id}
                              checked={selected}
                              disabled={option.disabled}
                              onChange={() => setPayment(option.id)}
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

                {step === 5 ? (
                  <div>
                    <h2 className="font-serif text-xl text-ink">Controle</h2>
                    <p className="mt-1 text-sm text-muted">
                      Controleer uw bestelling voordat u deze plaatst.
                    </p>

                    <ul className="mt-6 divide-y divide-line border-y border-line">
                      {lines.map(({ product, qty }) => {
                        const unitNet = product.priceExclVat * (1 - discountPct / 100);
                        return (
                          <li key={product.slug} className="flex items-center justify-between gap-4 py-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted">
                                {product.brand} · {product.sku} · {qty} stuks
                              </p>
                            </div>
                            <span className="shrink-0 text-sm tabular-nums text-ink">
                              {formatPrice(qty * unitNet)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <dl className="mt-5 space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted">Subtotaal (excl. btw)</dt>
                        <dd className="tabular-nums text-ink">{formatPrice(totals.subtotal)}</dd>
                      </div>
                      {hasDiscount ? (
                        <div className="flex justify-between">
                          <dt className="text-muted">
                            {group}-korting · {discountPct}%
                          </dt>
                          <dd className="tabular-nums text-accent-dark">
                            − {formatPrice(totals.discount)}
                          </dd>
                        </div>
                      ) : null}
                      <div className="flex justify-between">
                        <dt className="text-muted">Verzendkosten</dt>
                        <dd className="tabular-nums text-ink">
                          {totals.shipping > 0 ? formatPrice(totals.shipping) : "Gratis"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">Btw 21%</dt>
                        <dd className="tabular-nums text-ink">{formatPrice(totals.vat)}</dd>
                      </div>
                      <div className="flex justify-between border-t border-line pt-2.5 text-base">
                        <dt className="font-medium text-ink">Totaal (incl. btw)</dt>
                        <dd className="font-medium tabular-nums text-ink">
                          {formatPrice(totals.total)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : null}

                {/* Stap-navigatie */}
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
                  {step > 2 ? (
                    <Button variant="outline" onClick={prev}>
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
                    <Button onClick={placeOrder}>
                      Bestelling plaatsen
                      <Check className="size-4" strokeWidth={2} />
                    </Button>
                  ) : (
                    <Button onClick={next}>
                      Volgende
                      <ArrowRight className="size-4" strokeWidth={1.75} />
                    </Button>
                  )}
                </div>
              </div>
            )}

            <p className="mt-6 text-xs text-muted">
              Demo-checkout — nog niet gekoppeld aan backend.
            </p>
          </div>

          {/* Compact besteloverzicht */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line bg-white p-6">
              <h2 className="font-serif text-xl text-ink">Uw bestelling</h2>

              <ul className="mt-5 space-y-2.5 border-b border-line pb-5 text-sm">
                {lines.map(({ product, qty }) => {
                  const unitNet = product.priceExclVat * (1 - discountPct / 100);
                  return (
                    <li key={product.slug} className="flex justify-between gap-3">
                      <span className="min-w-0 text-muted">
                        <span className="text-ink/80">{qty}×</span> {product.name}
                      </span>
                      <span className="shrink-0 tabular-nums text-ink">
                        {formatPrice(qty * unitNet)}
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
                      {group}-korting · {discountPct}%
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
