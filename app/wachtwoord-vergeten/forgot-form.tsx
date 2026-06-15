"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { requestPasswordReset } from "./actions";

const inputClass =
  "h-11 w-full rounded-card border border-line bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export function ForgotForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);
  const t = useTranslations("wachtwoord.vergeten");

  if (state?.ok) {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
          <Check className="size-7" strokeWidth={1.75} />
        </span>
        <h2 className="mt-5 font-serif text-2xl text-ink">{t("succesTitle")}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          {t("succesText")}
        </p>
        <Link href="/login" className={buttonVariants({ variant: "outline", size: "md", className: "mt-6" })}>
          {t("terugInloggen")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white p-6 sm:p-8">
      <form action={formAction} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className={labelClass}>{t("email")}</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="naam@bedrijf.nl" className={inputClass} />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
          {pending ? t("bezig") : t("verstuur")}
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </Button>
      </form>
    </div>
  );
}
