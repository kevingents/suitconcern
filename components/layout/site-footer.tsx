import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tCol = useTranslations("home.collections");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const columns = [
    {
      title: t("colCollecties"),
      links: [
        { label: tCol("pakken.title"), href: "/collecties/pakken" },
        { label: tCol("smokings.title"), href: "/collecties/smokings" },
        { label: tCol("colberts.title"), href: "/collecties/colberts" },
        { label: tCol("overhemden.title"), href: "/collecties/overhemden" },
        { label: tCol("accessoires.title"), href: "/collecties/accessoires" },
      ],
    },
    {
      title: t("colInformatie"),
      links: [
        { label: t("overSuitconcern"), href: "/over-ons" },
        { label: tNav("voorraadprogramma"), href: "/voorraadprogramma" },
        { label: tNav("privateLabel"), href: "/private-label" },
        { label: tNav("merken"), href: "/merken" },
        { label: t("showroom"), href: "/showroom" },
      ],
    },
    {
      title: t("colService"),
      links: [
        { label: t("b2bAccountAanvragen"), href: "/b2b-account-aanvragen" },
        { label: tCommon("inloggen"), href: "/login" },
        { label: t("catalogus"), href: "/catalogus" },
        { label: tNav("contact"), href: "/contact" },
        { label: t("faq"), href: "/faq" },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-white">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-white/60">{t("intro")}</p>
            <div className="mt-6">
              <p className="eyebrow text-accent">{t("nieuwsbrief")}</p>
              <form className="mt-3 flex max-w-sm gap-2">
                <input
                  type="email"
                  required
                  placeholder={t("nieuwsbriefPlaceholder")}
                  className="h-11 flex-1 rounded-card border border-line-dark bg-ink-soft px-4 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                />
                <button type="submit" className={cn(buttonVariants({ variant: "light", size: "md" }))}>
                  {t("aanmelden")}
                </button>
              </form>
            </div>
          </div>

          {columns.map((col, i) => (
            <div key={i}>
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
          <p>© {new Date().getFullYear()} Suitconcern. {t("rechten")}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/algemene-voorwaarden" className="hover:text-white">
              {t("voorwaarden")}
            </Link>
            <Link href="/privacy" className="hover:text-white">
              {t("privacy")}
            </Link>
            <Link href="/contact" className="hover:text-white">
              {t("contact")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
