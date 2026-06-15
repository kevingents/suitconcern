import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Account-/bestel-/beheerpagina's niet indexeren (publieke catalogus mag wél,
        // zonder prijzen — die zijn login-gated).
        disallow: [
          "/admin",
          "/account",
          "/api/",
          "/checkout",
          "/winkelwagen",
          "/bedankt",
          "/wachtwoord-instellen",
          "/wachtwoord-vergeten",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
