import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Boxes, Scissors } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Programs() {
  const t = useTranslations("home.programs");
  const programs = [
    {
      icon: Boxes,
      key: "voorraad",
      eyebrow: t("voorraad.eyebrow"),
      title: t("voorraad.title"),
      description: t("voorraad.description"),
      href: "/voorraadprogramma",
      cta: t("voorraad.cta"),
      tone: "from-neutral-800 to-black",
    },
    {
      icon: Scissors,
      key: "private",
      eyebrow: t("private.eyebrow"),
      title: t("private.title"),
      description: t("private.description"),
      href: "/private-label",
      cta: t("private.cta"),
      tone: "from-stone-700 to-neutral-900",
    },
  ];
  return (
    <section className="bg-paper py-20 lg:py-24">
      <Container className="grid gap-6 lg:grid-cols-2">
        {programs.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.key}
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
