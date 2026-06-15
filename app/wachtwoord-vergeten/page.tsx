import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ForgotForm } from "./forgot-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("wachtwoord.vergeten");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function WachtwoordVergetenPage() {
  const t = await getTranslations("wachtwoord");
  return (
    <section className="bg-paper py-16 lg:py-24">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <p className="eyebrow text-accent-dark">{t("eyebrow")}</p>
            <h1 className="mt-3 text-4xl">{t("vergeten.title")}</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {t("vergeten.subtitle")}
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
