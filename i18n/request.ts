import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * Taal zonder URL-routing: de locale komt uit de NEXT_LOCALE-cookie (gezet door
 * de taalwisselaar), met Nederlands als default. Berichten per taal in /messages.
 */
export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
