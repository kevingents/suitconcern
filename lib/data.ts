/**
 * Mock-datalaag voor de UI-prototypefase.
 *
 * Vervangen door Payload CMS (content) + Prisma/PostgreSQL (producten,
 * voorraad, prijzen) zodra de backend gekoppeld is. De vorm van de types
 * blijft leidend voor het latere datamodel.
 */

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const navigation: NavItem[] = [
  {
    label: "Collecties",
    href: "/collecties",
    children: [
      { label: "Pakken", href: "/collecties/pakken" },
      { label: "Smokings", href: "/collecties/smokings" },
      { label: "Colberts", href: "/collecties/colberts" },
      { label: "Gilets", href: "/collecties/gilets" },
      { label: "Overhemden", href: "/collecties/overhemden" },
      { label: "Accessoires", href: "/collecties/accessoires" },
    ],
  },
  { label: "Merken", href: "/merken" },
  { label: "Voorraadprogramma", href: "/voorraadprogramma" },
  { label: "Private Label", href: "/private-label" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Contact", href: "/contact" },
];

export interface Usp {
  title: string;
  description: string;
  /** lucide-react icoonnaam (SVG, nooit emoji) */
  icon: "warehouse" | "truck" | "ruler" | "tag";
}

export const usps: Usp[] = [
  {
    title: "Groothandel specialist",
    description: "Al jaren de vaste partner voor gala- en bedrijfskleding.",
    icon: "warehouse",
  },
  {
    title: "Ruim assortiment",
    description: "Pakken, smokings, colberts, gilets en accessoires uit voorraad.",
    icon: "tag",
  },
  {
    title: "Snelle levering",
    description: "Never-out-of-stock kerncollectie, vandaag besteld, snel geleverd.",
    icon: "truck",
  },
  {
    title: "Grote matenrange",
    description: "Van slim-fit tot extra lengtematen — een passende maat voor elke klant.",
    icon: "ruler",
  },
];

export interface Collection {
  slug: string;
  title: string;
  description: string;
  /** Aantal artikelen (indicatief, voor de prototypefase). */
  count: number;
  /** Tailwind-gradient voor de placeholder-fotografie. */
  tone: string;
  featured?: boolean;
}

export const collections: Collection[] = [
  {
    slug: "pakken",
    title: "Pakken",
    description: "Zakelijke en feestelijke kostuums in een brede matenrange.",
    count: 248,
    tone: "from-neutral-800 to-neutral-950",
    featured: true,
  },
  {
    slug: "smokings",
    title: "Smokings",
    description: "Klassieke en moderne smokings voor gala en ceremonie.",
    count: 96,
    tone: "from-zinc-900 to-black",
    featured: true,
  },
  {
    slug: "colberts",
    title: "Colberts",
    description: "Losse colberts en blazers voor een veelzijdige look.",
    count: 134,
    tone: "from-stone-700 to-stone-900",
    featured: true,
  },
  {
    slug: "gilets",
    title: "Gilets",
    description: "Bijpassende en losse gilets om elke set af te maken.",
    count: 72,
    tone: "from-neutral-700 to-neutral-900",
  },
  {
    slug: "overhemden",
    title: "Overhemden",
    description: "Business- en ceremonie-overhemden in alle kragen en maten.",
    count: 180,
    tone: "from-slate-700 to-slate-900",
    featured: true,
  },
  {
    slug: "accessoires",
    title: "Accessoires",
    description: "Dassen, strikken, pochets, bretels en manchetknopen.",
    count: 210,
    tone: "from-stone-800 to-neutral-950",
    featured: true,
  },
];

export interface Brand {
  name: string;
  /** korte tagline voor de merkenstrook */
  note: string;
}

export const brands: Brand[] = [
  { name: "Digel", note: "Duits vakmanschap" },
  { name: "Wilvorst", note: "Ceremonie & gala" },
  { name: "Cavallaro", note: "Italiaanse snit" },
  { name: "Carl Gross", note: "Premium tailoring" },
  { name: "Heinrich", note: "Klassieke kwaliteit" },
];

export interface ProductVariant {
  size: string;
  /** Voorraad per maat — alleen tonen na login. */
  stock: number;
}

export interface Product {
  slug: string;
  name: string;
  sku: string;
  brand: string;
  collection: string;
  color: string;
  fit: "Slim fit" | "Modern fit" | "Regular fit" | "Comfort fit";
  /** Basisprijs excl. btw — alleen tonen achter de prijs-gate. */
  priceExclVat: number;
  /** Staffelprijs vanaf een bepaald aantal (optioneel). */
  tierPrice?: { from: number; priceExclVat: number };
  tone: string;
  /** Eigen Suitconcern-modelbeeld (Next Image / blob). Géén SRS-foto. Leeg = placeholder. */
  image?: string;
  /** Eigen detail-/close-upbeeld (fashn.ai). Géén SRS-foto. */
  detailImage?: string;
  variants: ProductVariant[];
  isNew?: boolean;
  bestseller?: boolean;
}

export const products: Product[] = [
  {
    slug: "kingsley-pak-navy",
    name: "Kingsley pak",
    sku: "SC-PAK-1001",
    brand: "Digel",
    collection: "pakken",
    color: "Navy",
    fit: "Modern fit",
    priceExclVat: 189,
    tierPrice: { from: 6, priceExclVat: 175 },
    tone: "from-slate-800 to-slate-950",
    variants: [
      { size: "46", stock: 12 },
      { size: "48", stock: 24 },
      { size: "50", stock: 31 },
      { size: "52", stock: 28 },
      { size: "54", stock: 18 },
      { size: "56", stock: 9 },
    ],
    bestseller: true,
  },
  {
    slug: "ascot-smoking-zwart",
    name: "Ascot smoking",
    sku: "SC-SMK-2008",
    brand: "Wilvorst",
    collection: "smokings",
    color: "Zwart",
    fit: "Slim fit",
    priceExclVat: 269,
    tone: "from-zinc-900 to-black",
    variants: [
      { size: "48", stock: 7 },
      { size: "50", stock: 14 },
      { size: "52", stock: 16 },
      { size: "54", stock: 11 },
    ],
    bestseller: true,
    isNew: true,
  },
  {
    slug: "milano-colbert-antraciet",
    name: "Milano colbert",
    sku: "SC-COL-3042",
    brand: "Cavallaro",
    collection: "colberts",
    color: "Antraciet",
    fit: "Slim fit",
    priceExclVat: 149,
    tone: "from-stone-700 to-stone-900",
    variants: [
      { size: "46", stock: 5 },
      { size: "48", stock: 19 },
      { size: "50", stock: 22 },
      { size: "52", stock: 13 },
    ],
    bestseller: true,
  },
  {
    slug: "oxford-overhemd-wit",
    name: "Oxford overhemd",
    sku: "SC-OVH-4110",
    brand: "Carl Gross",
    collection: "overhemden",
    color: "Wit",
    fit: "Regular fit",
    priceExclVat: 39,
    tierPrice: { from: 12, priceExclVat: 34 },
    tone: "from-slate-600 to-slate-800",
    variants: [
      { size: "39", stock: 40 },
      { size: "40", stock: 52 },
      { size: "41", stock: 48 },
      { size: "42", stock: 36 },
      { size: "43", stock: 21 },
    ],
    bestseller: true,
  },
  {
    slug: "regent-gilet-navy",
    name: "Regent gilet",
    sku: "SC-GIL-5021",
    brand: "Digel",
    collection: "gilets",
    color: "Navy",
    fit: "Slim fit",
    priceExclVat: 59,
    tone: "from-neutral-700 to-neutral-900",
    variants: [
      { size: "48", stock: 14 },
      { size: "50", stock: 18 },
      { size: "52", stock: 12 },
    ],
  },
  {
    slug: "seda-zijden-das-bordeaux",
    name: "Seda zijden das",
    sku: "SC-ACC-6090",
    brand: "Heinrich",
    collection: "accessoires",
    color: "Bordeaux",
    fit: "Regular fit",
    priceExclVat: 19,
    tierPrice: { from: 24, priceExclVat: 16 },
    tone: "from-stone-800 to-neutral-950",
    variants: [{ size: "One size", stock: 120 }],
    isNew: true,
  },
  {
    slug: "windsor-pak-grijs",
    name: "Windsor pak",
    sku: "SC-PAK-1044",
    brand: "Carl Gross",
    collection: "pakken",
    color: "Lichtgrijs",
    fit: "Comfort fit",
    priceExclVat: 199,
    tone: "from-neutral-600 to-neutral-800",
    variants: [
      { size: "50", stock: 17 },
      { size: "52", stock: 22 },
      { size: "54", stock: 15 },
      { size: "56", stock: 10 },
      { size: "58", stock: 6 },
    ],
  },
  {
    slug: "venezia-strik-zwart",
    name: "Venezia zelfstrik",
    sku: "SC-ACC-6122",
    brand: "Wilvorst",
    collection: "accessoires",
    color: "Zwart",
    fit: "Regular fit",
    priceExclVat: 14,
    tone: "from-zinc-800 to-black",
    variants: [{ size: "One size", stock: 88 }],
    bestseller: true,
  },
  {
    slug: "berkeley-pak-krijtstreep",
    name: "Berkeley pak",
    sku: "SC-PAK-1052",
    brand: "Cavallaro",
    collection: "pakken",
    color: "Navy krijtstreep",
    fit: "Slim fit",
    priceExclVat: 219,
    tierPrice: { from: 6, priceExclVat: 205 },
    tone: "from-slate-800 to-slate-950",
    variants: [
      { size: "46", stock: 8 },
      { size: "48", stock: 16 },
      { size: "50", stock: 20 },
      { size: "52", stock: 14 },
      { size: "54", stock: 7 },
    ],
    isNew: true,
  },
  {
    slug: "hampton-pak-antraciet",
    name: "Hampton pak",
    sku: "SC-PAK-1067",
    brand: "Digel",
    collection: "pakken",
    color: "Antraciet",
    fit: "Modern fit",
    priceExclVat: 179,
    tone: "from-neutral-700 to-neutral-950",
    variants: [
      { size: "48", stock: 22 },
      { size: "50", stock: 27 },
      { size: "52", stock: 25 },
      { size: "54", stock: 16 },
      { size: "56", stock: 11 },
    ],
  },
  {
    slug: "monaco-smoking-middernachtblauw",
    name: "Monaco smoking",
    sku: "SC-SMK-2021",
    brand: "Digel",
    collection: "smokings",
    color: "Middernachtblauw",
    fit: "Slim fit",
    priceExclVat: 289,
    tierPrice: { from: 4, priceExclVat: 269 },
    tone: "from-slate-900 to-black",
    variants: [
      { size: "48", stock: 6 },
      { size: "50", stock: 12 },
      { size: "52", stock: 15 },
      { size: "54", stock: 9 },
    ],
  },
  {
    slug: "royal-smoking-zwart-sjaalkraag",
    name: "Royal smoking",
    sku: "SC-SMK-2034",
    brand: "Carl Gross",
    collection: "smokings",
    color: "Zwart, sjaalkraag",
    fit: "Modern fit",
    priceExclVat: 299,
    tone: "from-zinc-900 to-black",
    variants: [
      { size: "50", stock: 8 },
      { size: "52", stock: 13 },
      { size: "54", stock: 10 },
      { size: "56", stock: 5 },
    ],
  },
  {
    slug: "como-colbert-navy",
    name: "Como colbert",
    sku: "SC-COL-3058",
    brand: "Digel",
    collection: "colberts",
    color: "Navy",
    fit: "Modern fit",
    priceExclVat: 139,
    tone: "from-slate-700 to-slate-900",
    variants: [
      { size: "48", stock: 18 },
      { size: "50", stock: 24 },
      { size: "52", stock: 19 },
      { size: "54", stock: 12 },
    ],
  },
  {
    slug: "harris-tweed-colbert-bruin",
    name: "Harris tweed colbert",
    sku: "SC-COL-3071",
    brand: "Heinrich",
    collection: "colberts",
    color: "Bruin gemêleerd",
    fit: "Regular fit",
    priceExclVat: 169,
    tone: "from-stone-600 to-stone-900",
    variants: [
      { size: "48", stock: 7 },
      { size: "50", stock: 11 },
      { size: "52", stock: 9 },
    ],
    isNew: true,
  },
  {
    slug: "ascot-gilet-grijs",
    name: "Ascot gilet",
    sku: "SC-GIL-5038",
    brand: "Wilvorst",
    collection: "gilets",
    color: "Lichtgrijs",
    fit: "Slim fit",
    priceExclVat: 69,
    tone: "from-zinc-600 to-zinc-800",
    variants: [
      { size: "48", stock: 16 },
      { size: "50", stock: 20 },
      { size: "52", stock: 14 },
    ],
  },
  {
    slug: "slim-overhemd-lichtblauw",
    name: "Slim overhemd",
    sku: "SC-OVH-4128",
    brand: "Carl Gross",
    collection: "overhemden",
    color: "Lichtblauw",
    fit: "Slim fit",
    priceExclVat: 42,
    tierPrice: { from: 12, priceExclVat: 37 },
    tone: "from-sky-800 to-slate-900",
    variants: [
      { size: "38", stock: 30 },
      { size: "39", stock: 44 },
      { size: "40", stock: 51 },
      { size: "41", stock: 39 },
      { size: "42", stock: 28 },
    ],
  },
  {
    slug: "wing-overhemd-ceremonie-wit",
    name: "Wing overhemd",
    sku: "SC-OVH-4141",
    brand: "Wilvorst",
    collection: "overhemden",
    color: "Wit, wingkraag",
    fit: "Regular fit",
    priceExclVat: 49,
    tone: "from-neutral-500 to-neutral-800",
    variants: [
      { size: "39", stock: 22 },
      { size: "40", stock: 26 },
      { size: "41", stock: 19 },
      { size: "42", stock: 14 },
    ],
  },
  {
    slug: "pochet-zijde-set",
    name: "Pochet zijde, set van 3",
    sku: "SC-ACC-6135",
    brand: "Heinrich",
    collection: "accessoires",
    color: "Assorti",
    fit: "Regular fit",
    priceExclVat: 22,
    tierPrice: { from: 24, priceExclVat: 18 },
    tone: "from-stone-700 to-neutral-950",
    variants: [{ size: "One size", stock: 64 }],
  },
  {
    slug: "bretels-classic-zwart",
    name: "Bretels classic",
    sku: "SC-ACC-6148",
    brand: "Digel",
    collection: "accessoires",
    color: "Zwart",
    fit: "Regular fit",
    priceExclVat: 17,
    tone: "from-neutral-800 to-black",
    variants: [{ size: "One size", stock: 95 }],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((p) => p.collection === slug);
}

export const bestsellers = products.filter((p) => p.bestseller);
