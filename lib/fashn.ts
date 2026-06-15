/**
 * Getypte FASHN.ai-client (server/Node-only — geen "use client").
 *
 * Spiegelt het FASHN **Product to Model**-pad (model_name "product-to-model"):
 * geef een productfoto + een categorie-prompt, en FASHN genereert zelf een model
 * + styling + een schone studio-achtergrond rond het echte product. Het getoonde
 * kledingstuk blijft accuraat aan de referentie; FASHN stylet de rest contextueel.
 *
 * Flow (identiek aan de referentiepipeline):
 *   POST https://api.fashn.ai/v1/run            → { id }
 *   GET  https://api.fashn.ai/v1/status/{id}     → { status, output[], error }
 * Pollen tot "completed" (output[0]) of "failed", met een nette interval + timeout.
 *
 * Env (secret, in Vercel):
 *   FASHN_API_KEY  – FASHN.ai API-key
 */

const API = "https://api.fashn.ai/v1";

// Pollconfig — gelijk aan de referentie: 2,5s interval, max 60 pogingen (~150s).
const POLL_INTERVAL_MS = 2500;
const POLL_MAX_TRIES = 60;

/**
 * Vaste studio-achtergrond zodat de hele catalogus ondanks pose-variatie één lijn
 * houdt: schoon, neutraal lichtgrijs, zacht egaal licht, high-end e-commerce.
 */
const STUDIO =
  "Clean seamless studio background in a soft neutral light grey, soft even lighting, sharp high-end menswear e-commerce catalog quality. The shown product must stay accurate to the reference photo.";

/**
 * Vaste model-"casting" voor Suitconcern — bewust een eigen, herkenbare look
 * (nadrukkelijk andere modellen dan elders gebruikt). Eén consistente persona over
 * de hele catalogus geeft een eigen identiteit. Overschrijfbaar via FASHN_MODEL_BRIEF
 * zodat je de look kunt bijsturen zonder code te wijzigen.
 */
const MODEL_BRIEF =
  process.env.FASHN_MODEL_BRIEF ||
  "A distinguished European male fashion model in his early forties, tall athletic build, short neatly groomed dark hair lightly greying at the temples, well-kept short stubble, calm confident expression";

/**
 * Roterende set relaxte poses (ontspannen houding, hand in zak, warme glimlach).
 * We kiezen de pose op volgnummer zodat opeenvolgende producten niet identiek/stijf
 * ogen — de catalogus oogt gevarieerd en lifestyle i.p.v. paspoort-recht.
 */
const POSES_FULL = [
  "Relaxed full-length pose, one hand casually in his trouser pocket, weight on one leg, warm genuine smile, looking softly into the camera.",
  "Easy full-length stance at a slight three-quarter angle, both hands loosely in his pockets, friendly relaxed smile, looking into the camera.",
  "Laid-back full-length contrapposto pose, arms relaxed at his sides, head tilted slightly, approachable natural smile, looking into the camera.",
  "Candid full-length shot, caught mid-stride walking slowly toward the camera, relaxed shoulders, light spontaneous smile.",
  "Relaxed full-length pose, one hand adjusting his shirt cuff, soft confident smile, glancing just off to the side.",
];
const POSES_UPPER = [
  "Relaxed pose framed from the knees up, one hand in his pocket, warm genuine smile, looking softly into the camera.",
  "Easy knees-up framing, casual three-quarter turn, arms loosely crossed, friendly relaxed smile, looking into the camera.",
  "Laid-back knees-up shot, one hand running lightly through his hair, natural spontaneous smile, glancing off to the side.",
  "Knees-up framing, at ease with both hands in his pockets, head tilted slightly, approachable warm smile, looking into the camera.",
];
const POSES_DETAIL = [
  "Tightly framed editorial detail on the worn product, focus on fabric texture, stitching and finish; the head and face are NOT in frame.",
  "Close-up detail of the worn product against the torso, focus on material, buttons and craftsmanship; the head and face are NOT in frame.",
];

export type Frame = "full" | "upper" | "detail";

/**
 * Styling per categorie — Nederlandse herenmode, pak-gericht. Per categorie de
 * garment-zin (welk model + hoe gestyled) en het frame (welke poses-pool).
 */
const STYLE: Record<string, { garment: string; frame: Frame }> = {
  Pakken: {
    garment:
      "wearing THIS suit, complete with a crisp white dress shirt and black leather oxford shoes.",
    frame: "full",
  },
  Smokings: {
    garment:
      "wearing THIS tuxedo, complete with a crisp white dress shirt, a black bow tie and black patent leather shoes.",
    frame: "full",
  },
  Colberts: {
    garment:
      "wearing THIS blazer over a crisp white dress shirt, with matching trousers and black leather shoes.",
    frame: "full",
  },
  Gilets: {
    garment:
      "wearing THIS waistcoat over a crisp white dress shirt, with matching trousers and black leather shoes.",
    frame: "full",
  },
  Overhemden: {
    garment: "wearing THIS shirt, neatly styled and tucked into trousers.",
    frame: "upper",
  },
  Accessoires: {
    garment:
      "wearing THIS accessory, styled over neat formal menswear with a crisp white dress shirt.",
    frame: "detail",
  },
};

/** Categorieën die deze pipeline ondersteunt (handig voor validatie/UI). */
export const FASHN_CATEGORIES = Object.keys(STYLE);

/**
 * Bouwt de prompt: styling (garment) + een relaxte pose (geroteerd op volgnummer)
 * + de vaste studio. Spiegelt de referentie. Geeft null bij onbekende categorie.
 */
export function buildPrompt(category: string, index: number, frameOverride?: Frame): string | null {
  const s = STYLE[category];
  if (!s) return null;
  const frame = frameOverride ?? s.frame;
  const pool = frame === "full" ? POSES_FULL : frame === "upper" ? POSES_UPPER : POSES_DETAIL;
  const pose = pool[((index % pool.length) + pool.length) % pool.length];
  return `${MODEL_BRIEF}, ${s.garment} ${pose} ${STUDIO}`;
}

/**
 * Bron-CDN-URL → master zonder width/height-cap (scherpste FASHN-input).
 * Verwijdert alleen voor bekende CDN's de afmeting-caps; laat overige URL's intact.
 */
export function toFullRes(url: string): string {
  try {
    const u = new URL(url);
    if (u.pathname.includes("/cdn/shop") || u.hostname.endsWith("shopify.com")) {
      u.searchParams.delete("width");
      u.searchParams.delete("height");
    }
    return u.toString();
  } catch {
    return url;
  }
}

/** True als de FASHN-key aanwezig is (env). */
export function fashnConfigured(): boolean {
  return Boolean(process.env.FASHN_API_KEY);
}

type StatusResponse = {
  status?: string;
  output?: string[];
  error?: unknown;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface GenerateModelImageArgs {
  /** Bron-productfoto (het kledingstuk) — wordt de product_image-input van FASHN. */
  sourceImageUrl: string;
  /** Categorie (bv. "Pakken") — bepaalt de garment/pose/studio-prompt. */
  category: string;
  /** Volgnummer — roteert de pose zodat de catalogus gevarieerd oogt. */
  index: number;
  /** Forceer een frame (bv. "detail" voor een close-up); default = categorie-frame. */
  frame?: Frame;
}

/**
 * Dient een product-to-model-run in, pollt de status tot completed/failed en
 * geeft de output-beeld-URL terug. Geeft net null terug (i.p.v. te crashen) bij
 * een ontbrekende key, onbekende categorie, API-fout, "failed" of timeout.
 */
export async function generateModelImage({
  sourceImageUrl,
  category,
  index,
  frame,
}: GenerateModelImageArgs): Promise<{ url: string } | null> {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    console.error("  FASHN_API_KEY ontbreekt — overslaan.");
    return null;
  }

  const prompt = buildPrompt(category, index, frame);
  if (!prompt) {
    console.error(`  Onbekende categorie "${category}" — overslaan.`);
    return null;
  }
  if (!sourceImageUrl) {
    console.error("  Geen bron-productfoto — overslaan.");
    return null;
  }

  // 1) Run indienen (model_name "product-to-model", product_image + prompt).
  let id: string;
  try {
    const start = await fetch(`${API}/run`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: "product-to-model",
        inputs: { product_image: toFullRes(sourceImageUrl), prompt, output_format: "jpeg" },
      }),
    });
    if (!start.ok) {
      console.error("  FASHN start-fout:", start.status, (await start.text()).slice(0, 200));
      return null;
    }
    const data = (await start.json()) as { id?: string };
    if (!data.id) {
      console.error("  FASHN gaf geen run-id terug.");
      return null;
    }
    id = data.id;
  } catch (e) {
    console.error("  FASHN start-uitzondering:", e);
    return null;
  }

  // 2) Status pollen tot completed (output[0]) of failed, met timeout.
  for (let i = 0; i < POLL_MAX_TRIES; i++) {
    await sleep(POLL_INTERVAL_MS);
    try {
      const st = await fetch(`${API}/status/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!st.ok) continue;
      const j = (await st.json()) as StatusResponse;
      if (j.status === "completed" && j.output?.[0]) {
        return { url: j.output[0] };
      }
      if (j.status === "failed") {
        console.error("  FASHN faalde:", JSON.stringify(j.error).slice(0, 200));
        return null;
      }
    } catch {
      // Tijdelijke fout tijdens pollen — opnieuw proberen.
      continue;
    }
  }

  console.error("  FASHN-timeout — geen resultaat binnen de tijdslimiet.");
  return null;
}

export interface ProductImages {
  /** Modelfoto (categorie-frame: full/upper). */
  model: string | null;
  /** Detailfoto (close-up op stof/afwerking, zonder gezicht). */
  detail: string | null;
}

/**
 * Genereert per product TWEE beelden: een modelfoto (categorie-frame) en een
 * detailfoto (close-up). Beide runs draaien parallel; een mislukte run geeft
 * gewoon null voor dat beeld terug (de ander blijft bruikbaar).
 */
export async function generateProductImages({
  sourceImageUrl,
  category,
  index,
}: GenerateModelImageArgs): Promise<ProductImages> {
  const [model, detail] = await Promise.all([
    generateModelImage({ sourceImageUrl, category, index }),
    generateModelImage({ sourceImageUrl, category, index, frame: "detail" }),
  ]);
  return { model: model?.url ?? null, detail: detail?.url ?? null };
}
