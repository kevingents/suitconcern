"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Leegt de winkelwagen zodra de bedankpagina is geladen. */
export function ClearCart() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    // Pas legen ná hydratie, anders herstelt de provider de wagen uit localStorage.
    if (hydrated) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  return null;
}
