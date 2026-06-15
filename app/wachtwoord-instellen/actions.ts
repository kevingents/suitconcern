"use server";

import { db, dbConfigured } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export type SetPwState = { ok: boolean; error?: string } | null;

/** Stelt een wachtwoord in via een geldig (niet-verlopen) token uit de invite/reset-mail. */
export async function setPassword(_prev: SetPwState, formData: FormData): Promise<SetPwState> {
  const token = String(formData.get("token") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!token) return { ok: false, error: "Ongeldige of ontbrekende link." };
  if (password.length < 8) return { ok: false, error: "Kies een wachtwoord van minimaal 8 tekens." };
  if (password !== confirm) return { ok: false, error: "De wachtwoorden komen niet overeen." };
  if (!dbConfigured()) {
    return { ok: false, error: "Wachtwoord instellen is nog niet beschikbaar (geen database geconfigureerd)." };
  }

  try {
    const user = await db.user.findUnique({ where: { passwordSetToken: token } });
    if (!user || !user.passwordSetTokenExpiry || user.passwordSetTokenExpiry.getTime() < Date.now()) {
      return { ok: false, error: "Deze link is verlopen of ongeldig. Vraag een nieuwe link aan." };
    }
    const passwordHash = await hashPassword(password);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash, passwordSetToken: null, passwordSetTokenExpiry: null },
    });
    return { ok: true };
  } catch (e) {
    console.error("[set-password] faalde:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Er ging iets mis. Probeer het later opnieuw." };
  }
}
