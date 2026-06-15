"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { savePrices } from "./actions";

export interface PriceRow {
  sku: string;
  name: string;
  collection: string;
  current?: number; // huidige groothandelsprijs (excl. btw)
  hint?: number; // SRS/catalogus-richtprijs als er nog geen prijs is
}

const inputClass =
  "h-10 w-32 rounded-card border border-line bg-white px-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";

export function PriceListForm({ rows, writable }: { rows: PriceRow[]; writable: boolean }) {
  const [state, formAction, pending] = useActionState(savePrices, null);

  // Groepeer op collectie voor de leesbaarheid.
  const groups = new Map<string, PriceRow[]>();
  for (const r of rows) {
    if (!groups.has(r.collection)) groups.set(r.collection, []);
    groups.get(r.collection)!.push(r);
  }

  return (
    <form action={formAction}>
      {!writable ? (
        <p className="mb-6 rounded-card bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Geen blob-token geconfigureerd (<code>STOREGENTS_BLOB_READ_WRITE_TOKEN</code>) — je kunt
          prijzen invullen, maar opslaan werkt pas met token.
        </p>
      ) : null}

      <div className="space-y-8">
        {Array.from(groups.entries()).map(([collection, items]) => (
          <div key={collection}>
            <h2 className="font-serif text-lg capitalize text-ink">{collection}</h2>
            <div className="mt-3 divide-y divide-line rounded-card border border-line bg-white">
              {items.map((r) => (
                <div key={r.sku} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{r.name}</p>
                    <p className="text-xs text-muted">{r.sku}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">&euro;</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name={`price__${r.sku}`}
                      defaultValue={r.current ?? ""}
                      placeholder={r.hint ? r.hint.toFixed(2) : "—"}
                      className={inputClass}
                    />
                    <span className="hidden text-xs text-muted sm:inline">excl. btw</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-4 border-t border-line bg-paper/95 py-4 backdrop-blur">
        <p className="text-sm">
          {state?.message ? (
            <span className={state.ok ? "text-emerald-700" : "text-red-700"}>{state.message}</span>
          ) : (
            <span className="text-muted">Leeg laten = &ldquo;prijs op aanvraag&rdquo; voor dat artikel.</span>
          )}
        </p>
        <Button type="submit" size="md" disabled={pending || !writable}>
          {pending ? "Opslaan…" : "Prijzen opslaan"}
        </Button>
      </div>
    </form>
  );
}
