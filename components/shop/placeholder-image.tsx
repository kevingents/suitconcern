import Image from "next/image";
import { cn } from "@/lib/utils";
import { GarmentIllustration } from "@/components/shop/garment-illustration";

/**
 * Premium beeld-slot. Met `src` toont het echte (fashn/fal) fotografie; zonder
 * `src` valt het terug op een on-brand placeholder: pinstripe-textuur + een
 * line-art garment per categorie. De `tone` is een Tailwind-gradient uit de
 * datalaag; `category` bepaalt de illustratie.
 */
export function PlaceholderImage({
  tone,
  label,
  className,
  ratio = "aspect-[4/5]",
  category,
  src,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: {
  tone: string;
  label?: string;
  className?: string;
  ratio?: string;
  category?: string;
  src?: string;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-paper", ratio, className)}>
        <Image src={src} alt={label ?? ""} fill sizes={sizes} className="object-cover" />
        <span className="absolute right-4 top-4 font-serif text-sm text-white/70 drop-shadow">
          sc<span className="text-accent">.</span>
        </span>
      </div>
    );
  }
  return (
    <div
      className={cn("relative overflow-hidden bg-gradient-to-br", tone, ratio, className)}
      aria-hidden
    >
      {/* fijne pinstripe-textuur */}
      <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_7px,#fff_7px,#fff_8px)]" />
      {/* subtiele lichtval */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_15%,rgba(255,255,255,0.14),transparent_60%)]" />
      {/* garment-illustratie */}
      {category ? (
        <GarmentIllustration
          collection={category}
          className="absolute left-1/2 top-1/2 h-[68%] w-auto -translate-x-1/2 -translate-y-1/2"
        />
      ) : null}
      {/* champagne monogram */}
      <span className="absolute right-4 top-4 font-serif text-sm text-white/30">
        sc<span className="text-accent">.</span>
      </span>
      {label ? (
        <span className="absolute bottom-4 left-4 max-w-[80%] font-serif text-lg leading-tight text-white/85">
          {label}
        </span>
      ) : null}
    </div>
  );
}
