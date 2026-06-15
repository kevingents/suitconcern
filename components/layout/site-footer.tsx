import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Collecties",
    links: [
      { label: "Pakken", href: "/collecties/pakken" },
      { label: "Smokings", href: "/collecties/smokings" },
      { label: "Colberts", href: "/collecties/colberts" },
      { label: "Overhemden", href: "/collecties/overhemden" },
      { label: "Accessoires", href: "/collecties/accessoires" },
    ],
  },
  {
    title: "Informatie",
    links: [
      { label: "Over Suitconcern", href: "/over-ons" },
      { label: "Voorraadprogramma", href: "/voorraadprogramma" },
      { label: "Private Label", href: "/private-label" },
      { label: "Merken", href: "/merken" },
      { label: "Showroom", href: "/showroom" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "B2B-account aanvragen", href: "/b2b-account-aanvragen" },
      { label: "Inloggen", href: "/login" },
      { label: "Catalogus aanvragen", href: "/catalogus" },
      { label: "Contact", href: "/contact" },
      { label: "Veelgestelde vragen", href: "/faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Suitconcern is de B2B-groothandel in gala- en bedrijfskleding voor
              retailers, herenmodezaken, bruidszaken en zakelijke afnemers.
            </p>
            <div className="mt-6">
              <p className="eyebrow text-accent">Nieuwsbrief</p>
              <form className="mt-3 flex max-w-sm gap-2">
                <input
                  type="email"
                  required
                  placeholder="Zakelijk e-mailadres"
                  className="h-11 flex-1 rounded-card border border-line-dark bg-ink-soft px-4 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "light", size: "md" }))}
                >
                  Aanmelden
                </button>
              </form>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line-dark pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Suitconcern. Alle rechten voorbehouden.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/algemene-voorwaarden" className="hover:text-white">
              Algemene voorwaarden
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacyverklaring
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
