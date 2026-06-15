"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { ArrowRight, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/session";

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

const inputClass =
  "h-11 w-full rounded-card border border-line bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export default function LoginPage() {
  const router = useRouter();
  const { setDemoStatus } = useSession();
  const t = useTranslations("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!AUTH_ENABLED) {
      // Demo-modus: simuleer een goedgekeurd account.
      setDemoStatus("approved");
      router.push("/account");
      return;
    }

    const form = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") || ""),
      password: String(form.get("wachtwoord") || ""),
      redirect: false,
    });
    setSubmitting(false);
    if (res?.error) {
      setError(t("fout"));
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <section className="bg-paper py-16 lg:py-24">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <p className="eyebrow text-accent-dark">{t("eyebrow")}</p>
            <h1 className="mt-3 text-4xl">{t("title")}</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {t("subtitle")}
            </p>
          </div>

          <div className="mt-8 rounded-card border border-line bg-white p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className={labelClass}>
                  {t("email")}
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
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <label htmlFor="wachtwoord" className="text-sm font-medium text-ink">
                    {t("wachtwoord")}
                  </label>
                  <Link
                    href="/wachtwoord-vergeten"
                    className="text-xs font-medium text-accent-dark underline-offset-4 hover:underline"
                  >
                    {t("wachtwoordVergeten")}
                  </Link>
                </div>
                <input
                  id="wachtwoord"
                  name="wachtwoord"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <label
                htmlFor="onthoud"
                className="flex items-center gap-3 text-sm text-ink"
              >
                <input
                  id="onthoud"
                  name="onthoud"
                  type="checkbox"
                  className="size-4 shrink-0 rounded border-line text-ink accent-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
                {t("onthoudMij")}
              </label>

              {error ? (
                <p className="rounded-card bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? t("bezig") : t("inloggen")}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Button>

              {!AUTH_ENABLED ? (
                <p className="text-xs leading-relaxed text-muted">
                  {t("demo")}
                </p>
              ) : null}
            </form>
          </div>

          <div className="mt-8 border-t border-line pt-8 text-center">
            <p className="text-sm text-muted">{t("nogGeenAccount")}</p>
            <Link
              href="/b2b-account-aanvragen"
              className={buttonVariants({
                variant: "outline",
                size: "md",
                className: "mt-3 w-full sm:w-auto",
              })}
            >
              {t("accountAanvragen")}
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs leading-relaxed text-muted">
            <Lock className="size-3.5 shrink-0 text-accent-dark" strokeWidth={1.75} />
            {t("lockLine")}
          </p>
        </div>
      </Container>
    </section>
  );
}
