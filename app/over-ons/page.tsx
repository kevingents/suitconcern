import Link from "next/link";
import {
  ArrowRight,
  Headset,
  Ruler,
  Truck,
  Warehouse,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Over ons",
  description:
    "Suitconcern is de B2B-groothandel in gala- en bedrijfskleding. Een vaste partner voor retailers en speciaalzaken, met voorraadzekerheid, een grote matenrange en persoonlijke service.",
};

const values = [
  {
    icon: Warehouse,
    title: "Groothandel specialist",
    description:
      "Al ruim twintig jaar de vaste partner voor herenmodezaken, bruidszaken en bedrijven die op zekerheid bouwen.",
  },
  {
    icon: Truck,
    title: "Never out of stock",
    description:
      "Een doordachte kerncollectie die altijd uit voorraad leverbaar is, met directe naleveringen en geen seizoensrisico.",
  },
  {
    icon: Ruler,
    title: "Grote matenrange",
    description:
      "Van slim-fit tot extra lengte- en buikmaten — voor elke klant een passende maat, zonder lange wachttijden.",
  },
  {
    icon: Headset,
    title: "Persoonlijke service",
    description:
      "Een vaste contactpersoon die uw markt kent en met u meedenkt over assortiment, marges en doorverkoop.",
  },
];

const stats = [
  { value: "20+ jaar", label: "ervaring in de branche" },
  { value: "5.000+", label: "artikelen uit voorraad" },
  { value: "48u", label: "gemiddelde levertijd" },
  { value: "3 landen", label: "actief in de Benelux" },
];

export default function OverOnsPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <p className="eyebrow text-accent">Over Suitconcern</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
            De groothandel achter uw collectie
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Wij leveren niet alleen kleding, maar een doordacht inkoopprogramma
            dat aansluit op wat uw klanten vragen — met de zekerheid van
            voorraad, een brede matenrange en service die verder gaat dan de
            order.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Ons verhaal"
              title="Een partner die met u meedenkt"
              description="Suitconcern ontstond uit een eenvoudige overtuiging: een speciaalzaak verdient een leverancier die net zo serieus met kwaliteit en voorraad omgaat als met de relatie."
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
              <p>
                Wat begon als een gespecialiseerde inkoop voor gala- en
                ceremoniekleding, groeide uit tot een volwaardig
                groothandelsprogramma voor pakken, smokings, colberts, gilets,
                overhemden en accessoires. Altijd met dezelfde focus: bewezen
                pasvormen, een betrouwbare matenrange en een commercieel scherp
                aanbod.
              </p>
              <p>
                Door nauw samen te werken met toonaangevende merken en onze
                eigen voorraad strak te sturen, bieden wij retailers en
                speciaalzaken de zekerheid die ze nodig hebben om zonder risico
                door te verkopen.
              </p>
            </div>
          </div>
          <div>
            <PlaceholderImage
              tone="from-stone-700 to-neutral-950"
              ratio="aspect-[4/3]"
              label="Showroom & centraal magazijn"
              className="rounded-card"
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Waar wij voor staan"
            title="Vier zekerheden voor uw zaak"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-card border border-line bg-white p-7"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-y-10 rounded-card border border-line bg-paper px-6 py-12 text-center lg:grid-cols-4 lg:px-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl text-ink sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white pb-20 lg:pb-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-card bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(200,178,138,0.22),transparent_60%)]" />
            <p className="eyebrow text-accent">Word dealer</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">
              Bouw verder op een vaste partner
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Vraag een B2B-account aan en krijg toegang tot prijzen, voorraad
              en het volledige bestelgemak. Liever eerst kennismaken? Wij staan
              u graag persoonlijk te woord.
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
