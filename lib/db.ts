import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma-client singleton. Instantieert zonder DATABASE_URL niet te crashen —
 * fouten komen pas bij een query. Gebruik `dbConfigured()` om DB-afhankelijke
 * paden te gaten (zonder DB draait de site op SRS/mock).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
