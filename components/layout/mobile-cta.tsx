"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Sticky onderbalk op mobiel — directe B2B-conversie (aanvragen / inloggen). */
export function MobileCta() {
  const { status } = useSession();
  const t = useTranslations("common");
  if (status === "approved") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
      <div className="flex gap-2 px-4 py-3">
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline", size: "md" }), "flex-1")}
        >
          {t("inloggen")}
        </Link>
        <Link
          href="/b2b-account-aanvragen"
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "flex-1")}
        >
          {t("accountAanvragen")}
        </Link>
      </div>
    </div>
  );
}
