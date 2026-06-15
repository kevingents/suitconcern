"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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
  { icon: ClipboardList, key: "orders", href: "#" },
  { icon: History, key: "historie", href: "#" },
  { icon: FileText, key: "facturen", href: "#" },
  { icon: Download, key: "downloads", href: "#" },
  { icon: Heart, key: "favorieten", href: "/account/favorieten" },
  { icon: Zap, key: "snel", href: "/snel-bestellen" },
  { icon: Repeat, key: "herhaal", href: "#" },
] as const;

export default function AccountPage() {
  const { status, company, group, discountPct, isAdmin, demo } = useSession();
  const t = useTranslations("account");

  if (status === "guest") {
    return (
      <section className="bg-paper py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-xl rounded-card border border-line bg-white p-8 text-center sm:p-12">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
              <LogIn className="size-6" strokeWidth={1.5} />
            </span>
            <h1 className="mt-6 font-serif text-3xl text-ink">
              {t("guest.title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("guest.text")}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                {t("guest.inloggen")}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/b2b-account-aanvragen"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {t("guest.accountAanvragen")}
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
              {t("pending.title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t("pending.text", {
                namens: company ? t("pending.namens", { company }) : "",
              })}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{t("pending.text2")}</p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {t("pending.contact")}
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
          <p className="eyebrow text-accent">{t("eyebrow")}</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl">{t("welkom")}</h1>
              {company ? (
                <p className="mt-3 text-lg text-white/80">{company}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-card border border-white/20 px-4 py-2 text-sm text-white/80">
                {t("klantgroep")}
                <span className="font-medium text-accent">{group}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-card border border-white/20 px-4 py-2 text-sm text-white/80">
                {t("korting")}
                <span className="font-medium text-accent">{discountPct}%</span>
              </span>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className={cn(buttonVariants({ variant: "light", size: "sm" }))}
                >
                  <Settings className="size-4" strokeWidth={1.75} />
                  {t("beheer")}
                </Link>
              ) : null}
              {!demo ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={cn(buttonVariants({ variant: "light-outline", size: "sm" }))}
                >
                  <LogOut className="size-4" strokeWidth={1.75} />
                  {t("uitloggen")}
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
                  key={card.key}
                  href={card.href}
                  className="group flex flex-col rounded-card border border-line bg-white p-7 transition-colors hover:border-ink"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h2 className="mt-5 font-serif text-lg text-ink">
                    {t(`cards.${card.key}Title`)}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`cards.${card.key}Desc`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-accent-dark">
                    {t("openen")}
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
