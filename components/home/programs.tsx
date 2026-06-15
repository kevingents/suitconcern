import Link from "next/link";
import { ArrowRight, Boxes, Scissors } from "lucide-react";
import { Container } from "@/components/ui/container";

const programs = [
  {
    icon: Boxes,
    eyebrow: "Voorraadprogramma",
    title: "Never out of stock",
    description:
      "Een vaste kerncollectie die altijd uit voorraad leverbaar is. Directe naleveringen, geen seizoensrisico en altijd dezelfde betrouwbare pasvorm.",
    href: "/voorraadprogramma",
    cta: "Bekijk het programma",
    tone: "from-neutral-800 to-black",
  },
  {
    icon: Scissors,
    eyebrow: "Private Label",
    title: "Uw eigen merk",
    description:
      "Maatwerk en eigen labels met uw branding. Van labelontwerp tot afwerking — wij produceren onder uw naam met behoud van premium kwaliteit.",
    href: "/private-label",
    cta: "Ontdek de mogelijkheden",
    tone: "from-stone-700 to-neutral-900",
  },
];

export function Programs() {
  return (
    <section className="bg-paper py-20 lg:py-24">
      <Container className="grid gap-6 lg:grid-cols-2">
        {programs.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.eyebrow}
              className="relative isolate flex flex-col justify-between overflow-hidden rounded-card bg-gradient-to-br p-8 text-white lg:p-10"
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${p.tone}`} />
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_85%_10%,rgba(200,178,138,0.16),transparent_55%)]" />
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-card bg-white/10 text-accent">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <p className="eyebrow mt-6 text-accent">{p.eyebrow}</p>
                <h3 className="mt-3 font-serif text-2xl sm:text-3xl">{p.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                  {p.description}
                </p>
              </div>
              <Link
                href={p.href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white underline-offset-4 hover:text-accent"
              >
                {p.cta}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
