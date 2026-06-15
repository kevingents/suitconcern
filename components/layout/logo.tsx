import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Suitconcern — naar de homepage"
      className={cn("inline-flex items-baseline gap-1", className)}
    >
      <span
        className={cn(
          "font-serif text-2xl tracking-tight",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        suitconcern<span className="text-accent">.</span>
      </span>
      <span
        className={cn(
          "eyebrow translate-y-[-2px] text-[0.6rem]",
          tone === "light" ? "text-white/50" : "text-muted",
        )}
      >
        business
      </span>
    </Link>
  );
}
