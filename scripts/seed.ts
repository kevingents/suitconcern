/**
 * Database-seed voor Suitconcern (idempotent, via upserts).
 *
 * Maakt aan:
 *   - 4 klantgroepen: bronze (0%), silver (5%), gold (10%), platinum (15%)
 *   - 1 beheerder (ADMIN)
 *   - 1 demobedrijf (APPROVED, klantgroep silver) + 1 klant-account
 *
 * Gebruik:
 *   npm run db:seed
 *
 * Env (in .env.local of de omgeving):
 *   DATABASE_URL          – PostgreSQL-verbinding (verplicht)
 *   SEED_ADMIN_EMAIL      – e-mail beheerder (default admin@suitconcern.nl)
 *   SEED_ADMIN_PASSWORD   – wachtwoord beheerder (default Admin12345!)
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

/**
 * Minimale .env.local-loader (geen dotenv-dependency). Parseert KEY=VALUE-regels,
 * negeert lege regels/comments, ondersteunt optionele quotes. Bestaande
 * process.env-waarden worden NIET overschreven.
 */
function loadEnvLocal(): void {
  const envPath = resolve(PROJECT_ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key || key in process.env) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL ontbreekt — seed overgeslagen.");
  process.exit(0);
}

// Pas importeren ná de env-load, zodat Prisma de DATABASE_URL ziet.
const { PrismaClient, CompanyStatus, UserRole } = await import("@prisma/client");
const { hashPassword } = await import("../lib/password");

const db = new PrismaClient();

const GROUPS = [
  { slug: "bronze", name: "Bronze", discountPct: 0, sortOrder: 0 },
  { slug: "silver", name: "Silver", discountPct: 5, sortOrder: 1 },
  { slug: "gold", name: "Gold", discountPct: 10, sortOrder: 2 },
  { slug: "platinum", name: "Platinum", discountPct: 15, sortOrder: 3 },
] as const;

const DEMO_COMPANY_NAME = "Demo Retailer BV";
const DEMO_CUSTOMER_EMAIL = "dealer@example.com";
const DEMO_CUSTOMER_PASSWORD = "Dealer12345!";

async function main(): Promise<void> {
  // 1) Klantgroepen
  for (const group of GROUPS) {
    await db.customerGroup.upsert({
      where: { slug: group.slug },
      update: {
        name: group.name,
        discountPct: group.discountPct,
        sortOrder: group.sortOrder,
      },
      create: { ...group },
    });
  }
  const silver = await db.customerGroup.findUnique({ where: { slug: "silver" } });

  // 2) Beheerder
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@suitconcern.nl").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin12345!";
  const adminHash = await hashPassword(adminPassword);
  await db.user.upsert({
    where: { email: adminEmail },
    update: { role: UserRole.ADMIN },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: "Beheerder",
      role: UserRole.ADMIN,
    },
  });

  // 3) Demobedrijf (Company heeft geen natuurlijke unique op naam → eerst zoeken)
  let company = await db.company.findFirst({ where: { name: DEMO_COMPANY_NAME } });
  if (!company) {
    company = await db.company.create({
      data: {
        name: DEMO_COMPANY_NAME,
        kvk: "12345678",
        vatNumber: "NL123456789B01",
        businessType: "Retail",
        expectedVolume: "€25.000 - €50.000 / jaar",
        city: "Amsterdam",
        country: "NL",
        status: CompanyStatus.APPROVED,
        customerGroupId: silver?.id ?? null,
        allowInvoicePayment: true,
      },
    });
  } else {
    company = await db.company.update({
      where: { id: company.id },
      data: {
        status: CompanyStatus.APPROVED,
        customerGroupId: silver?.id ?? null,
      },
    });
  }

  // 4) Demo-klant gekoppeld aan het demobedrijf
  const customerHash = await hashPassword(DEMO_CUSTOMER_PASSWORD);
  await db.user.upsert({
    where: { email: DEMO_CUSTOMER_EMAIL },
    update: { companyId: company.id, role: UserRole.CUSTOMER },
    create: {
      email: DEMO_CUSTOMER_EMAIL,
      passwordHash: customerHash,
      name: "Demo Dealer",
      role: UserRole.CUSTOMER,
      companyId: company.id,
    },
  });

  console.log("Seed voltooid.");
  console.log(`  Klantgroepen : ${GROUPS.map((g) => g.slug).join(", ")}`);
  console.log(`  Beheerder    : ${adminEmail} / ${adminPassword}`);
  console.log(`  Demobedrijf  : ${DEMO_COMPANY_NAME} (status APPROVED, groep silver)`);
  console.log(`  Demo-klant   : ${DEMO_CUSTOMER_EMAIL} / ${DEMO_CUSTOMER_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed mislukt:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
