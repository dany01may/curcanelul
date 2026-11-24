import { db } from "@/lib/db";
import { normalizeSection } from "@/lib/content-normalize";
import { readContentSnapshot } from "@/lib/content-snapshot";
import {
  CONTENT_KEYS,
  DEFAULT_CONTENT,
  type ContentKey,
  type SiteContent,
} from "@/lib/site-content";

/** Chei deja încercate de auto-recuperare în acest proces (evităm scrieri repetate). */
const healedKeys = new Set<string>();

function isRecordLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Citește conținutul site-ului și îl suprapune peste valorile implicite,
 * cu lanț de recuperare pe trei niveluri pentru fiecare secțiune:
 *   1. baza de date (sursa principală — cea mai recentă)
 *   2. copia de rezervă de pe disc (data/content-snapshot.json)
 *   3. conținutul implicit al site-ului
 *
 * Dacă DB pierde o secțiune (rând șters, corupt sau DB indisponibil), valoarea
 * este recuperată automat din snapshot ȘI rescrisă în DB (auto-vindecare),
 * astfel încât editările din dashboard rămân salvate definitiv.
 */
export async function getSiteContent(): Promise<SiteContent> {
  // Pornim cu valorile implicite, garantate complete și sigure de randat.
  const merged: SiteContent = structuredClone(DEFAULT_CONTENT);

  const snapshot = readContentSnapshot();
  const recovery: Array<{ key: ContentKey; value: Record<string, unknown> }> = [];

  // Valori valide din DB, după cheie
  const dbValues = new Map<string, string>();
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: [...CONTENT_KEYS] } },
    });
    for (const row of rows) {
      if (!(CONTENT_KEYS as readonly string[]).includes(row.key)) continue;
      dbValues.set(row.key, row.value);
    }
  } catch {
    // DB indisponibil — trecem pe snapshot mai jos
  }

  for (const key of CONTENT_KEYS) {
    let parsed: unknown = null;
    let found = false;

    const rawRow = dbValues.get(key);
    if (rawRow !== undefined) {
      try {
        const value: unknown = JSON.parse(rawRow);
        if (isRecordLike(value)) {
          parsed = value;
          found = true;
        }
      } catch {
        // valoare coruptă în DB — trecem pe snapshot
      }
    }

    if (!found && isRecordLike(snapshot[key])) {
      parsed = snapshot[key];
      recovery.push({ key, value: snapshot[key] });
    }

    if (isRecordLike(parsed)) {
      merged[key] = normalizeSection(key, parsed);
    }
  }

  // Auto-vindecare: secțiunile recuperate din snapshot sunt rescrise în DB,
  // cel mult o dată pe cheie în acest proces (evităm scrieri la fiecare cerere).
  if (recovery.length > 0) {
    for (const item of recovery) {
      if (healedKeys.has(item.key)) continue;
      healedKeys.add(item.key);
      try {
        await db.setting.upsert({
          where: { key: item.key },
          update: { value: JSON.stringify(item.value) },
          create: { key: item.key, value: JSON.stringify(item.value) },
        });
      } catch {
        // DB încă indisponibil — site-ul rulează pe snapshot până se repară
      }
    }
  }

  return merged;
}
