"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Headset,
  LogIn,
  Menu,
  ShoppingBag,
  UserCheck,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { navigation } from "@/lib/data";
import { useSession } from "@/lib/session";
import { useCart } from "@/lib/cart";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { DemoSessionSwitcher } from "@/components/layout/demo-session-switcher";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_KEY: Record<string, string> = {
  "/collecties": "collecties",
  "/merken": "merken",
  "/voorraadprogramma": "voorraadprogramma",
  "/private-label": "privateLabel",
  "/over-ons": "overOns",
  "/contact": "contact",
};

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status, company } = useSession();
  const { count } = useCart();
  const t = useTranslations("topbar");
  const tNav = useTranslations("nav");
  const tCol = useTranslations("home.collections");
  const tCommon = useTranslations("common");

  const navLabel = (href: string, fallback: string) =>
    NAV_KEY[href] ? tNav(NAV_KEY[href]) : fallback;
  const childLabel = (href: string, fallback: string) => {
    const slug = href.split("/").pop() ?? "";
    try {
      return tCol(`${slug}.title`);
    } catch {
      return fallback;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Topbar */}
      <div className="bg-ink text-white">
        <Container className="flex h-9 items-center justify-between text-[0.7rem]">
          <p className="tracking-wide text-white/70">{t("tagline")}</p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher tone="light" />
            <DemoSessionSwitcher tone="light" />
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 text-white/70 transition-colors hover:text-white sm:inline-flex"
            >
              <Headset className="size-3.5" strokeWidth={1.75} />
              {t("klantenservice")}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
            >
              <LogIn className="size-3.5" strokeWidth={1.75} />
              {t("inloggenB2B")}
            </Link>
          </div>
        </Container>
      </div>

      {/* Hoofd-header */}
      <div className="border-b border-line">
        <Container className="flex h-18 items-center justify-between gap-6 py-4">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Hoofdnavigatie">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-sm text-ink/80 transition-colors hover:text-ink"
                  >
                    {navLabel(item.href, item.label)}
                    <ChevronDown
                      className="size-3.5 transition-transform group-hover:rotate-180"
                      strokeWidth={1.75}
                    />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="min-w-52 rounded-card border border-line bg-white p-2 shadow-[0_24px_60px_-24px_rgba(17,17,17,0.25)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-[9px] px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-paper hover:text-ink"
                        >
                          {childLabel(child.href, child.label)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-ink/80 transition-colors hover:text-ink"
                >
                  {navLabel(item.href, item.label)}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            {status === "approved" ? (
              <>
                <Link
                  href="/account"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
                  title={company ?? undefined}
                >
                  <UserCheck className="size-4" strokeWidth={1.75} />
                  {tNav("mijnAccount")}
                </Link>
                <Link
                  href="/winkelwagen"
                  aria-label="Winkelwagen"
                  className={cn(buttonVariants({ variant: "primary", size: "sm" }), "relative")}
                >
                  <ShoppingBag className="size-4" strokeWidth={1.75} />
                  <span className="hidden sm:inline">{tNav("winkelwagen")}</span>
                  {count > 0 ? (
                    <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[0.65rem] font-semibold text-ink">
                      {count}
                    </span>
                  ) : null}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}
                >
                  {tCommon("inloggen")}
                </Link>
                <Link
                  href="/b2b-account-aanvragen"
                  className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}
                >
                  {tCommon("accountAanvragen")}
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu openen"
              className="inline-flex size-10 items-center justify-center rounded-card text-ink hover:bg-paper lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.75} />
            </button>
          </div>
        </Container>
      </div>

      {/* Mobiel menu */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-line px-5">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Menu sluiten"
                className="inline-flex size-10 items-center justify-center rounded-card text-ink hover:bg-paper"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobiele navigatie">
              {navigation.map((item) => (
                <div key={item.href} className="py-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-card px-3 py-2.5 text-base text-ink hover:bg-paper"
                  >
                    {navLabel(item.href, item.label)}
                  </Link>
                  {item.children ? (
                    <div className="ml-3 border-l border-line pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-card px-3 py-2 text-sm text-muted hover:bg-paper hover:text-ink"
                        >
                          {childLabel(child.href, child.label)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <div className="border-t border-line p-4">
              <Link
                href="/b2b-account-aanvragen"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
              >
                Account aanvragen
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
