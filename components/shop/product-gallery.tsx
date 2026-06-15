"use client";

import { useState } from "react";
import { ProductMedia } from "@/components/shop/product-media";
import { cn } from "@/lib/utils";

const VIEWS = ["Vooraanzicht", "Achterzijde", "Detail stof", "Op model"];

export function ProductGallery({
  tone,
  name,
  image,
  detailImage,
  category,
}: {
  tone: string;
  name: string;
  image?: string;
  detailImage?: string;
  category?: string;
}) {
  const [active, setActive] = useState(0);
  // Eigen beeld per view: model = Vooraanzicht, detail = "Detail stof"; rest placeholder.
  const viewImages: (string | undefined)[] = [image, undefined, detailImage, undefined];

  return (
    <div className="lg:sticky lg:top-28">
      <ProductMedia
        image={viewImages[active]}
        tone={tone}
        label={`${name} — ${VIEWS[active]}`}
        category={category}
        className="rounded-card"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
      <div className="mt-4 grid grid-cols-4 gap-3">
        {VIEWS.map((view, i) => (
          <button
            key={view}
            onClick={() => setActive(i)}
            aria-label={view}
            className={cn(
              "overflow-hidden rounded-card ring-1 transition-all",
              active === i ? "ring-2 ring-ink" : "ring-line hover:ring-ink/40",
            )}
          >
            <ProductMedia image={viewImages[i]} tone={tone} category={category} ratio="aspect-square" sizes="120px" />
          </button>
        ))}
      </div>
    </div>
  );
}
