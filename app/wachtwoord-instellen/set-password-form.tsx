"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { setPassword } from "./actions";

const inputClass =
  "h-11 w-full rounded-card border border-line bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export function SetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(setPassword, null);

  if (state?.ok) {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
          <Check className="size-7" strokeWidth={1.75} />
        </span>
        <h2 className="mt-5 font-serif text-2xl text-ink">Wachtwoord ingesteld</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Uw wachtwoord is opgeslagen. U kunt nu inloggen op uw account.
        </p>
        <Link href="/login" className={buttonVariants({ variant: "primary", size: "lg", className: "mt-6" })}>
          Naar inloggen
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <h2 className="font-serif text-2xl text-ink">Ongeldige link</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Deze link is ongeldig of incompleet. Vraag een nieuwe aan via &ldquo;wachtwoord
          vergeten&rdquo;.
        </p>
        <Link href="/wachtwoord-vergeten" className={buttonVariants({ variant: "outline", size: "md", className: "mt-6" })}>
          Nieuwe link aanvragen
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white p-6 sm:p-8">
      <form action={formAction} className="space-y-5" noValidate>
        <input type="hidden" name="token" value={token} />
        <div>
          <label htmlFor="password" className={labelClass}>Nieuw wachtwoord</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Minimaal 8 tekens" className={inputClass} />
        </div>
        <div>
          <label htmlFor="confirm" className={labelClass}>Bevestig wachtwoord</label>
          <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" placeholder="Herhaal het wachtwoord" className={inputClass} />
        </div>
        {state?.error ? (
          <p className="rounded-card bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
          {pending ? "Bezig…" : "Wachtwoord instellen"}
        </Button>
        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted">
          <Lock className="size-3.5 text-accent-dark" strokeWidth={1.75} />
          Uw wachtwoord wordt versleuteld opgeslagen.
        </p>
      </form>
    </div>
  );
}
