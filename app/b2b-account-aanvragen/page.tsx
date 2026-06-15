"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { requestAccount } from "./actions";
import {
  ArrowRight,
  Check,
  Tag,
  Boxes,
  ShoppingCart,
  Repeat,
  Layers,
  FileText,
  ClipboardList,
  Search,
  KeyRound,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

const benefits = [
  { icon: Tag, key: "Prijzen" },
  { icon: ShoppingCart, key: "Bestellen" },
  { icon: Repeat, key: "Herhaal" },
  { icon: Layers, key: "Staffel" },
  { icon: FileText, key: "Catalogus" },
  { icon: Boxes, key: "Voorraad" },
] as const;

const steps = [
  { icon: ClipboardList, key: "Indienen" },
  { icon: Search, key: "Beoordelen" },
  { icon: KeyRound, key: "Toegang" },
] as const;

const inputClass =
  "h-11 w-full rounded-card border border-line bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

function FieldsetHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-lg text-ink">
      {children}
    </h3>
  );
}

function Required() {
  return <span className="text-accent-dark"> *</span>;
}

export default function B2bAccountAanvragenPage() {
  const [state, formAction, pending] = useActionState(requestAccount, null);
  const t = useTranslations("aanvraag");
  const submitted = state?.ok === true;

  useEffect(() => {
    if (submitted && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitted]);

  return (
    <section className="bg-paper py-16 lg:py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="eyebrow mb-3 text-accent-dark">{t("eyebrow")}</p>
          <h1 className="text-4xl sm:text-5xl">{t("title")}</h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {t.rich("intro", {
              b: (chunks) => <span className="font-medium text-ink">{chunks}</span>,
            })}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[1fr_minmax(320px,400px)] lg:items-start lg:gap-8">
          {/* Formulier */}
          <div className="order-2 lg:order-1">
            {submitted ? (
              <div className="rounded-card border border-line bg-white p-8 text-center sm:p-12">
                <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
                  <Check className="size-8" strokeWidth={1.75} />
                </span>
                <h2 className="mt-6 text-2xl sm:text-3xl">{t("succesTitle")}</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
                  {t.rich("succesText", {
                    b: (chunks) => <span className="font-medium text-ink">{chunks}</span>,
                  })}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    {t("terugHome")}
                  </Link>
                  <Link
                    href="/login"
                    className={buttonVariants({ variant: "outline", size: "md" })}
                  >
                    {t("naarInloggen")}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-card border border-line bg-white p-6 sm:p-8 lg:p-10">
                <form action={formAction} className="space-y-10" noValidate>
                  {/* Bedrijfsgegevens */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>{t("bedrijfsgegevens")}</FieldsetHeading>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="bedrijfsnaam" className={labelClass}>
                          {t("bedrijfsnaam")}
                          <Required />
                        </label>
                        <input
                          id="bedrijfsnaam"
                          name="bedrijfsnaam"
                          type="text"
                          required
                          autoComplete="organization"
                          placeholder={t("bedrijfsnaamPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="kvk" className={labelClass}>
                          {t("kvk")}
                          <Required />
                        </label>
                        <input
                          id="kvk"
                          name="kvk"
                          type="text"
                          required
                          inputMode="numeric"
                          placeholder={t("kvkPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="btw" className={labelClass}>
                          {t("btw")}
                        </label>
                        <input
                          id="btw"
                          name="btw"
                          type="text"
                          placeholder={t("btwPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="typeBedrijf" className={labelClass}>
                          {t("typeBedrijf")}
                        </label>
                        <select
                          id="typeBedrijf"
                          name="typeBedrijf"
                          defaultValue="Herenmodezaak"
                          className={inputClass}
                        >
                          <option value="Herenmodezaak">{t("typeHerenmode")}</option>
                          <option value="Bruidszaak/trouwmode">{t("typeBruid")}</option>
                          <option value="Kostuumverhuur">{t("typeVerhuur")}</option>
                          <option value="Bedrijfskleding-specialist">
                            {t("typeBedrijfskleding")}
                          </option>
                          <option value="Retailer/warenhuis">{t("typeRetail")}</option>
                          <option value="Anders">{t("typeAnders")}</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="website" className={labelClass}>
                          {t("website")}
                        </label>
                        <input
                          id="website"
                          name="website"
                          type="url"
                          autoComplete="url"
                          placeholder={t("websitePlaceholder")}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Contactpersoon */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>{t("contactpersoonHeading")}</FieldsetHeading>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="contactpersoon" className={labelClass}>
                          {t("contactpersoon")}
                          <Required />
                        </label>
                        <input
                          id="contactpersoon"
                          name="contactpersoon"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder={t("contactpersoonPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          {t("email")}
                          <Required />
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder={t("emailPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="telefoon" className={labelClass}>
                          {t("telefoon")}
                          <Required />
                        </label>
                        <input
                          id="telefoon"
                          name="telefoon"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder={t("telefoonPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Adres */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>{t("adresHeading")}</FieldsetHeading>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="adres" className={labelClass}>
                          {t("adres")}
                          <Required />
                        </label>
                        <input
                          id="adres"
                          name="adres"
                          type="text"
                          required
                          autoComplete="street-address"
                          placeholder={t("adresPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="postcode" className={labelClass}>
                          {t("postcode")}
                          <Required />
                        </label>
                        <input
                          id="postcode"
                          name="postcode"
                          type="text"
                          required
                          autoComplete="postal-code"
                          placeholder={t("postcodePlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="plaats" className={labelClass}>
                          {t("plaats")}
                          <Required />
                        </label>
                        <input
                          id="plaats"
                          name="plaats"
                          type="text"
                          required
                          autoComplete="address-level2"
                          placeholder={t("plaatsPlaceholder")}
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="land" className={labelClass}>
                          {t("land")}
                        </label>
                        <select
                          id="land"
                          name="land"
                          defaultValue="Nederland"
                          className={inputClass}
                        >
                          <option value="Nederland">{t("landNl")}</option>
                          <option value="België">{t("landBe")}</option>
                          <option value="Duitsland">{t("landDe")}</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  {/* Aanvullend */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>{t("aanvullend")}</FieldsetHeading>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="ordervolume" className={labelClass}>
                          {t("ordervolume")}
                        </label>
                        <select
                          id="ordervolume"
                          name="ordervolume"
                          defaultValue="€10k–€50k"
                          className={inputClass}
                        >
                          <option value="< €10k">{t("ordervolumeKlein")}</option>
                          <option value="€10k–€50k">{t("ordervolumeMiddel")}</option>
                          <option value="€50k–€100k">{t("ordervolumeGroot")}</option>
                          <option value="> €100k">{t("ordervolumeXl")}</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bericht" className={labelClass}>
                          {t("bericht")}
                        </label>
                        <textarea
                          id="bericht"
                          name="bericht"
                          rows={4}
                          placeholder={t("berichtPlaceholder")}
                          className="w-full rounded-card border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Voorwaarden */}
                  <div className="border-t border-line pt-6">
                    <label
                      htmlFor="voorwaarden"
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink"
                    >
                      <input
                        id="voorwaarden"
                        name="voorwaarden"
                        type="checkbox"
                        required
                        className="mt-0.5 size-4 shrink-0 rounded border-line text-ink accent-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      />
                      <span>
                        {t("akkoordPre")}
                        <Link
                          href="/algemene-voorwaarden"
                          className="font-medium text-ink underline underline-offset-4 hover:text-accent-dark"
                        >
                          {t("akkoordLink")}
                        </Link>
                        .<Required />
                      </span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    {state?.error ? (
                      <p className="rounded-card bg-red-50 px-3 py-2 text-sm text-red-700">
                        {state.error}
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={pending}
                    >
                      {pending ? t("bezig") : t("versturen")}
                      <ArrowRight className="size-4" strokeWidth={1.75} />
                    </Button>
                    <p className="text-xs leading-relaxed text-muted">{t("mailNote")}</p>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Reassurance / benefits */}
          <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-28">
            <div className="rounded-card border border-line bg-white p-6 sm:p-8">
              <p className="eyebrow text-accent-dark">{t("naGoedkeuring")}</p>
              <h2 className="mt-3 font-serif text-2xl">{t("watUKrijgt")}</h2>
              <ul className="mt-6 space-y-5">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <li key={benefit.key} className="flex gap-4">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-card bg-paper text-accent-dark">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {t(`benefit${benefit.key}Title`)}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted">
                          {t(`benefit${benefit.key}Desc`)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-card bg-ink p-6 text-white sm:p-8">
              <p className="eyebrow text-accent">{t("zoWerktHet")}</p>
              <ol className="mt-6 space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.key} className="flex gap-4">
                      <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-card bg-white/10 text-accent">
                        <Icon className="size-5" strokeWidth={1.5} />
                        <span className="absolute -right-1.5 -top-1.5 inline-flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-ink">
                          {index + 1}
                        </span>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {t(`step${step.key}Title`)}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-white/70">
                          {t(`step${step.key}Desc`)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
