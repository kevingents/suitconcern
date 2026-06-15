"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

const TABS = ["Beschrijving", "Specificaties", "Maatinformatie", "Levering"] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Beschrijving");

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "relative -mb-px border-b-2 pb-3 pt-1 text-sm transition-colors",
              active === tab ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="prose-sm mt-6 max-w-3xl text-sm leading-relaxed text-ink/80">
        {active === "Beschrijving" ? (
          <div className="space-y-4">
            <p>
              De {product.name} van {product.brand} combineert een bewezen commerciële pasvorm
              met een verfijnde afwerking. Een {product.fit.toLowerCase()} silhouet in {product.color.toLowerCase()},
              ontworpen voor zowel zakelijke als ceremoniële gelegenheden.
            </p>
            <p>
              Onderdeel van de Suitconcern-kerncollectie en daarmee doorlopend uit voorraad
              leverbaar, met een ruime matenrange en korte naleveringstijden — zodat u nooit
              nee hoeft te verkopen aan uw klant.
            </p>
          </div>
        ) : null}

        {active === "Specificaties" ? (
          <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {[
              ["Merk", product.brand],
              ["Artikelnummer", product.sku],
              ["Kleur", product.color],
              ["Pasvorm", product.fit],
              ["Samenstelling", "55% wol, 43% polyester, 2% elastaan"],
              ["Voering", "Volledig gevoerd"],
              ["Onderhoud", "Stomen"],
              ["Herkomst", "Geweven in Europa"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-line py-2">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {active === "Maatinformatie" ? (
          <div className="space-y-4">
            <p>
              De maten vallen volgens de standaard Europese confectiematen. Voor pakken en colberts
              geldt de borstwijdte-maat; voor overhemden de kraagmaat.
            </p>
            <p>
              Twijfelt u over de juiste maatverdeling voor uw inkoop? Onze accountmanagers
              adviseren u graag over een commercieel afgestemde maatstaffel per model.
            </p>
          </div>
        ) : null}

        {active === "Levering" ? (
          <div className="space-y-4">
            <p>
              Voorraadartikelen worden doorgaans binnen 1–3 werkdagen geleverd. Bestellingen die
              vóór de dagelijkse cut-off worden geplaatst, gaan dezelfde dag de deur uit.
            </p>
            <p>
              Levering verloopt franco huis vanaf het met u afgesproken orderbedrag. Naleveringen
              en backorders worden automatisch aangevuld vanuit het voorraadprogramma.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
