"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateToken, tokenExpiry } from "@/lib/tokens";
import { sendApprovalInvite } from "@/lib/mail";
import { CompanyStatus, UserRole } from "@prisma/client";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Werpt de gebruiker terug naar /login als er geen ADMIN-sessie is. */
async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/login");
  }
}

/**
 * Keurt een bedrijfsaanvraag goed: zet status op APPROVED en legt de
 * klantgroep, eventuele eigen korting en factuurbetaling vast.
 */
export async function approveCompany(formData: FormData): Promise<void> {
  await requireAdmin();

  const companyId = String(formData.get("companyId") ?? "");
  if (!companyId) return;

  const groupRaw = String(formData.get("customerGroupId") ?? "");
  const customerGroupId = groupRaw ? groupRaw : null;

  const discountRaw = String(formData.get("customDiscountPct") ?? "").trim();
  const parsedDiscount = discountRaw === "" ? null : Number.parseInt(discountRaw, 10);
  const customDiscountPct =
    parsedDiscount === null || Number.isNaN(parsedDiscount) ? null : parsedDiscount;

  const allowInvoicePayment = formData.get("allowInvoicePayment") != null;

  const company = await db.company.update({
    where: { id: companyId },
    data: {
      status: CompanyStatus.APPROVED,
      customerGroupId,
      customDiscountPct,
      allowInvoicePayment,
    },
    include: { users: true },
  });

  // Per contact: een wachtwoord-uitnodiging klaarzetten + mailen (best-effort).
  await Promise.allSettled(
    company.users.map(async (u) => {
      const token = generateToken();
      await db.user.update({
        where: { id: u.id },
        data: { passwordSetToken: token, passwordSetTokenExpiry: tokenExpiry() },
      });
      return sendApprovalInvite(u.email, company.name, `${SITE}/wachtwoord-instellen?token=${token}`);
    }),
  );

  revalidatePath("/admin");
}

/** Wijst een bedrijfsaanvraag af: zet status op REJECTED. */
export async function rejectCompany(formData: FormData): Promise<void> {
  await requireAdmin();

  const companyId = String(formData.get("companyId") ?? "");
  if (!companyId) return;

  await db.company.update({
    where: { id: companyId },
    data: { status: CompanyStatus.REJECTED },
  });

  revalidatePath("/admin");
}
