import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Wachtwoord vergeten",
  robots: { index: false, follow: false },
};

export default function WachtwoordVergetenPage() {
  return (
    <section className="bg-paper py-16 lg:py-24">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <p className="eyebrow text-accent-dark">B2B-portaal</p>
            <h1 className="mt-3 text-4xl">Wachtwoord vergeten</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Vul uw e-mailadres in. Is het bij ons bekend, dan sturen we u een link
              om een nieuw wachtwoord in te stellen.
            </p>
          </div>
          <div className="mt-8">
            <ForgotForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
