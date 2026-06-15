import { Container } from "@/components/ui/container";
import { Breadcrumb, type Crumb } from "@/components/shop/breadcrumb";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_85%_0%,rgba(200,178,138,0.16),transparent_55%)]" />
      <Container className="py-14 lg:py-20">
        {crumbs ? (
          <div className="mb-6 [&_*]:text-white/50 [&_a:hover]:text-white">
            <Breadcrumb items={crumbs} />
          </div>
        ) : null}
        {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
