/**
 * Stijlvolle line-art per categorie — getoond op de placeholder zolang er nog
 * geen eigen fotografie/fashn-beeld is. Geen externe assets; schaalt mee en sluit
 * aan op het palet (champagne-accenten op een donkere gradient).
 */

export type GarmentKind = "suit" | "tux" | "blazer" | "waistcoat" | "shirt" | "tie";

const COLLECTION_TO_KIND: Record<string, GarmentKind> = {
  pakken: "suit",
  smokings: "tux",
  colberts: "blazer",
  gilets: "waistcoat",
  overhemden: "shirt",
  accessoires: "tie",
};

export function kindForCollection(collection?: string): GarmentKind {
  return (collection && COLLECTION_TO_KIND[collection]) || "suit";
}

const STROKE = "rgba(255,255,255,0.82)";
const ACCENT = "#c8b28a";

export function GarmentIllustration({
  collection,
  kind,
  className,
}: {
  collection?: string;
  kind?: GarmentKind;
  className?: string;
}) {
  const k = kind ?? kindForCollection(collection);

  return (
    <svg
      viewBox="0 0 240 300"
      fill="none"
      stroke={STROKE}
      strokeWidth={3}
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      {(k === "suit" || k === "blazer" || k === "tux") && (
        <>
          {k === "tux" && (
            <polygon points="98,82 120,150 142,82 120,70" fill={ACCENT} opacity={0.22} stroke="none" />
          )}
          {/* corpus + zomen */}
          <path d="M78 80 L66 258 L174 258 L162 80" />
          {/* schouders naar revers */}
          <path d="M78 80 L98 82" />
          <path d="M162 80 L142 82" />
          {/* revers (V) */}
          <path d="M98 82 L120 150 L142 82" />
          {/* kraag */}
          <path d="M98 82 L120 70 L142 82" />
          {/* sluiting onder de knoop */}
          <path d="M120 150 L120 258" />
          {/* knopen */}
          <circle cx={120} cy={168} r={3.5} fill={ACCENT} stroke="none" />
          <circle cx={120} cy={196} r={3.5} fill={ACCENT} stroke="none" />
          {k === "tux" ? (
            <>
              {/* vlinderstrik */}
              <polygon points="120,70 104,62 104,80" fill={ACCENT} stroke="none" />
              <polygon points="120,70 136,62 136,80" fill={ACCENT} stroke="none" />
              <rect x={116} y={67} width={8} height={8} rx={1.5} fill={ACCENT} stroke="none" />
            </>
          ) : (
            // pochet
            <polygon points="92,116 108,116 100,128" fill={ACCENT} stroke="none" />
          )}
        </>
      )}

      {k === "waistcoat" && (
        <>
          <path d="M96 84 L92 250 L120 266 L148 250 L144 84" />
          <path d="M96 84 L120 150" />
          <path d="M144 84 L120 150" />
          <circle cx={120} cy={168} r={3.2} fill={ACCENT} stroke="none" />
          <circle cx={120} cy={190} r={3.2} fill={ACCENT} stroke="none" />
          <circle cx={120} cy={212} r={3.2} fill={ACCENT} stroke="none" />
        </>
      )}

      {k === "shirt" && (
        <>
          <path d="M86 82 L80 258 L160 258 L154 82" />
          <path d="M86 82 L104 86" />
          <path d="M154 82 L136 86" />
          {/* kraag */}
          <path d="M104 86 L120 106 L136 86" />
          <path d="M104 86 L117 76" />
          <path d="M136 86 L123 76" />
          {/* knoopsluiting */}
          <path d="M120 106 L120 258" />
          <circle cx={120} cy={132} r={2.6} fill={ACCENT} stroke="none" />
          <circle cx={120} cy={160} r={2.6} fill={ACCENT} stroke="none" />
          <circle cx={120} cy={188} r={2.6} fill={ACCENT} stroke="none" />
          <circle cx={120} cy={216} r={2.6} fill={ACCENT} stroke="none" />
        </>
      )}

      {k === "tie" && (
        <>
          {/* kraag-hint */}
          <path d="M104 72 L120 90 L136 72" />
          <path d="M104 72 L118 64" />
          <path d="M136 72 L122 64" />
          {/* knoop + das */}
          <polygon points="112,86 128,86 126,102 114,102" fill={ACCENT} opacity={0.85} stroke="none" />
          <polygon points="114,102 126,102 134,206 120,250 106,206" fill={ACCENT} opacity={0.85} stroke="none" />
          <polygon points="114,102 126,102 134,206 120,250 106,206" fill="none" stroke={STROKE} strokeWidth={2} />
        </>
      )}
    </svg>
  );
}
