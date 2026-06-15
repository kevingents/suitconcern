import { Building2, CheckCircle2, Inbox, Users } from "lucide-react";
import { db } from "@/lib/db";
import { CompanyStatus, type CustomerGroup, type Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { approveCompany, rejectCompany } from "./actions";

export const dynamic = "force-dynamic";

type StatCard = {
  icon: typeof Inbox;
  label: string;
  value: number;
};

type PendingCompany = Prisma.CompanyGetPayload<{
  include: {
    users: { select: { email: true; name: true } };
    customerGroup: true;
  };
}>;

export default async function AdminDashboardPage() {
  let pendingCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;
  let userCount = 0;
  let pendingCompanies: PendingCompany[] = [];
  let groups: CustomerGroup[] = [];
  let loadError = false;

  try {
    [pendingCount, approvedCount, rejectedCount, userCount, pendingCompanies, groups] =
      await Promise.all([
        db.company.count({ where: { status: CompanyStatus.PENDING } }),
        db.company.count({ where: { status: CompanyStatus.APPROVED } }),
        db.company.count({ where: { status: CompanyStatus.REJECTED } }),
        db.user.count(),
        db.company.findMany({
          where: { status: CompanyStatus.PENDING },
          orderBy: { createdAt: "asc" },
          include: {
            users: { select: { email: true, name: true } },
            customerGroup: true,
          },
        }),
        db.customerGroup.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <h1 className="font-serif text-2xl text-ink">Gegevens niet beschikbaar</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          De database kon niet worden gelezen. Controleer de verbinding en of de
          migraties zijn uitgevoerd.
        </p>
      </div>
    );
  }

  const stats: StatCard[] = [
    { icon: Inbox, label: "Open aanvragen", value: pendingCount },
    { icon: CheckCircle2, label: "Goedgekeurd", value: approvedCount },
    { icon: Users, label: "Klanten", value: userCount },
  ];

  return (
    <div className="space-y-12">
      <header>
        <p className="eyebrow text-accent-dark">Dashboard</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">Beheer</h1>
        <p className="mt-2 text-sm text-muted">
          Beoordeel nieuwe B2B-aanvragen en stel klantgroep en korting in.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-card border border-line bg-white p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <p className="mt-5 font-serif text-4xl text-ink">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-ink">Openstaande aanvragen</h2>
          {rejectedCount > 0 ? (
            <span className="text-xs text-muted">{rejectedCount} afgewezen</span>
          ) : null}
        </div>

        {groups.length === 0 ? (
          <div className="rounded-card border border-line bg-white p-5 text-sm text-muted">
            Er zijn nog geen klantgroepen. Voer{" "}
            <code>npm run db:seed</code> uit om de standaardgroepen en een
            beheerder aan te maken.
          </div>
        ) : null}

        {pendingCompanies.length === 0 ? (
          <div className="rounded-card border border-line bg-white p-10 text-center">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-card bg-accent/20 text-accent-dark">
              <Building2 className="size-6" strokeWidth={1.5} />
            </span>
            <p className="mt-5 font-serif text-xl text-ink">
              Geen openstaande aanvragen
            </p>
            <p className="mt-2 text-sm text-muted">
              Nieuwe B2B-aanvragen verschijnen hier zodra ze binnenkomen.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingCompanies.map((company) => {
              const contactEmail = company.users[0]?.email ?? null;
              return (
                <article
                  key={company.id}
                  className="rounded-card border border-line bg-white p-6"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-xl text-ink">{company.name}</h3>
                    {contactEmail ? (
                      <p className="text-sm text-muted">{contactEmail}</p>
                    ) : null}
                  </div>

                  <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="KvK" value={company.kvk} />
                    <Detail label="Btw-nummer" value={company.vatNumber} />
                    <Detail label="Type" value={company.businessType} />
                    <Detail label="Plaats" value={company.city} />
                    <Detail label="Verwacht volume" value={company.expectedVolume} />
                    <Detail label="Website" value={company.website} />
                  </dl>

                  <div className="mt-6 border-t border-line pt-6">
                    <form
                      action={approveCompany}
                      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
                    >
                      <input type="hidden" name="companyId" value={company.id} />

                      <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium text-ink">Klantgroep</span>
                        <select
                          name="customerGroupId"
                          defaultValue={company.customerGroupId ?? ""}
                          className="h-11 rounded-card border border-line bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
                        >
                          <option value="">Geen groep</option>
                          {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.name} ({group.discountPct}%)
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium text-ink">Eigen korting</span>
                        <input
                          type="number"
                          name="customDiscountPct"
                          min={0}
                          max={100}
                          placeholder="Eigen korting %"
                          className="h-11 rounded-card border border-line bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
                        />
                      </label>

                      <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2 lg:col-span-1 lg:h-11">
                        <input
                          type="checkbox"
                          name="allowInvoicePayment"
                          className="size-4 rounded border-line text-ink focus:ring-accent"
                        />
                        Achteraf op factuur toestaan
                      </label>

                      <Button type="submit" variant="primary">
                        Goedkeuren
                      </Button>
                    </form>

                    <form action={rejectCompany} className="mt-3">
                      <input type="hidden" name="companyId" value={company.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Afwijzen
                      </Button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}
