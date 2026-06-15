import "server-only";

/**
 * SRS live voorraad-client (SOAP GetStock).
 *
 * Geport van de bewezen storegents-implementatie (lib/srs-stock-client.js).
 * Endpoint: https://ws.srs.nl/messages/v1/soap/Stock.php
 * Auth: inline <Login><Id>{SRS_MESSAGE_USER}</Id><Password>{SRS_MESSAGE_PASSWORD}</Password></Login>
 *
 * GetStock geeft uitsluitend VOORRAAD (pieces per branch/type) terug — geen
 * titel/kleur/maat/prijs. Voor Suitconcern lezen we de catalogus daarom uit de
 * gecachte branch-snapshot (zie lib/srs/snapshot.ts); deze live-client is voor
 * losse SKU-checks / on-demand verversen.
 *
 * Secrets (SRS_MESSAGE_USER/PASSWORD) horen in Vercel-env.
 */

const DEFAULT_BASE_URL = "https://ws.srs.nl";
const STOCK_PATH = "/messages/v1/soap/Stock.php";
const SOAP_TIMEOUT_MS = Number(process.env.SRS_SOAP_TIMEOUT_MS || 20000);

export type StockLevel = { branchId: string; type: string; pieces: number };
export type StockResult = {
  success: boolean;
  checkedAt: string;
  barcode: string;
  sku: string;
  branchId: string;
  pieces: number;
  stockLevels: StockLevel[];
};

function clean(v: unknown): string {
  return String(v ?? "").trim();
}

function xmlEscape(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function srsLiveConfigured(): boolean {
  return Boolean(process.env.SRS_MESSAGE_USER && process.env.SRS_MESSAGE_PASSWORD);
}

function getConfig() {
  const id = process.env.SRS_MESSAGE_USER || "";
  const password = process.env.SRS_MESSAGE_PASSWORD || "";
  const baseUrl = (
    process.env.SRS_STOCK_BASE_URL ||
    process.env.SRS_MESSAGE_BASE_URL ||
    process.env.SRS_BASE_URL ||
    DEFAULT_BASE_URL
  ).replace(/\/$/, "");
  if (!id || !password) throw new Error("SRS_MESSAGE_USER en/of SRS_MESSAGE_PASSWORD ontbreken.");
  return { id, password, endpoint: `${baseUrl}${STOCK_PATH}` };
}

function loginXml(): string {
  const { id, password } = getConfig();
  return `<data:Login><com:Id>${xmlEscape(id)}</com:Id><com:Password>${xmlEscape(password)}</com:Password></data:Login>`;
}

function getNodeText(xml: string, tag: string): string {
  const m = String(xml || "").match(
    new RegExp(`<(?:[A-Za-z0-9_]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[A-Za-z0-9_]+:)?${tag}>`, "i"),
  );
  return m ? m[1].trim() : "";
}

function getAllBlocks(xml: string, tag: string): string[] {
  const re = new RegExp(`<(?:[A-Za-z0-9_]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[A-Za-z0-9_]+:)?${tag}>`, "gi");
  return Array.from(String(xml || "").matchAll(re)).map((m) => m[1]);
}

function parseSoapFault(xml: string): { code: string; message: string } | null {
  const faultString = getNodeText(xml, "faultstring") || getNodeText(xml, "Reason") || getNodeText(xml, "Text");
  const faultCode = getNodeText(xml, "faultcode") || getNodeText(xml, "Code");
  if (!faultString && !faultCode) return null;
  return { code: faultCode, message: faultString || "SRS SOAP fault" };
}

async function postSoap(action: string, xml: string): Promise<string> {
  const { endpoint } = getConfig();
  const controller = new AbortController();
  const timeout = Number.isFinite(SOAP_TIMEOUT_MS) && SOAP_TIMEOUT_MS > 0 ? SOAP_TIMEOUT_MS : 20000;
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: action },
      body: xml,
      signal: controller.signal,
    });
    const text = await response.text();
    const fault = parseSoapFault(text);
    if (!response.ok || fault) {
      throw new Error(fault?.message || `SRS Stock fout: ${response.status}`);
    }
    return text;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(`SRS Stock timeout na ${timeout}ms (${action}).`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function stockLevelFromBlock(block: string): StockLevel {
  return {
    branchId: clean(getNodeText(block, "BranchId")),
    type: clean(getNodeText(block, "Type") || "available"),
    pieces: Number(getNodeText(block, "Pieces") || 0),
  };
}

/** Voorraad voor één barcode/sku, optioneel beperkt tot één branch (702/704). */
export async function getStock({
  barcode = "",
  sku = "",
  branchId = "",
}: {
  barcode?: string;
  sku?: string;
  branchId?: string;
}): Promise<StockResult> {
  const productValue = clean(barcode || sku);
  if (!productValue) throw new Error("SRS Stock barcode/sku ontbreekt.");

  const branchXml = clean(branchId)
    ? `<data:Branches><data:BranchId>${xmlEscape(clean(branchId))}</data:BranchId></data:Branches>`
    : "";
  const productXml = barcode
    ? `<data:Products><data:Barcode>${xmlEscape(productValue)}</data:Barcode></data:Products>`
    : `<data:Products><data:Sku>${xmlEscape(productValue)}</data:Sku></data:Products>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:data="https://messages.srs.nl/v1/Stock/Data" xmlns:com="https://messages.srs.nl/v1/Common">
  <soapenv:Header/>
  <soapenv:Body>
    <data:GetStock>${loginXml()}<data:Body>${branchXml}${productXml}</data:Body></data:GetStock>
  </soapenv:Body>
</soapenv:Envelope>`;

  const raw = await postSoap("GetStock", xml);
  const stockLevels = getAllBlocks(raw, "StockLevel").map(stockLevelFromBlock);
  const wantedBranch = clean(branchId);
  const available = stockLevels.filter((l) => clean(l.type).toLowerCase() === "available");
  const branchLevels = wantedBranch ? available.filter((l) => clean(l.branchId) === wantedBranch) : available;
  const pieces = branchLevels.reduce((sum, l) => sum + Number(l.pieces || 0), 0);

  return {
    success: true,
    checkedAt: new Date().toISOString(),
    barcode: productValue,
    sku: productValue,
    branchId: wantedBranch,
    pieces,
    stockLevels,
  };
}
