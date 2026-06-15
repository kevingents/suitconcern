/**
 * Genereert per product TWEE Suitconcern-beelden via FASHN.ai (product-to-model):
 * een MODELFOTO en een DETAILFOTO. Uploadt beide naar Vercel Blob en schrijft een
 * sku → { model, detail }-mapping die de webshop inleest (lib/data/product-images.json).
 *
 * Geen database, geen Shopify — puur een input-JSON in, een mapping-JSON uit.
 *
 * Gebruik:
 *   npm run generate:images                 (verwerkt standaard maximaal 20 producten)
 *   npm run generate:images -- 25           (verwerkt maximaal 25 producten)
 *
 * Input: scripts/fashn-input.json — array van { sku, sourceImageUrl, category }.
 * Zie scripts/fashn-input.example.json voor het formaat.
 *
 * Env (in .env.local of de omgeving):
 *   FASHN_API_KEY                     – FASHN.ai API-key (secret)
 *   STOREGENTS_BLOB_READ_WRITE_TOKEN  – Vercel-blobtoken (of BLOB_READ_WRITE_TOKEN)
 */

import { put } from "@vercel/blob";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateProductImages, fashnConfigured, FASHN_CATEGORIES } from "../lib/fashn";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const INPUT_PATH = resolve(PROJECT_ROOT, "scripts/fashn-input.json");
const MAPPING_PATH = resolve(PROJECT_ROOT, "lib/data/product-images.json");

// Elke rij doet intern al 2 FASHN-runs (model + detail) → houd de batch klein.
const BATCH_SIZE = 3;

interface InputRow {
  sku: string;
  sourceImageUrl: string;
  category: string;
}

type ImageEntry = { model?: string; detail?: string };
type Mapping = Record<string, ImageEntry>;

/**
 * Minimale .env.local-loader (geen dotenv-dependency). Parseert KEY=VALUE-regels,
 * negeert lege regels/comments, ondersteunt optionele quotes. Bestaande
 * process.env-waarden worden NIET overschreven.
 */
function loadEnvLocal(): void {
  const envPath = resolve(PROJECT_ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key || key in process.env) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

/** Leest de bestaande sku→{model,detail}-mapping; geeft {} terug als die er nog niet is. */
function readMapping(): Mapping {
  if (!existsSync(MAPPING_PATH)) return {};
  try {
    const parsed = JSON.parse(readFileSync(MAPPING_PATH, "utf8"));
    return parsed && typeof parsed === "object" ? (parsed as Mapping) : {};
  } catch {
    console.log("Let op: kon bestaande mapping niet lezen — begin met een lege mapping.");
    return {};
  }
}

/** Schrijft de mapping netjes (gesorteerd op sku) terug naar schijf. */
function writeMapping(mapping: Mapping): void {
  mkdirSync(dirname(MAPPING_PATH), { recursive: true });
  const sorted: Mapping = {};
  for (const key of Object.keys(mapping).sort()) sorted[key] = mapping[key];
  writeFileSync(MAPPING_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

/** Haalt het FASHN-resultaat op en uploadt het naar Vercel Blob als PNG. */
async function uploadToBlob(
  sourceUrl: string,
  sku: string,
  variant: "model" | "detail",
  token: string,
): Promise<string | null> {
  const suffix = variant === "detail" ? "-detail" : "";
  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) {
      console.error(`  download-fout voor ${sku} (${variant}): ${res.status}`);
      return null;
    }
    const blob = await put(`suitconcern/products/${sku}${suffix}.png`, await res.arrayBuffer(), {
      access: "public",
      token,
      contentType: "image/png",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  } catch (e) {
    console.error(`  blob-upload-fout voor ${sku} (${variant}):`, e);
    return null;
  }
}

/** Verwerkt één product: 2× FASHN-run (model + detail) → blob-upload → entry. */
async function processRow(row: InputRow, index: number, token: string): Promise<ImageEntry | null> {
  console.log(`- ${row.sku} (${row.category})`);
  const { model, detail } = await generateProductImages({
    sourceImageUrl: row.sourceImageUrl,
    category: row.category,
    index,
  });

  const entry: ImageEntry = {};
  if (model) {
    const url = await uploadToBlob(model, row.sku, "model", token);
    if (url) entry.model = url;
  }
  if (detail) {
    const url = await uploadToBlob(detail, row.sku, "detail", token);
    if (url) entry.detail = url;
  }

  if (!entry.model && !entry.detail) {
    console.log(`  overgeslagen: geen beeld voor ${row.sku}`);
    return null;
  }
  console.log(`  klaar: ${row.sku} → model=${entry.model ? "ja" : "nee"}, detail=${entry.detail ? "ja" : "nee"}`);
  return entry;
}

function printInputHelp(): void {
  console.log(
    [
      `Geen input gevonden op: ${INPUT_PATH}`,
      "",
      "Maak scripts/fashn-input.json aan als een JSON-array van rijen:",
      "",
      "  [",
      '    { "sku": "SC-PAK-1001", "sourceImageUrl": "https://.../bron.jpg", "category": "Pakken" }',
      "  ]",
      "",
      `Toegestane categorieen: ${FASHN_CATEGORIES.join(", ")}`,
      "Per rij worden 2 beelden gegenereerd: model + detail.",
      "Zie scripts/fashn-input.example.json voor een compleet voorbeeld.",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  loadEnvLocal();

  if (!existsSync(INPUT_PATH)) {
    printInputHelp();
    process.exit(0);
  }

  if (!fashnConfigured()) {
    console.error("FASHN_API_KEY ontbreekt. Zet die in .env.local of de omgeving.");
    process.exit(1);
  }
  const blobToken = process.env.STOREGENTS_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    console.error(
      "Blob-token ontbreekt. Zet STOREGENTS_BLOB_READ_WRITE_TOKEN (of BLOB_READ_WRITE_TOKEN).",
    );
    process.exit(1);
  }

  // Input lezen + valideren.
  let rows: InputRow[];
  try {
    const parsed = JSON.parse(readFileSync(INPUT_PATH, "utf8"));
    if (!Array.isArray(parsed)) throw new Error("input is geen JSON-array");
    rows = parsed
      .filter((r: unknown): r is InputRow => {
        const o = r as Partial<InputRow>;
        return Boolean(o && o.sku && o.sourceImageUrl && o.category);
      })
      .map((r) => ({
        sku: String(r.sku).trim(),
        sourceImageUrl: String(r.sourceImageUrl).trim(),
        category: String(r.category).trim(),
      }));
  } catch (e) {
    console.error("Kon scripts/fashn-input.json niet lezen of parsen:", e);
    process.exit(1);
  }

  if (rows.length === 0) {
    console.log("Geen geldige rijen in scripts/fashn-input.json (sku + sourceImageUrl + category vereist).");
    process.exit(0);
  }

  const limit = Math.max(1, Math.min(300, Number(process.argv[2]) || 20));
  const work = rows.slice(0, limit);
  console.log(
    `${work.length} van ${rows.length} producten verwerken (max ${limit}), ${BATCH_SIZE} parallel, 2 beelden p/product.`,
  );

  const mapping = readMapping();
  let done = 0;
  let images = 0;
  const failures: string[] = [];

  for (let start = 0; start < work.length; start += BATCH_SIZE) {
    const batch = work.slice(start, start + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((row, j) => processRow(row, start + j, blobToken)),
    );
    results.forEach((res, j) => {
      const row = batch[j];
      if (res.status === "fulfilled" && res.value) {
        mapping[row.sku] = res.value;
        done++;
        images += (res.value.model ? 1 : 0) + (res.value.detail ? 1 : 0);
      } else {
        if (res.status === "rejected") console.error(`  fout bij ${row.sku}:`, res.reason);
        failures.push(row.sku);
      }
    });
    // Mapping na elke batch wegschrijven zodat voortgang behouden blijft.
    writeMapping(mapping);
  }

  console.log("");
  console.log(`Klaar: ${images} beeld(en) voor ${done} product(en) in lib/data/product-images.json.`);
  if (failures.length) {
    console.log(`Mislukt (${failures.length}): ${failures.join(", ")}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
