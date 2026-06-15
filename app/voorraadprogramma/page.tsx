import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { buttonVariants } from "@/components/ui/button";
import { collections } from "@/lib/data";

export const metadata = {
  title: "Voorraadprogramma",
  description:
    "Het never-out-of-stock voorraadprogramma van Suitconcern: een vaste kerncollectie die altijd leverbaar is, met directe naleveringen en zonder seizoensrisico.",
};

const steps = [
  {
    step: "01",
    title: "Kies uit de kerncollectie",
    description:
      "Selecteer de modellen, kleuren en maten uit het vaste assortiment die passen bij uw klantenkring.",
  },
  {
    step: "02",
    title: "Bestel wat u nodig heeft",
    description:
      "Bestel precies de aantallen die u nu verkoopt — geen voorraadrisico en geen onnodige inkoop.",
  },
  {
    step: "03",
    title: "Bestel moeiteloos na",
    description:
      "Verkocht? Bestel dezelfde dag bij en ontvang uw nalevering snel uit ons centrale magazijn.",
  },
];

const benefits = [
  "Vaste kerncollectie, het hele jaar leverbaar",
  "Directe naleveringen vanuit voorraad",
  "Geen seizoensrisico of restpartijen",
  "Consistente pasvorm en kwaliteit per model",
  "Volledige matenrange continu beschikbaar",
  "Bestel klein in en vul moeiteloos aan",
];

const stockCollections = collections.filter((collection) => collection.featured);

export default function VoorraadprogrammaPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <p className="eyebrow text-accent">Never out of stock</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
            Altijd leverbaar, zonder voorraadrisico
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Het voorraadprogramma is de ruggengraat van uw assortiment: een
            vaste kerncollectie die altijd uit voorraad leverbaar is. Directe
            naleveringen, geen seizoensrisico en altijd dezelfde betrouwbare
            pasvorm.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Het principe"
              title="Een kerncollectie waar u op kunt bouwen"
              description="Geen uitverkochte maten en geen gemiste verkoop. Wat verkocht is, bestelt u eenvoudig na — zo houdt u uw rekken altijd gevuld zonder zelf grote voorraden aan te hoeven houden."
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
              <p>
                Het voorraadprogramma draait om voorspelbaarheid. De modellen in
                de kerncollectie blijven seizoen na seizoen beschikbaar, in de
                volledige matenrange. Zo investeert u in doorverkoop in plaats
                van in risico.
              </p>
            </div>
          </div>
          <div>
            <PlaceholderImage
              tone="from-neutral-800 to-black"
              ratio="aspect-[4/3]"
              label="Kerncollectie uit voorraad"
              className="rounded-card"
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Hoe het werkt"
            title="In drie stappen op voorraad"
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.step}
                className="rounded-card border border-line bg-white p-8"
              >
                <span className="font-serif text-3xl text-accent-dark">
                  {step.step}
                </span>
                <h3 className="mt-4 font-serif text-lg text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="De voordelen"
              title="Wat het programma u oplevert"
            />
            <ul className="mt-8 space-y-3.5">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-ink/80"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-dark">
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-accent-dark">In het programma</p>
            <h2 className="mt-3 text-3xl text-ink sm:text-4xl">
              Categorieën uit voorraad
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Deze categorieën vormen de kern van het voorraadprogramma en zijn
              continu leverbaar.
            </p>
            <div className="mt-8 space-y-3">
              {stockCollections.map((collection) => (
                <div
                  key={collection.slug}
                  className="flex items-center justify-between rounded-card border border-line bg-paper px-5 py-4"
                >
                  <div>
                    <p className="font-serif text-base text-ink">
                      {collection.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {collection.description}
                    </p>
                  </div>
                  <span className="ml-4 shrink-0 text-sm text-muted">
                    {collection.count} artikelen
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper pb-20 lg:pb-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-card bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(200,178,138,0.22),transparent_60%)]" />
            <p className="eyebrow text-accent">Aan de slag</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">
              Houd uw rekken altijd gevuld
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Vraag een B2B-account aan of log in om de actuele voorraad en
              prijzen van het volledige programma te bekijken.
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
                href="/login"
                className={buttonVariants({ variant: "light-outline", size: "lg" })}
              >
                Inloggen
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
