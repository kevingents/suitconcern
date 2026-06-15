"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ArrowRight,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Heart,
  History,
  LogIn,
  LogOut,
  Repeat,
  Settings,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";

const dashboardCards = [
  {
    icon: ClipboardList,
    title: "Openstaande orders",
    description: "Volg de status van uw lopende bestellingen en leveringen.",
    href: "#",
  },
  {
    icon: History,
    title: "Bestelhistorie",
    description: "Bekijk en herhaal eerder geplaatste bestellingen.",
    href: "#",
  },
  {
    icon: FileText,
    title: "Facturen",
    description: "Download uw facturen en pakbonnen per order.",
    href: "#",
  },
  {
    icon: Download,
    title: "Downloads",
    description: "Actuele catalogus, prijslijsten en productdata.",
    href: "#",
  },
  {
    icon: Heart,
    title: "Favorieten",
    description: "Uw opgeslagen artikelen voor een snelle herbestelling.",
    href: "#",
  },
  {
    icon: Zap,
    title: "Snel bestellen",
    description: "Voeg artikelen toe op SKU en bestel in enkele klikken.",
    href: "#",
  },
  {
    icon: Repeat,
    title: "Herhaalbestellingen",
    description: "Stel terugkerende orders in voor uw vaste assortiment.",
    href: "#",
  },
];

export default function AccountPage() {
  const { status, company, group, discountPct, isAdmin, demo } = useSession();

  if (status === "guest") {
    return (
      <section className="bg-paper py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-xl rounded-card border border-line bg-white p-8 text-center sm:p-12">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
              <LogIn className="size-6" strokeWidth={1.5} />
            </span>
            <h1 className="mt-6 font-serif text-3xl text-ink">
              Log in op uw account
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Prijzen, voorraad en bestellen zijn beschikbaar voor goedgekeurde
              B2B-accounts. Log in om uw dashboard te openen, of vraag een
              account aan.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Inloggen
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/b2b-account-aanvragen"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Account aanvragen
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (status === "pending") {
    return (
      <section className="bg-paper py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-xl rounded-card border border-line bg-white p-8 text-center sm:p-12">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
              <Clock className="size-6" strokeWidth={1.5} />
            </span>
            <h1 className="mt-6 font-serif text-3xl text-ink">
              Uw account wordt beoordeeld
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Bedankt voor uw aanvraag{company ? ` namens ${company}` : ""}. Uw
              account is in behandeling — zodra het is goedgekeurd, krijgt u
              toegang tot prijzen, voorraad en het volledige bestelgemak.
              Bestellen is nog niet beschikbaar.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Goedkeuring volgt persoonlijk en doorgaans binnen één werkdag. Bij
              vragen kunt u altijd contact met ons opnemen.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Contact opnemen
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-14 lg:py-16">
          <p className="eyebrow text-accent">Mijn account</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl">Welkom terug</h1>
              {company ? (
                <p className="mt-3 text-lg text-white/80">{company}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-card border border-white/20 px-4 py-2 text-sm text-white/80">
                Klantgroep
                <span className="font-medium text-accent">{group}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-card border border-white/20 px-4 py-2 text-sm text-white/80">
                Korting
                <span className="font-medium text-accent">{discountPct}%</span>
              </span>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className={cn(buttonVariants({ variant: "light", size: "sm" }))}
                >
                  <Settings className="size-4" strokeWidth={1.75} />
                  Beheer
                </Link>
              ) : null}
              {!demo ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={cn(buttonVariants({ variant: "light-outline", size: "sm" }))}
                >
                  <LogOut className="size-4" strokeWidth={1.75} />
                  Uitloggen
                </button>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 lg:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex flex-col rounded-card border border-line bg-white p-7 transition-colors hover:border-ink"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h2 className="mt-5 font-serif text-lg text-ink">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {card.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-accent-dark">
                    Openen
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
