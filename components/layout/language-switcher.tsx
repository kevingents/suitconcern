"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { locales, localeShort } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Taalwisselaar — zet de NEXT_LOCALE-cookie en herlaadt de server-render. */
export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const locale = useLocale();
  const router = useRouter();

  function select(l: string) {
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-0.5" aria-label="Taal">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => select(l)}
          aria-current={l === locale}
          className={cn(
            "rounded px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide transition-colors",
            l === locale
              ? "text-accent"
              : tone === "light"
                ? "text-white/50 hover:text-white"
                : "text-muted hover:text-ink",
          )}
        >
          {localeShort[l]}
        </button>
      ))}
    </div>
  );
}
