import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { brands } from "@/lib/data";

export const metadata = {
  title: "Merken",
  description:
    "Een selectie toonaangevende merken in het Suitconcern-assortiment. Van Duits vakmanschap tot Italiaanse snit — zorgvuldig gekozen op kwaliteit en pasvorm.",
};

export default function MerkenPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <p className="eyebrow text-accent">Merken</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
            Toonaangevende merken, zorgvuldig gekozen
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Wij voeren een selectie merken die zich bewezen hebben in pasvorm,
            kwaliteit en doorverkoop. Stuk voor stuk gekozen omdat ze passen bij
            de eisen van de speciaalzaak.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Ons merkenhuis"
            title="De merken die wij voeren"
            description="Van klassieke ceremonie tot moderne business — elk merk vult het assortiment aan met een eigen handschrift."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col rounded-card border border-line bg-white p-7"
              >
                <h2 className="font-serif text-2xl text-ink">{brand.name}</h2>
                <p className="mt-2 text-sm text-muted">{brand.note}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
                  Bekijk producten
                  <ArrowRight className="size-4" strokeWidth={1.75} />
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-card bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(200,178,138,0.22),transparent_60%)]" />
            <p className="eyebrow text-accent">Toegang tot het assortiment</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">
              Bekijk prijzen en voorraad per merk
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Prijzen en actuele voorraad zijn zichtbaar voor goedgekeurde
              B2B-accounts. Vraag toegang aan of log in om het volledige
              assortiment te ontdekken.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/b2b-account-aanvragen"
                className={buttonVariants({ variant: "light", size: "lg" })}
              >
                Account aanvragen
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "light-outline", size: "lg" })}
              >
                Contact opnemen
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
