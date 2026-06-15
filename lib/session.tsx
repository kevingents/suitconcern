"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SessionProvider as NextAuthProvider,
  useSession as useNextAuthSession,
} from "next-auth/react";

/**
 * Sessie voor de prijs-gating. Twee modi met dezelfde `useSession()`-API:
 *  - ECHT (NEXT_PUBLIC_AUTH_ENABLED=true): leest de Auth.js-sessie (rol, status,
 *    klantgroep, korting). Demo-schakelaar is uit.
 *  - DEMO (geen DB/auth): lokale schakelaar (Gast/Pending/Approved) zodat het
 *    gedrag zichtbaar is zonder login.
 *
 * Kernregel: prijzen/voorraad/bestellen alleen voor status "approved".
 */

export type AccountStatus = "guest" | "pending" | "approved";
export type CustomerGroup = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface SessionState {
  status: AccountStatus;
  company: string | null;
  group: string;
  discountPct: number;
}

interface SessionContextValue extends SessionState {
  isApproved: boolean;
  isAdmin: boolean;
  /** true = demo-modus (geen echte auth) → toon de demo-schakelaar. */
  demo: boolean;
  setDemoStatus: (status: AccountStatus) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = "suitconcern.demo-session";
const GROUP_DISCOUNT: Record<CustomerGroup, number> = {
  Bronze: 0,
  Silver: 5,
  Gold: 10,
  Platinum: 15,
};

const GUEST: SessionState = { status: "guest", company: null, group: "Bronze", discountPct: 0 };

function demoStateFor(status: AccountStatus): SessionState {
  if (status === "guest") return GUEST;
  if (status === "pending") {
    return { status, company: "Modehuis Berends", group: "Bronze", discountPct: 0 };
  }
  return { status: "approved", company: "Modehuis Berends", group: "Silver", discountPct: GROUP_DISCOUNT.Silver };
}

/* ── Demo-modus (localStorage) ──────────────────────────────────────────────── */
function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(GUEST);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as AccountStatus | null;
      if (saved === "pending" || saved === "approved") setState(demoStateFor(saved));
    } catch {
      /* localStorage niet beschikbaar */
    }
  }, []);

  const setDemoStatus = (status: AccountStatus) => {
    setState(demoStateFor(status));
    try {
      window.localStorage.setItem(STORAGE_KEY, status);
    } catch {
      /* negeer */
    }
  };

  const value = useMemo<SessionContextValue>(
    () => ({ ...state, isApproved: state.status === "approved", isAdmin: false, demo: true, setDemoStatus }),
    [state],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/* ── Echte auth (Auth.js via next-auth/react) ───────────────────────────────── */
function RealSessionProvider({ children }: { children: React.ReactNode }) {
  const { data } = useNextAuthSession();
  const u = data?.user;

  const value = useMemo<SessionContextValue>(() => {
    const approved = u?.status === "approved" || u?.role === "ADMIN";
    const state: SessionState = u
      ? {
          status: approved ? "approved" : "pending",
          company: u.companyName ?? null,
          group: u.group ?? "Bronze",
          discountPct: u.discountPct ?? 0,
        }
      : GUEST;
    return {
      ...state,
      isApproved: state.status === "approved",
      isAdmin: u?.role === "ADMIN",
      demo: false,
      setDemoStatus: () => {},
    };
  }, [u?.status, u?.role, u?.companyName, u?.group, u?.discountPct]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function SessionProvider({
  authEnabled = false,
  children,
}: {
  authEnabled?: boolean;
  children: React.ReactNode;
}) {
  if (authEnabled) {
    return (
      <NextAuthProvider>
        <RealSessionProvider>{children}</RealSessionProvider>
      </NextAuthProvider>
    );
  }
  return <DemoSessionProvider>{children}</DemoSessionProvider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession moet binnen <SessionProvider> gebruikt worden");
  return ctx;
}
