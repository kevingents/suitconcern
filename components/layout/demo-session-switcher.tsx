"use client";

import { useSession, type AccountStatus } from "@/lib/session";
import { cn } from "@/lib/utils";

const OPTIONS: { value: AccountStatus; label: string }[] = [
  { value: "guest", label: "Gast" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

/**
 * Tijdelijke demo-besturing: wissel de sessiestatus zodat het prijs-gating
 * gedrag zichtbaar is zonder echte login. Verdwijnt zodra NextAuth live is.
 */
export function DemoSessionSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { status, setDemoStatus, demo } = useSession();

  // In echte-auth-modus verdwijnt de schakelaar; login bepaalt dan de status.
  if (!demo) return null;

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "hidden text-[0.65rem] uppercase tracking-wider sm:inline",
          tone === "light" ? "text-white/40" : "text-muted",
        )}
      >
        Demo
      </span>
      <div
        className={cn(
          "flex items-center rounded-card p-0.5",
          tone === "light" ? "bg-white/10" : "bg-ink/5",
        )}
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setDemoStatus(opt.value)}
            className={cn(
              "rounded-[9px] px-2.5 py-1 text-[0.65rem] font-medium tracking-wide transition-colors",
              status === opt.value
                ? "bg-accent text-ink"
                : tone === "light"
                  ? "text-white/60 hover:text-white"
                  : "text-muted hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
