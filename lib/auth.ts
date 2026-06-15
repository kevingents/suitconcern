import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db, dbConfigured } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validation";

/**
 * Auth.js v5 — credentials-login (e-mail + wachtwoord), JWT-sessie.
 * Sessie draagt rol/goedkeuringsstatus/klantgroep/korting zodat de prijs-gating
 * server-side klopt. Zonder DATABASE_URL is login niet mogelijk en draait de site
 * op de demo-/mock-sessie (zie lib/session.tsx).
 */

export type SessionAccountStatus = "pending" | "approved" | "rejected";

declare module "next-auth" {
  interface User {
    role?: "CUSTOMER" | "ADMIN";
    companyId?: string | null;
    companyName?: string | null;
    status?: SessionAccountStatus | null;
    group?: string | null;
    discountPct?: number;
  }
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "ADMIN";
      companyId: string | null;
      companyName: string | null;
      status: SessionAccountStatus | null;
      group: string | null;
      discountPct: number;
    } & DefaultSession["user"];
  }
}

// Extra velden die we op het JWT-token bewaren (cast, i.p.v. module-augmentatie
// zodat het in Auth.js v5 robuust typecheckt).
type TokenFields = {
  sub?: string;
  role?: "CUSTOMER" | "ADMIN";
  companyId?: string | null;
  companyName?: string | null;
  status?: SessionAccountStatus | null;
  group?: string | null;
  discountPct?: number;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        if (!dbConfigured()) return null;
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { company: { include: { customerGroup: true } } },
        });
        if (!user) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        const company = user.company;
        const discountPct =
          company?.customDiscountPct ?? company?.customerGroup?.discountPct ?? 0;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? company?.name ?? null,
          role: user.role,
          companyId: company?.id ?? null,
          companyName: company?.name ?? null,
          status: company ? (company.status.toLowerCase() as SessionAccountStatus) : null,
          group: company?.customerGroup?.name ?? null,
          discountPct,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const t = token as TokenFields;
        t.role = user.role ?? "CUSTOMER";
        t.companyId = user.companyId ?? null;
        t.companyName = user.companyName ?? null;
        t.status = user.status ?? null;
        t.group = user.group ?? null;
        t.discountPct = user.discountPct ?? 0;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const t = token as TokenFields;
      if (session.user) {
        session.user.id = t.sub ?? "";
        session.user.role = t.role ?? "CUSTOMER";
        session.user.companyId = t.companyId ?? null;
        session.user.companyName = t.companyName ?? null;
        session.user.status = t.status ?? null;
        session.user.group = t.group ?? null;
        session.user.discountPct = t.discountPct ?? 0;
      }
      return session;
    },
  },
});

/** Whether real auth (DB) is active. Used to decide demo-fallback in the UI. */
export function authConfigured(): boolean {
  return dbConfigured();
}

export type AccountSession = {
  authenticated: boolean;
  status: "guest" | "pending" | "approved";
  company: string | null;
  group: string;
  discountPct: number;
  role: "CUSTOMER" | "ADMIN";
};

/**
 * Mapt de Auth.js-sessie naar de vorm die de UI-prijs-gating gebruikt.
 * Geeft null als er geen ingelogde gebruiker is (caller valt dan terug op
 * gast/demo). REJECTED en pending tonen geen prijzen → "pending".
 */
export async function getAccountSession(): Promise<AccountSession | null> {
  if (!dbConfigured()) return null;
  const session = await auth();
  const u = session?.user;
  if (!u) return null;

  const approved = u.status === "approved" || u.role === "ADMIN";
  return {
    authenticated: true,
    status: approved ? "approved" : "pending",
    company: u.companyName ?? null,
    group: u.group ?? "Bronze",
    discountPct: u.discountPct ?? 0,
    role: u.role ?? "CUSTOMER",
  };
}
