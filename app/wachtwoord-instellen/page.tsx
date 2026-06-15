import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SetPasswordForm } from "./set-password-form";

export const metadata: Metadata = {
  title: "Wachtwoord instellen",
  robots: { index: false, follow: false },
};

export default async function WachtwoordInstellenPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <section className="bg-paper py-16 lg:py-24">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <p className="eyebrow text-accent-dark">B2B-portaal</p>
            <h1 className="mt-3 text-4xl">Wachtwoord instellen</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Kies een wachtwoord voor uw Suitconcern-account. Daarna kunt u inloggen
              en heeft u toegang tot prijzen, voorraad en bestellen.
            </p>
          </div>
          <div className="mt-8">
            <SetPasswordForm token={token ?? ""} />
          </div>
        </div>
      </Container>
    </section>
  );
}
