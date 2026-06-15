import "server-only";
import { randomBytes } from "node:crypto";

/** Onraadbaar token voor wachtwoord-uitnodiging/reset. */
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/** Vervaldatum (default 72 uur vanaf nu). */
export function tokenExpiry(hours = 72): Date {
  return new Date(Date.now() + hours * 3600 * 1000);
}
