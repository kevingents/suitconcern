"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

const TAB_KEYS = ["beschrijving", "specificaties", "maatinformatie", "levering"] as const;
type Tab = (typeof TAB_KEYS)[number];

export function ProductTabs({ product }: { product: Product }) {
  const t = useTranslations("product");
  const [active, setActive] = useState<Tab>("beschrijving");

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line">
        {TAB_KEYS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "relative -mb-px border-b-2 pb-3 pt-1 text-sm transition-colors",
              active === tab ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      <div className="prose-sm mt-6 max-w-3xl text-sm leading-relaxed text-ink/80">
        {active === "beschrijving" ? (
          <div className="space-y-4">
            <p>
              {t("desc.p1", {
                name: product.name,
                brand: product.brand,
                fit: product.fit.toLowerCase(),
                color: product.color.toLowerCase(),
              })}
            </p>
            <p>{t("desc.p2")}</p>
          </div>
        ) : null}

        {active === "specificaties" ? (
          <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {[
              [t("spec.merk"), product.brand],
              [t("spec.artikelnummer"), product.sku],
              [t("spec.kleur"), product.color],
              [t("spec.pasvorm"), product.fit],
              [t("spec.samenstelling"), t("spec.samenstellingValue")],
              [t("spec.voering"), t("spec.voeringValue")],
              [t("spec.onderhoud"), t("spec.onderhoudValue")],
              [t("spec.herkomst"), t("spec.herkomstValue")],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-line py-2">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {active === "maatinformatie" ? (
          <div className="space-y-4">
            <p>{t("maatinfo.p1")}</p>
            <p>{t("maatinfo.p2")}</p>
          </div>
        ) : null}

        {active === "levering" ? (
          <div className="space-y-4">
            <p>{t("leveringInfo.p1")}</p>
            <p>{t("leveringInfo.p2")}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
