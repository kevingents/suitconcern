import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!dbConfigured()) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-paper py-20">
        <Container>
          <div className="mx-auto max-w-xl rounded-card border border-line bg-white p-8 text-center sm:p-12">
            <p className="eyebrow text-accent-dark">Beheer</p>
            <h1 className="mt-4 font-serif text-3xl text-ink">
              Database niet geconfigureerd
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Het beheer werkt pas zodra <code>DATABASE_URL</code> is ingesteld
              en authenticatie is ingeschakeld via{" "}
              <code>NEXT_PUBLIC_AUTH_ENABLED</code>. Zonder database draait de
              site op SRS-/mock-data en is er geen accountbeheer.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-ink hover:text-accent-dark">
              Suitconcern
            </Link>
            <span className="text-muted">·</span>
            <span className="text-sm text-muted">Beheer</span>
          </div>
          <span className="text-xs text-muted">{session.user.email}</span>
        </Container>
      </header>
      <Container className="py-10 lg:py-14">{children}</Container>
    </div>
  );
}
