import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { SessionProvider } from "@/lib/session";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Suitconcern — Dealer in gala- en bedrijfskleding",
    template: "%s · Suitconcern",
  },
  description:
    "Suitconcern is de B2B-groothandel in pakken, smokings, colberts en accessoires voor retailers, herenmodezaken, bruidszaken en bedrijven. Snelle levering, ruime matenrange en scherpe prijzen.",
  keywords: [
    "gala- en bedrijfskleding groothandel",
    "B2B pakken inkoop",
    "smoking groothandel",
    "herenmode wholesale",
    "kostuums dealer",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Suitconcern",
    title: "Suitconcern — Dealer in gala- en bedrijfskleding",
    description:
      "Premium B2B-collecties voor retailers en speciaalzaken. Inloggen voor prijzen en voorraad.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-ink antialiased">
        <OrganizationJsonLd />
        <SessionProvider authEnabled={process.env.NEXT_PUBLIC_AUTH_ENABLED === "true"}>
          <CartProvider>
            <FavoritesProvider>
              <SiteHeader />
              <main className="flex-1 pb-20 lg:pb-0">{children}</main>
              <SiteFooter />
              <MobileCta />
            </FavoritesProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
