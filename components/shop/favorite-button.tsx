"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

/**
 * Hart-schakelaar om een artikel als favoriet te markeren. Leest/schrijft de
 * client-favorieten (localStorage) via useFavorites. Gevuld hart = actief.
 */
export function FavoriteButton({ sku, className }: { sku: string; className?: string }) {
  const { has, toggle } = useFavorites();
  const active = has(sku);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Verwijderen uit favorieten" : "Toevoegen aan favorieten"}
      title={active ? "Verwijderen uit favorieten" : "Toevoegen aan favorieten"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(sku);
      }}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-colors", active ? "fill-accent-dark text-accent-dark" : "text-ink")}
        strokeWidth={1.75}
      />
    </button>
  );
}
