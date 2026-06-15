import Link from "next/link";
import {
  ArrowRight,
  Factory,
  Package,
  PenTool,
  Ruler,
  Sparkles,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Private Label",
  description:
    "Private label bij Suitconcern: maatwerk en eigen labels met uw branding. Van labelontwerp en een eigen maatlijn tot verpakking — geproduceerd onder uw naam.",
};

const offerings = [
  {
    icon: Tag,
    title: "Eigen labels & branding",
    description:
      "Uw merknaam op nek-, maat- en wassymbool-labels, afgewerkt naar uw huisstijl.",
  },
  {
    icon: PenTool,
    title: "Labelontwerp",
    description:
      "Wij verzorgen het ontwerp van labels en details die passen bij de uitstraling van uw merk.",
  },
  {
    icon: Ruler,
    title: "Eigen maatlijn",
    description:
      "Een maatlijn afgestemd op uw klantenkring, inclusief pasvormen en lengtematen.",
  },
  {
    icon: Package,
    title: "Verpakking",
    description:
      "Hoezen, hangtags en verpakking onder uw naam, klaar voor de winkelvloer.",
  },
];

const process = [
  {
    icon: Users,
    step: "01",
    title: "Intake",
    description:
      "We bespreken uw merk, doelgroep, gewenste pasvormen en aantallen.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Ontwerp",
    description:
      "Labels, maatlijn en afwerking worden uitgewerkt en ter goedkeuring voorgelegd.",
  },
  {
    icon: Factory,
    step: "03",
    title: "Productie",
    description:
      "Productie onder uw naam, met de premium kwaliteit die u van ons gewend bent.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Levering",
    description:
      "Winkelklaar aangeleverd, met heldere afspraken over naleveringen.",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Een herkenbaar eigen merk",
    description:
      "Bouw merkwaarde op met collecties die volledig onder uw eigen naam staan.",
  },
  {
    icon: Ruler,
    title: "Pasvorm op maat",
    description:
      "Een maatlijn die exact aansluit op uw klantenkring en marktsegment.",
  },
  {
    icon: Factory,
    title: "Premium productie",
    description:
      "Bewezen vakmanschap en materialen, zonder concessies aan kwaliteit.",
  },
  {
    icon: Truck,
    title: "Betrouwbare naleveringen",
    description:
      "Heldere afspraken over voorraad en naleveringen, net als bij ons programma.",
  },
];

export default function PrivateLabelPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <p className="eyebrow text-accent">Uw eigen merk</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
            Private label, volledig onder uw naam
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Maatwerk en eigen labels met uw branding. Van labelontwerp en een
            eigen maatlijn tot verpakking — wij produceren onder uw naam met
            behoud van premium kwaliteit.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Maatwerk"
              title="Uw merk, onze productie"
              description="Met private label maakt u van ons vakmanschap uw eigen collectie. U bepaalt de uitstraling, wij zorgen voor de productie, de pasvorm en de voorraad."
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
              <p>
                Of u nu een bestaande lijn wilt uitbreiden met een eigen merk of
                een volledig nieuw label wilt lanceren — we denken met u mee over
                ontwerp, materialen en de maatlijn die past bij uw klant.
              </p>
            </div>
          </div>
          <div>
            <PlaceholderImage
              tone="from-stone-700 to-neutral-900"
              ratio="aspect-[4/3]"
              label="Private label collectie"
              className="rounded-card"
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Wat wij verzorgen"
            title="Van label tot verpakking"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map((offering) => {
              const Icon = offering.icon;
              return (
                <div
                  key={offering.title}
                  className="rounded-card border border-line bg-white p-7"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-ink">
                    {offering.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {offering.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Het traject"
            title="Van intake tot levering"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.step}
                  className="relative rounded-card border border-line bg-white p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-card bg-paper text-accent-dark">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </span>
                    <span className="font-serif text-2xl text-line-dark">
                      {phase.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-lg text-ink">
                    {phase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {phase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="De voordelen"
            title="Waarom private label"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-card border border-line bg-white p-7"
                >
                  <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-serif text-base text-ink">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white pb-20 lg:pb-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-card bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(200,178,138,0.22),transparent_60%)]" />
            <p className="eyebrow text-accent">Start uw eigen lijn</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">
              Benieuwd naar de mogelijkheden?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Neem contact op voor een vrijblijvend gesprek over uw eigen
              private-label collectie. Wij denken graag met u mee.
            </p>
            <div className="mt-9 flex justify-center">
              <Link
                href="/contact"
                className={buttonVariants({ variant: "light", size: "lg" })}
              >
                Contact opnemen
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
