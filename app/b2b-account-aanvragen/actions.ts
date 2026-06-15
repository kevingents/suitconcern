"use server";

import { db, dbConfigured } from "@/lib/db";
import { accountRequestSchema } from "@/lib/validation";
import { sendAccountReceived, sendAdminNewRequest } from "@/lib/mail";
import { CompanyStatus, UserRole } from "@prisma/client";

export type RequestState = { ok: boolean; error?: string } | null;

/**
 * B2B-aanvraag verwerken. Met DB: maakt een Company (PENDING) + contact-User aan
 * (nog zonder wachtwoord — dat volgt bij goedkeuring/uitnodiging). Zonder DB:
 * demo-succes. Mailbevestiging (Resend) volgt.
 */
export async function requestAccount(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const data = {
    companyName: String(formData.get("bedrijfsnaam") || ""),
    kvk: String(formData.get("kvk") || ""),
    vatNumber: String(formData.get("btw") || ""),
    businessType: String(formData.get("typeBedrijf") || ""),
    website: String(formData.get("website") || ""),
    contactName: String(formData.get("contactpersoon") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("telefoon") || ""),
    street: String(formData.get("adres") || ""),
    postalCode: String(formData.get("postcode") || ""),
    city: String(formData.get("plaats") || ""),
    country: String(formData.get("land") || "NL"),
    expectedVolume: String(formData.get("ordervolume") || ""),
    message: String(formData.get("bericht") || ""),
  };

  const parsed = accountRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Controleer de ingevulde gegevens." };
  }

  if (!dbConfigured()) {
    // Demo: nog geen database — doe alsof de aanvraag is ontvangen.
    return { ok: true };
  }

  try {
    const v = parsed.data;
    const email = v.email.toLowerCase();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { ok: false, error: "Er bestaat al een account met dit e-mailadres. Log in of neem contact op." };
    }

    await db.company.create({
      data: {
        name: v.companyName,
        kvk: v.kvk,
        vatNumber: v.vatNumber || null,
        businessType: v.businessType || null,
        website: v.website || null,
        street: v.street,
        postalCode: v.postalCode,
        city: v.city,
        country: v.country || "NL",
        expectedVolume: v.expectedVolume || null,
        internalNotes: v.message || null,
        status: CompanyStatus.PENDING,
        users: {
          create: {
            email,
            name: v.contactName,
            phone: v.phone,
            passwordHash: "", // wordt gezet bij goedkeuring/uitnodiging
            role: UserRole.CUSTOMER,
          },
        },
      },
    });

    // Best-effort mails (falen mag de aanvraag niet blokkeren).
    await Promise.allSettled([
      sendAccountReceived(email, v.companyName),
      sendAdminNewRequest(v.companyName, v.contactName, email),
    ]);
    return { ok: true };
  } catch (e) {
    console.error("[account-request] faalde:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Er ging iets mis bij het indienen. Probeer het later opnieuw." };
  }
}
