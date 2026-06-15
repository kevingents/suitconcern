"use server";

import { db, dbConfigured } from "@/lib/db";
import { generateToken, tokenExpiry } from "@/lib/tokens";
import { sendPasswordReset } from "@/lib/mail";

export type ResetState = { ok: boolean } | null;

/**
 * Wachtwoord-reset aanvragen. Geeft ALTIJD ok terug (geen account-enumeratie):
 * alleen als het e-mailadres bestaat sturen we daadwerkelijk een link.
 */
export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !dbConfigured()) return { ok: true };

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      const token = generateToken();
      await db.user.update({
        where: { id: user.id },
        data: { passwordSetToken: token, passwordSetTokenExpiry: tokenExpiry() },
      });
      const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      await sendPasswordReset(user.email, `${site}/wachtwoord-instellen?token=${token}`);
    }
  } catch (e) {
    console.error("[password-reset] faalde:", e instanceof Error ? e.message : e);
  }
  return { ok: true };
}
