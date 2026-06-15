import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact",
  description:
    "Neem contact op met Suitconcern. Bezoek onze showroom, bel of mail ons team voor vragen over assortiment, voorraad of een B2B-account.",
};

const details = [
  {
    icon: MapPin,
    title: "Showroom & magazijn",
    lines: ["Confectieweg 12", "1234 AB Amsterdam", "Nederland"],
  },
  {
    icon: Phone,
    title: "Telefoon",
    lines: ["+31 (0)20 123 45 67", "Ma t/m vr tijdens kantooruren"],
  },
  {
    icon: Mail,
    title: "E-mail",
    lines: ["info@suitconcern.nl", "Reactie binnen één werkdag"],
  },
  {
    icon: Clock,
    title: "Openingstijden",
    lines: ["Ma t/m vr: 09:00 – 17:30", "Zaterdag: op afspraak", "Zondag: gesloten"],
  },
];

const inputClass =
  "h-11 w-full rounded-card border border-line bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";

export default function ContactPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <p className="eyebrow text-accent">Contact</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
            Wij staan u graag te woord
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Vragen over het assortiment, de voorraad of een B2B-account? Neem
            contact op of plan een bezoek aan onze showroom — wij denken graag
            met u mee.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-accent-dark">Bereikbaarheid</p>
            <h2 className="mt-3 text-3xl text-ink sm:text-4xl">Contactgegevens</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Onze accountmanagers kennen de markt en helpen u snel verder. Loop
              gerust binnen of plan vooraf een afspraak.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {details.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.title} className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="font-serif text-base text-ink">
                        {detail.title}
                      </h3>
                      <div className="mt-1 space-y-0.5 text-sm leading-relaxed text-muted">
                        {detail.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-card border border-line bg-paper p-7 sm:p-9">
            <h2 className="font-serif text-2xl text-ink">Stuur ons een bericht</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Vul het formulier in en wij nemen binnen één werkdag contact op.
            </p>
            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="naam"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Naam
                  </label>
                  <input
                    id="naam"
                    name="naam"
                    type="text"
                    placeholder="Uw naam"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="bedrijf"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Bedrijf
                  </label>
                  <input
                    id="bedrijf"
                    name="bedrijf"
                    type="text"
                    placeholder="Bedrijfsnaam"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="naam@bedrijf.nl"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefoon"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Telefoon
                  </label>
                  <input
                    id="telefoon"
                    name="telefoon"
                    type="tel"
                    placeholder="+31 (0)6 12 34 56 78"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="onderwerp"
                  className="mb-2 block text-sm font-medium text-ink"
                >
                  Onderwerp
                </label>
                <input
                  id="onderwerp"
                  name="onderwerp"
                  type="text"
                  placeholder="Waar gaat uw vraag over?"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="bericht"
                  className="mb-2 block text-sm font-medium text-ink"
                >
                  Bericht
                </label>
                <textarea
                  id="bericht"
                  name="bericht"
                  rows={5}
                  placeholder="Uw bericht"
                  className="w-full rounded-card border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Versturen
              </Button>
              <p className="text-xs leading-relaxed text-muted">
                Dit is een prototypeformulier — berichten worden nog niet
                verzonden of opgeslagen.
              </p>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
