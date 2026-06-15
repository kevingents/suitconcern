import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, LogIn } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common");
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {/* Achtergrond — placeholder voor full-width hero fotografie */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-800 via-ink to-black" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_75%_20%,rgba(200,178,138,0.18),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(17,17,17,0.85),rgba(17,17,17,0.35))]" />

      <Container className="flex min-h-[78vh] max-w-[1280px] flex-col justify-center py-24 lg:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">{t("label")}</p>
          <h1 className="mt-5 whitespace-pre-line font-serif text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/collecties"
              className={cn(buttonVariants({ variant: "light", size: "lg" }))}
            >
              {tc("bekijkCollecties")}
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "light-outline", size: "lg" }))}
            >
              <LogIn className="size-4" strokeWidth={1.75} />
              {tc("b2bInloggen")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
