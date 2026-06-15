import "server-only";
import { Resend } from "resend";

/**
 * Transactionele mail via Resend. Degradeert netjes: zonder RESEND_API_KEY wordt
 * niets verstuurd (alleen gelogd), zodat de flows lokaal/zonder key blijven werken.
 * Secrets (RESEND_API_KEY) horen in Vercel-env.
 */

const FROM = process.env.MAIL_FROM || "Suitconcern <noreply@suitconcern.nl>";
const ADMIN = process.env.MAIL_ADMIN || "orders@suitconcern.nl";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

let _resend: Resend | null = null;
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

/** Sober, merkvast HTML-frame (geen emoji, champagne-accent). */
function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="nl"><body style="margin:0;background:#f7f7f5;font-family:Inter,Arial,sans-serif;color:#111111;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:-0.01em;">suitconcern<span style="color:#c8b28a;">.</span> <span style="font-size:11px;letter-spacing:.18em;color:#6f6f6b;text-transform:uppercase;">business</span></div>
    <div style="height:1px;background:#e6e4df;margin:20px 0 28px;"></div>
    <h1 style="font-family:Georgia,serif;font-weight:500;font-size:24px;margin:0 0 16px;">${title}</h1>
    <div style="font-size:14px;line-height:1.7;color:#1c1c1c;">${bodyHtml}</div>
    <div style="height:1px;background:#e6e4df;margin:28px 0 16px;"></div>
    <p style="font-size:12px;color:#6f6f6b;margin:0;">Suitconcern — groothandel in gala- en bedrijfskleding.</p>
  </div></body></html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 22px;border-radius:12px;">${label}</a>`;
}

async function send(to: string | string[], subject: string, html: string): Promise<boolean> {
  const c = client();
  if (!c) {
    console.log(`[mail] (uit) zou versturen: "${subject}" → ${Array.isArray(to) ? to.join(", ") : to}`);
    return false;
  }
  try {
    await c.emails.send({ from: FROM, to, subject, html });
    return true;
  } catch (e) {
    console.error("[mail] verzenden faalde:", e instanceof Error ? e.message : e);
    return false;
  }
}

/* ── Templates ───────────────────────────────────────────────────────────── */

/** Naar de klant: aanvraag ontvangen (status In behandeling). */
export function sendAccountReceived(to: string, companyName: string) {
  return send(
    to,
    "Uw B2B-aanvraag is ontvangen",
    layout(
      "Bedankt voor uw aanvraag",
      `<p>Beste relatie,</p>
       <p>Wij hebben de B2B-aanvraag voor <strong>${companyName}</strong> in goede orde ontvangen.
       De aanvraag heeft nu de status <strong>In behandeling</strong>. Ons team beoordeelt uw gegevens
       en neemt doorgaans binnen één werkdag contact met u op.</p>
       <p>Zodra uw account is goedgekeurd, ontvangt u een uitnodiging om een wachtwoord in te stellen
       en krijgt u toegang tot prijzen, voorraad en het volledige bestelgemak.</p>`,
    ),
  );
}

/** Naar de admin: nieuwe aanvraag. */
export function sendAdminNewRequest(companyName: string, contactName: string, email: string) {
  return send(
    ADMIN,
    `Nieuwe B2B-aanvraag: ${companyName}`,
    layout(
      "Nieuwe B2B-aanvraag",
      `<p>Er is een nieuwe aanvraag binnengekomen:</p>
       <p><strong>${companyName}</strong><br/>${contactName} &middot; ${email}</p>
       <p>${button(`${SITE}/admin`, "Beoordelen in beheer")}</p>`,
    ),
  );
}

/** Naar de klant: goedgekeurd + uitnodiging om wachtwoord in te stellen. */
export function sendApprovalInvite(to: string, companyName: string, setPasswordUrl: string) {
  return send(
    to,
    "Uw B2B-account is goedgekeurd",
    layout(
      "Welkom bij Suitconcern",
      `<p>Goed nieuws: het account voor <strong>${companyName}</strong> is goedgekeurd.</p>
       <p>Stel hieronder uw wachtwoord in om toegang te krijgen tot prijzen, voorraad en bestellen.
       Deze link is 72 uur geldig.</p>
       <p>${button(setPasswordUrl, "Wachtwoord instellen")}</p>`,
    ),
  );
}

/** Naar de klant: wachtwoord-reset. */
export function sendPasswordReset(to: string, setPasswordUrl: string) {
  return send(
    to,
    "Wachtwoord opnieuw instellen",
    layout(
      "Wachtwoord opnieuw instellen",
      `<p>U (of iemand anders) heeft een nieuw wachtwoord aangevraagd voor uw Suitconcern-account.
       Klik hieronder om een nieuw wachtwoord in te stellen. Deze link is 72 uur geldig.</p>
       <p>${button(setPasswordUrl, "Nieuw wachtwoord instellen")}</p>
       <p style="color:#6f6f6b;">Heeft u dit niet aangevraagd? Dan kunt u deze e-mail negeren.</p>`,
    ),
  );
}
