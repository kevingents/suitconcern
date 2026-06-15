import { useTranslations } from "next-intl";
import { Ruler, Tag, Truck, Warehouse } from "lucide-react";
import { Container } from "@/components/ui/container";
import { usps, type Usp } from "@/lib/data";

const ICONS: Record<Usp["icon"], React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  warehouse: Warehouse,
  truck: Truck,
  ruler: Ruler,
  tag: Tag,
};

export function UspBar() {
  const t = useTranslations("home.usps");
  return (
    <section className="border-b border-line bg-white">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-12 lg:grid-cols-4 lg:py-14">
        {usps.map((usp) => {
          const Icon = ICONS[usp.icon];
          return (
            <div key={usp.icon} className="flex items-start gap-3.5">
              <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-card bg-paper text-accent-dark">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-serif text-base text-ink">{t(`${usp.icon}.title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t(`${usp.icon}.description`)}</p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
