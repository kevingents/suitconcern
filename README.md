# Suitconcern — B2B wholesale platform

Premium B2B-groothandel voor gala- en bedrijfskleding. Zelfstandig platform voor
retailers, herenmodezaken, bruidszaken, kostuumwinkels en zakelijke afnemers.
Geen consumentenwebshop, geen koppeling met andere merken.

> **Status:** Fase 1 — draaiende UI-basis (frontend prototype met mock-data).
> De backend-integraties (database, auth, betalingen, CMS) volgen in latere fasen,
> zie [Roadmap](#roadmap).

## Tech stack

| Laag | Keuze |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Componenten | shadcn/ui-compatibel (eigen premium primitives), lucide-react iconen |
| CMS | **Payload CMS** (in dezelfde Next.js-app, deelt PostgreSQL) — _gepland_ |
| Database | PostgreSQL + Prisma — _gepland_ |
| Auth | NextAuth / Auth.js — _gepland_ |
| Betalingen | Mollie — _gepland_ |
| Mail | Resend — _gepland_ |
| Zoeken | Algolia — _gepland_ |
| Bestanden | Uploadthing | _gepland_ |
| Analytics | GTM + GA4 + Microsoft Clarity — _gepland_ |
| Hosting | Vercel |

## Quick start

```bash
npm install
cp .env.example .env.local   # vul in waar nodig (nu nog niet vereist voor de UI)
npm run dev                  # http://localhost:3000
```

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run typecheck`

## Projectstructuur

```
app/
  layout.tsx              # fonts (Playfair + Inter), header/footer/mobiele CTA, SessionProvider
  page.tsx                # homepage
  globals.css             # Tailwind v4 + design-tokens (@theme)
  collecties/             # overzicht + /[slug] categorie-listing (filters + sortering)
  producten/[slug]/       # productdetail (galerij, maatmatrix, gated prijzen, tabs, cross-sell)
  b2b-account-aanvragen/  # aanvraagformulier (pending-flow)
  login/                  # B2B-login
  winkelwagen/ checkout/  # winkelwagen + checkout-stappen
  account/                # klantdashboard (gated op status)
  over-ons/ contact/ merken/ voorraadprogramma/ private-label/
components/
  ui/                     # Button, Container, SectionHeading
  layout/                 # SiteHeader (topbar+nav+drawer), SiteFooter, MobileCta, Logo, demo-switcher
  home/                   # homepage-secties (Hero, UspBar, CollectionsGrid, Bestsellers, ...)
  shop/                   # ProductCard, PriceDisplay, PlaceholderImage, CategoryListing,
                          # ProductGallery, ProductOrderPanel (maatmatrix), ProductTabs, Breadcrumb
lib/
  data.ts                 # mock-datalaag + domeintypes (Product, Collection, Brand, ...)
  session.tsx             # mock B2B-sessie (guest/pending/approved) — vervangt later NextAuth
  utils.ts                # cn(), formatPrice()
```

## Design system

Gedefinieerd in [`app/globals.css`](app/globals.css) als Tailwind v4 `@theme`-tokens.

- **Kleur** — `ink` `#111111` · `ink-soft` `#1C1C1C` · `paper` `#F7F7F5` · `white` ·
  accent (champagne) `accent` `#C8B28A` / `accent-dark`. Plus `muted`, `line`, `line-dark`.
- **Typografie** — titels **Playfair Display** (serif), body **Inter**. `h1–h4` zijn
  automatisch serif; gebruik `font-serif` elders.
- **Radius** — `rounded-card` = **12px**.
- **Stijl** — minimalistisch, veel witruimte, premium en zakelijk. **Alleen SVG-iconen
  (lucide-react), nooit emoji.** Geen schreeuwerige kortingstaal.

## Kernregel: prijzen alleen na goedkeuring

Prijzen, voorraad per maat en bestellen zijn **uitsluitend** zichtbaar voor een
**ingelogd én goedgekeurd** B2B-account.

- **Gast / pending** → geen prijzen; CTA's "Inloggen voor prijs" en "Account aanvragen".
- **Approved** → prijzen excl. btw, automatische klantgroep-korting, staffelprijzen,
  voorraad per maat, maatmatrix-bestellen, winkelwagen en checkout.

In de prototypefase wordt dit aangestuurd door een **mock-sessie**
([`lib/session.tsx`](lib/session.tsx)). Rechtsboven in de topbar staat tijdelijk een
**Demo-schakelaar** (Gast · Pending · Approved) om het gedrag te tonen. Deze verdwijnt
zodra NextAuth gekoppeld is; de `useSession()`-API blijft gelijk.

## Wat is gebouwd (Fase 1)

- Volledige design-systeem + premium layout (sticky header met dropdown-navigatie,
  mobiel menu, donkere footer met nieuwsbrief, sticky mobiele conversie-CTA).
- **Homepage** conform de meegeleverde visual: hero, USP-rij, collectiekaarten,
  "Veel verkocht" met prijs-gating, Over Suitconcern, Voorraadprogramma + Private Label,
  merkenstrook, B2B-CTA.
- **Collecties** overzicht + **categorie-listing** met filters (merk/pasvorm/maat/kleur/
  voorraad), sortering (prijs-sortering alleen na login) en mobiele filter-drawer.
- **Productdetail** met galerij, maatmatrix incl. voorraad per maat, gated prijsblok met
  klantkorting + staffel, aantal-per-maat invoer, downloads, tabbladen en cross-sell.
- **B2B-account aanvragen**, **login**, **winkelwagen**, **checkout** (5 stappen incl.
  Mollie-methoden en de "op factuur"-regel), **klantdashboard**, en de content-pagina's.
- SEO-metadata per pagina, `nl`-locale, responsive (mobile-first), statisch prerenderd.

Mock-data en placeholder-fotografie zijn bewust dependency-vrij; echte beelden komen via
Next Image (Cloudinary/Uploadthing) zodra die gekoppeld zijn.

## Data: SRS-voorraad, prijzen & beeld

De catalogus draait via één toegangslaag ([`lib/catalog.ts`](lib/catalog.ts)): **SRS-data
wanneer geconfigureerd, anders mock-data**. Zo werkt de site lokaal zonder secrets en
schakelt hij in productie vanzelf over op live data.

- **Voorraad & artikelen (SRS)** — Suitconcern = **SRS-filiaal 702 (verkoop) + 704
  (magazijn)**. Bron is de stock-snapshot in de (storegents) blobstore
  (`srs-stock-snapshot/branch-702.json` / `-704.json`), geaggregeerd op SKU met voorraad
  per maat. Zie [`lib/srs/snapshot.ts`](lib/srs/snapshot.ts) +
  [`lib/srs/catalog.ts`](lib/srs/catalog.ts). Activeren met
  `STOREGENTS_BLOB_READ_WRITE_TOKEN`. Een live SOAP-`GetStock`-client
  ([`lib/srs/stock-client.ts`](lib/srs/stock-client.ts), `SRS_MESSAGE_USER/PASSWORD`) is
  er voor losse SKU-checks/verversen. **Géén SRS-afbeeldingen** worden getoond.
- **Prijzen (in de tool)** — groothandelsprijzen komen uit een eigen prijslijst
  ([`lib/pricing.ts`](lib/pricing.ts), blob `suitconcern/price-list.json` met
  `lib/data/price-list.json` als seed), niet uit SRS. Geseed met SRS `unitPrice` waar
  aanwezig; ontbreekt een prijs → "prijs op aanvraag". Klantgroep-korting komt er los
  overheen. Een admin-UI om de lijst te beheren volgt.
- **Afbeeldingen (fashn.ai)** — eigen Suitconcern-modelbeeld via FASHN.ai
  ("product-to-model"): [`lib/fashn.ts`](lib/fashn.ts) +
  [`scripts/generate-images.ts`](scripts/generate-images.ts). Vul
  [`scripts/fashn-input.json`](scripts/fashn-input.example.json) (sku + bronfoto +
  categorie), draai `npm run generate:images`; output → blob → `lib/data/product-images.json`,
  dat de productgalerij leidt. Vereist `FASHN_API_KEY` + blob-token. Zonder beeld toont de
  site premium placeholders.

## Auth, rollen & datamodel

- **Datamodel** — volledig Prisma-schema ([`prisma/schema.prisma`](prisma/schema.prisma)):
  CustomerGroup, Company, User, Brand, Category, Product/ProductVariant,
  PriceList/PriceListItem, CustomerDiscount, Cart/CartItem, Order/OrderItem, Payment,
  Favorite, CMSPage, Banner, Download. Client via [`lib/db.ts`](lib/db.ts).
- **Auth.js v5** ([`lib/auth.ts`](lib/auth.ts)) — credentials-login, JWT-sessie met
  **rol + goedkeuringsstatus + klantgroep + korting**. De sessie-bridge in
  [`lib/session.tsx`](lib/session.tsx) houdt dezelfde `useSession()`-API:
  - **Demo-modus** (default, geen DB): de Gast/Pending/Approved-schakelaar.
  - **Echte modus** (`NEXT_PUBLIC_AUTH_ENABLED=true`): login bepaalt de status; de
    schakelaar verdwijnt.
- **Flows** — `/b2b-account-aanvragen` schrijft een Company (PENDING) + contact-User
  ([`actions.ts`](app/b2b-account-aanvragen/actions.ts)); `/login` doet `signIn`;
  `/admin` (guarded op rol ADMIN) keurt aanvragen goed met klantgroep + korting +
  achteraf-betalen ([`app/admin`](app/admin/page.tsx)).
- **Onboarding-lus** — transactionele mails via Resend ([`lib/mail.ts`](lib/mail.ts),
  degradeert zonder `RESEND_API_KEY`): aanvraag-bevestiging + admin-notificatie. Bij
  goedkeuring krijgt elk contact een **wachtwoord-uitnodiging** (token, 72u) →
  [`/wachtwoord-instellen`](app/wachtwoord-instellen/page.tsx). Ook
  [`/wachtwoord-vergeten`](app/wachtwoord-vergeten/page.tsx) (reset, geen
  account-enumeratie). Pas ná het instellen van een wachtwoord kan een goedgekeurde
  klant inloggen.

### Live zetten (lokaal of Vercel)

```bash
# .env.local: DATABASE_URL + AUTH_SECRET + NEXT_PUBLIC_AUTH_ENABLED="true"
npm run db:migrate     # prisma migrate dev — maakt de tabellen
npm run db:seed        # klantgroepen + admin + demo-dealer
npm run dev
```
Seed-logins: admin `admin@suitconcern.nl / Admin12345!`, dealer `dealer@example.com / Dealer12345!`
(overschrijfbaar via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`). Zonder `DATABASE_URL`
draait alles in demo-modus.

> Let op: een aangevraagd account heeft nog geen wachtwoord — inloggen kan pas na
> goedkeuring + wachtwoord-uitnodiging (volgt, samen met de Resend-mails).

## Bestellen & betalen

- **Winkelwagen** — echte client-cart ([`lib/cart.tsx`](lib/cart.tsx), localStorage),
  per SKU+maat met prijs-snapshot. "In winkelwagen" op de PDP vult 'm; teller in de
  header. [`/winkelwagen`](app/winkelwagen/page.tsx) en
  [`/checkout`](app/checkout/page.tsx) rekenen consistent: subtotaal → klantkorting →
  btw 21% → totaal.
- **Order plaatsen** — [`placeOrder`](app/checkout/actions.ts) (server action): vereist
  een goedgekeurd account, herberekent prijzen **autoritair server-side**
  ([`lib/orders.ts`](lib/orders.ts)), persisteert Order + OrderItems + Payment, en start
  een **Mollie**-betaling ([`lib/mollie.ts`](lib/mollie.ts)) → redirect naar de hosted
  checkout. "Op factuur" alleen als dat per bedrijf is geactiveerd.
- **Webhook** — [`/api/webhooks/mollie`](app/api/webhooks/mollie/route.ts) werkt
  Payment/Order-status bij; [`/bedankt`](app/bedankt/page.tsx) bevestigt en leegt de wagen.
- **Mock-veilig** — zonder `DATABASE_URL`/`MOLLIE_API_KEY` rondt de checkout af als demo
  (geen persistentie/betaling), zodat de flow lokaal werkt. Live: zet `DATABASE_URL`,
  `MOLLIE_API_KEY` en `NEXT_PUBLIC_SITE_URL` (voor redirect/webhook-URL).

## Roadmap

1. **Data & auth** — Prisma-schema + PostgreSQL (User, Company, CustomerGroup, Product,
   ProductVariant, Category, Brand, PriceList, CustomerDiscount, Cart, Order, OrderItem,
   Payment, CMSPage, Banner, Download); NextAuth met rollen (gast/pending/approved/admin);
   `lib/session.tsx` vervangen door een echte server-sessie.
2. **CMS** — Payload CMS in dezelfde app (homepage, USP's, merken, pagina's, banners, SEO).
3. **Commerce** — Mollie-checkout (iDEAL/Bancontact/creditcard/Apple Pay/Klarna Zakelijk),
   achteraf-op-factuur per klant, klantkorting & staffel server-side, btw-berekening.
4. **Admin** — dashboard: aanvragen goedkeuren, korting/prijsgroep/min. orderbedrag,
   producten & voorraad (CSV import/export), orders.
5. **Mail** — Resend (aanvraagbevestiging, admin-notificatie, orderbevestiging).
6. **Zoeken & extra's** — Algolia, snel bestellen, herhaalbestelling, favorieten,
   offerte aanvragen, catalogus-download, back-in-stock, dealer locator, lookbook.
7. **Meertaligheid** — NL / EN / DE; analytics (GTM, GA4, Clarity); Core Web Vitals 95+.
```
