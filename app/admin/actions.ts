"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CompanyStatus, UserRole } from "@prisma/client";

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

  await db.company.update({
    where: { id: companyId },
    data: {
      status: CompanyStatus.APPROVED,
      customerGroupId,
      customDiscountPct,
      allowInvoicePayment,
    },
  });

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
