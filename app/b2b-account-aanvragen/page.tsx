"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
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
  {
    icon: Tag,
    title: "Prijzen & voorraad zichtbaar",
    description: "Netto inkoopprijzen en actuele voorraad per maat en kleur.",
  },
  {
    icon: ShoppingCart,
    title: "Online bestellen",
    description: "Plaats orders direct in de portal, 24/7 en zonder tussenkomst.",
  },
  {
    icon: Repeat,
    title: "Herhaalbestellingen",
    description: "Eerdere orders in één klik opnieuw plaatsen of aanvullen.",
  },
  {
    icon: Layers,
    title: "Staffelkorting",
    description: "Oplopende korting op basis van uw klantgroep en volume.",
  },
  {
    icon: FileText,
    title: "Catalogus-download",
    description: "Volledige collectie met specificaties en beeldmateriaal.",
  },
  {
    icon: Boxes,
    title: "Voorraadprogramma",
    description: "Kerncollectie die het hele jaar door direct leverbaar is.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Aanvraag indienen",
    description: "Vul het formulier in met uw bedrijfs- en contactgegevens.",
  },
  {
    icon: Search,
    title: "Wij beoordelen",
    description: "Wij toetsen uw aanvraag handmatig, doorgaans binnen één werkdag.",
  },
  {
    icon: KeyRound,
    title: "Goedkeuring & toegang",
    description: "Na akkoord ontvangt u inloggegevens en ziet u prijzen en voorraad.",
  },
];

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
          <p className="eyebrow mb-3 text-accent-dark">Word dealer</p>
          <h1 className="text-4xl sm:text-5xl">B2B-account aanvragen</h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Suitconcern is een besloten groothandel. Prijzen, voorraad en de
            mogelijkheid om te bestellen worden pas zichtbaar na een persoonlijke
            beoordeling. Na het indienen krijgt uw aanvraag de status{" "}
            <span className="font-medium text-ink">In behandeling</span>; zodra wij
            uw account goedkeuren ontvangt u toegang tot de volledige portal.
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
                <h2 className="mt-6 text-2xl sm:text-3xl">Bedankt voor uw aanvraag</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
                  Uw aanvraag heeft nu de status{" "}
                  <span className="font-medium text-ink">In behandeling</span>. Ons
                  team beoordeelt uw gegevens en neemt doorgaans binnen één werkdag
                  contact met u op. U ontvangt een bevestigingsmail op het opgegeven
                  e-mailadres.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    Terug naar home
                  </Link>
                  <Link
                    href="/login"
                    className={buttonVariants({ variant: "outline", size: "md" })}
                  >
                    Naar inloggen
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-card border border-line bg-white p-6 sm:p-8 lg:p-10">
                <form action={formAction} className="space-y-10" noValidate>
                  {/* Bedrijfsgegevens */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>Bedrijfsgegevens</FieldsetHeading>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="bedrijfsnaam" className={labelClass}>
                          Bedrijfsnaam
                          <Required />
                        </label>
                        <input
                          id="bedrijfsnaam"
                          name="bedrijfsnaam"
                          type="text"
                          required
                          autoComplete="organization"
                          placeholder="Modehuis Berends"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="kvk" className={labelClass}>
                          KvK-nummer
                          <Required />
                        </label>
                        <input
                          id="kvk"
                          name="kvk"
                          type="text"
                          required
                          inputMode="numeric"
                          placeholder="12345678"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="btw" className={labelClass}>
                          Btw-nummer
                        </label>
                        <input
                          id="btw"
                          name="btw"
                          type="text"
                          placeholder="NL000000000B00"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="typeBedrijf" className={labelClass}>
                          Type bedrijf
                        </label>
                        <select
                          id="typeBedrijf"
                          name="typeBedrijf"
                          defaultValue="Herenmodezaak"
                          className={inputClass}
                        >
                          <option value="Herenmodezaak">Herenmodezaak</option>
                          <option value="Bruidszaak/trouwmode">
                            Bruidszaak / trouwmode
                          </option>
                          <option value="Kostuumverhuur">Kostuumverhuur</option>
                          <option value="Bedrijfskleding-specialist">
                            Bedrijfskleding-specialist
                          </option>
                          <option value="Retailer/warenhuis">
                            Retailer / warenhuis
                          </option>
                          <option value="Anders">Anders</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="website" className={labelClass}>
                          Website
                        </label>
                        <input
                          id="website"
                          name="website"
                          type="url"
                          autoComplete="url"
                          placeholder="https://www.uwbedrijf.nl"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Contactpersoon */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>Contactpersoon</FieldsetHeading>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="contactpersoon" className={labelClass}>
                          Contactpersoon
                          <Required />
                        </label>
                        <input
                          id="contactpersoon"
                          name="contactpersoon"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Voor- en achternaam"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          E-mailadres
                          <Required />
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="naam@bedrijf.nl"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="telefoon" className={labelClass}>
                          Telefoonnummer
                          <Required />
                        </label>
                        <input
                          id="telefoon"
                          name="telefoon"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="+31 6 12 34 56 78"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Adres */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>Adres</FieldsetHeading>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="adres" className={labelClass}>
                          Adres
                          <Required />
                        </label>
                        <input
                          id="adres"
                          name="adres"
                          type="text"
                          required
                          autoComplete="street-address"
                          placeholder="Straatnaam en huisnummer"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="postcode" className={labelClass}>
                          Postcode
                          <Required />
                        </label>
                        <input
                          id="postcode"
                          name="postcode"
                          type="text"
                          required
                          autoComplete="postal-code"
                          placeholder="1234 AB"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="plaats" className={labelClass}>
                          Plaats
                          <Required />
                        </label>
                        <input
                          id="plaats"
                          name="plaats"
                          type="text"
                          required
                          autoComplete="address-level2"
                          placeholder="Plaatsnaam"
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="land" className={labelClass}>
                          Land
                        </label>
                        <select
                          id="land"
                          name="land"
                          defaultValue="Nederland"
                          className={inputClass}
                        >
                          <option value="Nederland">Nederland</option>
                          <option value="België">België</option>
                          <option value="Duitsland">Duitsland</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  {/* Aanvullend */}
                  <fieldset className="space-y-5">
                    <FieldsetHeading>Aanvullend</FieldsetHeading>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="ordervolume" className={labelClass}>
                          Verwacht ordervolume
                        </label>
                        <select
                          id="ordervolume"
                          name="ordervolume"
                          defaultValue="€10k–€50k"
                          className={inputClass}
                        >
                          <option value="< €10k">Minder dan €10k per jaar</option>
                          <option value="€10k–€50k">€10k – €50k per jaar</option>
                          <option value="€50k–€100k">€50k – €100k per jaar</option>
                          <option value="> €100k">Meer dan €100k per jaar</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bericht" className={labelClass}>
                          Bericht / opmerking
                        </label>
                        <textarea
                          id="bericht"
                          name="bericht"
                          rows={4}
                          placeholder="Vertel ons kort iets over uw onderneming of specifieke wensen."
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
                        Ik ga akkoord met de{" "}
                        <Link
                          href="/algemene-voorwaarden"
                          className="font-medium text-ink underline underline-offset-4 hover:text-accent-dark"
                        >
                          algemene voorwaarden
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
                      {pending ? "Bezig…" : "Aanvraag versturen"}
                      <ArrowRight className="size-4" strokeWidth={1.75} />
                    </Button>
                    <p className="text-xs leading-relaxed text-muted">
                      Na het indienen krijgt uw aanvraag de status &ldquo;In behandeling&rdquo;.
                      E-mailbevestiging volgt zodra de mailkoppeling live is.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Reassurance / benefits */}
          <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-28">
            <div className="rounded-card border border-line bg-white p-6 sm:p-8">
              <p className="eyebrow text-accent-dark">Na goedkeuring</p>
              <h2 className="mt-3 font-serif text-2xl">Wat u krijgt</h2>
              <ul className="mt-6 space-y-5">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <li key={benefit.title} className="flex gap-4">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-card bg-paper text-accent-dark">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {benefit.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted">
                          {benefit.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-card bg-ink p-6 text-white sm:p-8">
              <p className="eyebrow text-accent">Zo werkt het</p>
              <ol className="mt-6 space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className="flex gap-4">
                      <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-card bg-white/10 text-accent">
                        <Icon className="size-5" strokeWidth={1.5} />
                        <span className="absolute -right-1.5 -top-1.5 inline-flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-ink">
                          {index + 1}
                        </span>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-white/70">
                          {step.description}
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
