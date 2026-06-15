import Image from "next/image";
import { PlaceholderImage } from "@/components/shop/placeholder-image";
import { cn } from "@/lib/utils";

/**
 * Toont het eigen Suitconcern-productbeeld (Next Image, bv. fashn.ai-output uit
 * de blobstore) wanneer aanwezig, anders de premium placeholder. NOOIT een
 * SRS-/GENTS-foto — `image` komt uitsluitend uit de eigen mapping.
 */
export function ProductMedia({
  image,
  tone,
  label,
  ratio = "aspect-[4/5]",
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  category,
}: {
  image?: string;
  tone: string;
  label?: string;
  ratio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  category?: string;
}) {
  if (!image) {
    return (
      <PlaceholderImage tone={tone} label={label} ratio={ratio} className={className} category={category} />
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-paper", ratio, className)}>
      <Image src={image} alt={label ?? ""} fill sizes={sizes} className="object-cover" priority={priority} />
    </div>
  );
}
