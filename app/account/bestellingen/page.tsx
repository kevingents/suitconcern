import Link from "next/link";
import { ArrowRight, Lock, PackageOpen } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";
import { cn, formatPrice } from "@/lib/utils";
import { ReorderButton } from "./reorder-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bestellingen",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  CART: "Winkelwagen",
  PENDING: "In behandeling",
  PAID: "Betaald",
  PROCESSING: "In verwerking",
  SHIPPED: "Verzonden",
  COMPLETED: "Afgerond",
  CANCELLED: "Geannuleerd",
};

function dateLabel(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function InfoState({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
            <Lock className="size-5 text-ink" strokeWidth={1.75} />
          </span>
          <h1 className="mt-6 font-serif text-2xl text-ink">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className={cn(buttonVariants({ variant: "primary" }))}>
              Inloggen
            </Link>
            <Link
              href="/b2b-account-aanvragen"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Account aanvragen
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function BestellingenPage() {
  if (!dbConfigured()) {
    return (
      <section className="bg-paper py-24 lg:py-32">
        <Container>
          <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center sm:p-10">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper">
              <PackageOpen className="size-5 text-ink" strokeWidth={1.75} />
            </span>
            <h1 className="mt-6 font-serif text-2xl text-ink">Bestelgeschiedenis</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Bestelgeschiedenis is beschikbaar zodra de database gekoppeld is.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const session = await auth();
  const user = session?.user;
  const approved = user?.status === "approved" || user?.role === "ADMIN";

  if (!user || !approved || !user.companyId) {
    return (
      <InfoState
        title="Log in voor uw bestellingen"
        body="Uw bestelgeschiedenis is beschikbaar voor goedgekeurde B2B-accounts. Log in of vraag een account aan."
      />
    );
  }

  const orders = await db.order.findMany({
    where: { companyId: user.companyId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <section className="bg-paper py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 text-accent-dark">Mijn account</p>
          <h1 className="text-3xl sm:text-4xl">Bestellingen</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Bekijk uw eerdere bestellingen en plaats ze met één klik opnieuw.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-12 flex max-w-md flex-col items-start rounded-card border border-line bg-white p-8 sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-full bg-paper">
              <PackageOpen className="size-5 text-ink" strokeWidth={1.75} />
            </span>
            <h2 className="mt-6 font-serif text-xl text-ink">Nog geen bestellingen</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Zodra u een bestelling plaatst, vindt u die hier terug.
            </p>
            <Link
              href="/collecties"
              className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
            >
              Naar de collecties
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </div>
        ) : (
          <ul className="mt-12 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-card border border-line bg-white p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">Ordernummer</p>
                      <p className="mt-0.5 font-serif text-lg text-ink">{order.number}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">Datum</p>
                      <p className="mt-0.5 text-sm text-ink">{dateLabel(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">Status</p>
                      <p className="mt-0.5 text-sm text-ink">{STATUS_LABELS[order.status]}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">Totaal</p>
                      <p className="mt-0.5 text-sm font-medium tabular-nums text-ink">
                        {formatPrice(order.totalCents / 100)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <ReorderButton
                      items={order.items.map((i) => ({
                        sku: i.sku,
                        size: i.size,
                        quantity: i.quantity,
                        unitPriceCents: i.unitPriceCents,
                        title: i.title,
                      }))}
                    />
                  </div>
                </div>

                <p className="mt-4 border-t border-line pt-4 text-xs text-muted">
                  {order.items.length} {order.items.length === 1 ? "artikel" : "artikelen"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
