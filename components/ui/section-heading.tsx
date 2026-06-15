import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const isLight = tone === "light";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow mb-3", isLight ? "text-accent" : "text-accent-dark")}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-3xl sm:text-4xl",
          isLight ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed", isLight ? "text-white/70" : "text-muted")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
