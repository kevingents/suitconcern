import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combineer Tailwind-classes met correcte conflict-resolutie. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatteer een bedrag als euro (NL). Alleen gebruiken achter een prijs-gate. */
export function formatPrice(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
