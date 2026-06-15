"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Client-winkelwagen (localStorage). Houdt regels per SKU+maat bij met een
 * prijs-snapshot (excl. btw, vóór klantkorting). Korting + btw worden in de UI
 * en server-side (bij het plaatsen van de order) berekend.
 */

export interface CartItem {
  sku: string;
  slug: string;
  name: string;
  brand: string;
  size: string;
  qty: number;
  unitPriceExclVat: number;
  tone: string;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotalExclVat: number;
  /** True zodra de wagen uit localStorage is geladen (voorkomt clear-vóór-hydratie). */
  hydrated: boolean;
  add: (item: CartItem) => void;
  setQty: (sku: string, size: string, qty: number) => void;
  remove: (sku: string, size: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "suitconcern.cart";

function lineKey(sku: string, size: string) {
  return `${sku}__${size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.sku && i.size));
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

  const add: CartContextValue["add"] = (item) => {
    if (item.qty <= 0) return;
    setItems((prev) => {
      const key = lineKey(item.sku, item.size);
      const existing = prev.find((i) => lineKey(i.sku, i.size) === key);
      if (existing) {
        return prev.map((i) => (lineKey(i.sku, i.size) === key ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, item];
    });
  };

  const setQty: CartContextValue["setQty"] = (sku, size, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (lineKey(i.sku, i.size) === lineKey(sku, size) ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const remove: CartContextValue["remove"] = (sku, size) => {
    setItems((prev) => prev.filter((i) => lineKey(i.sku, i.size) !== lineKey(sku, size)));
  };

  const clear = () => setItems([]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotalExclVat = items.reduce((s, i) => s + i.unitPriceExclVat * i.qty, 0);
    return { items, count, subtotalExclVat, hydrated, add, setQty, remove, clear };
  }, [items, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart moet binnen <CartProvider> gebruikt worden");
  return ctx;
}
