import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contactPage");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const inputClass =
  "h-11 w-full rounded-card border border-line bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";

export default async function ContactPage() {
  const t = await getTranslations("contactPage");

  const details = [
    {
      icon: MapPin,
      title: t("showroomTitle"),
      lines: ["Confectieweg 12", "1234 AB Amsterdam", t("showroomLand")],
    },
    {
      icon: Phone,
      title: t("telefoonTitle"),
      lines: ["+31 (0)20 123 45 67", t("telefoonNote")],
    },
    {
      icon: Mail,
      title: t("emailTitle"),
      lines: ["info@suitconcern.nl", t("emailNote")],
    },
    {
      icon: Clock,
      title: t("openingstijdenTitle"),
      lines: [t("openingstijdenWeek"), t("openingstijdenZat"), t("openingstijdenZon")],
    },
  ];

  return (
    <>
      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <p className="eyebrow text-accent">{t("heroEyebrow")}</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-2xl text-white/70">{t("heroText")}</p>
        </Container>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-accent-dark">{t("bereikbaarheid")}</p>
            <h2 className="mt-3 text-3xl text-ink sm:text-4xl">{t("contactgegevens")}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{t("introText")}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {details.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.title} className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="font-serif text-base text-ink">{detail.title}</h3>
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
            <h2 className="font-serif text-2xl text-ink">{t("formTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t("formIntro")}</p>
            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="naam" className="mb-2 block text-sm font-medium text-ink">
                    {t("naam")}
                  </label>
                  <input
                    id="naam"
                    name="naam"
                    type="text"
                    placeholder={t("naamPlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="bedrijf" className="mb-2 block text-sm font-medium text-ink">
                    {t("bedrijf")}
                  </label>
                  <input
                    id="bedrijf"
                    name="bedrijf"
                    type="text"
                    placeholder={t("bedrijfPlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
                    {t("email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="telefoon" className="mb-2 block text-sm font-medium text-ink">
                    {t("telefoon")}
                  </label>
                  <input
                    id="telefoon"
                    name="telefoon"
                    type="tel"
                    placeholder={t("telefoonPlaceholder")}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="onderwerp" className="mb-2 block text-sm font-medium text-ink">
                  {t("onderwerp")}
                </label>
                <input
                  id="onderwerp"
                  name="onderwerp"
                  type="text"
                  placeholder={t("onderwerpPlaceholder")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="bericht" className="mb-2 block text-sm font-medium text-ink">
                  {t("bericht")}
                </label>
                <textarea
                  id="bericht"
                  name="bericht"
                  rows={5}
                  placeholder={t("berichtPlaceholder")}
                  className="w-full rounded-card border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                {t("versturen")}
              </Button>
              <p className="text-xs leading-relaxed text-muted">{t("prototypeNote")}</p>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
