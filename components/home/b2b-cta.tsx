import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function B2bCta() {
  const t = useTranslations("home.b2bCta");
  const tc = useTranslations("common");
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-card bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(200,178,138,0.22),transparent_60%)]" />
          <p className="eyebrow text-accent">{t("eyebrow")}</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
            {t("description")}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/b2b-account-aanvragen"
              className={cn(buttonVariants({ variant: "light", size: "lg" }))}
            >
              {tc("accountAanvragen")}
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "light-outline", size: "lg" }))}
            >
              {tc("contactOpnemen")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
