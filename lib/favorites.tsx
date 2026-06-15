"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Client-favorieten (localStorage). Bewaart een lijst van SKU's zodat
 * goedgekeurde klanten artikelen kunnen markeren voor een snelle herbestelling.
 * Werkt zonder DB; spiegelt het patroon van lib/cart.tsx (hydrate on mount,
 * persist on change).
 */

interface FavoritesContextValue {
  /** Gemarkeerde SKU's. */
  items: string[];
  /** Of een SKU gemarkeerd is. */
  has: (sku: string) => boolean;
  /** Schakelt een SKU aan/uit. */
  toggle: (sku: string) => void;
  /** Aantal favorieten. */
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = "suitconcern.favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((s): s is string => typeof s === "string" && s.length > 0));
        }
      }
    } catch {
      /* negeer */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* negeer */
    }
  }, [items, hydrated]);

  const toggle: FavoritesContextValue["toggle"] = (sku) => {
    if (!sku) return;
    setItems((prev) => (prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]));
  };

  const value = useMemo<FavoritesContextValue>(() => {
    const set = new Set(items);
    return {
      items,
      has: (sku: string) => set.has(sku),
      toggle,
      count: items.length,
    };
  }, [items]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites moet binnen <FavoritesProvider> gebruikt worden");
  return ctx;
}
