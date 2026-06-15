import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function B2bCta() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-card bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(200,178,138,0.22),transparent_60%)]" />
          <p className="eyebrow text-accent">Word dealer</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">
            Klaar om samen te werken?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Vraag een B2B-account aan en krijg toegang tot prijzen, voorraad en
            het volledige bestelgemak. Goedkeuring volgt persoonlijk en snel.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/b2b-account-aanvragen"
              className={cn(buttonVariants({ variant: "light", size: "lg" }))}
            >
              Account aanvragen
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "light-outline", size: "lg" }))}
            >
              Contact opnemen
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
