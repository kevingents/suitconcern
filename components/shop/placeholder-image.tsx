import { cn } from "@/lib/utils";

/**
 * Premium placeholder voor productfotografie tijdens de prototypefase.
 * Wordt later vervangen door <Image> (Cloudinary / Uploadthing). De `tone`
 * is een Tailwind-gradient uit de datalaag.
 */
export function PlaceholderImage({
  tone,
  label,
  className,
  ratio = "aspect-[4/5]",
}: {
  tone: string;
  label?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        tone,
        ratio,
        className,
      )}
      aria-hidden
    >
      {/* subtiele lichtval */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_15%,rgba(255,255,255,0.14),transparent_60%)]" />
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
