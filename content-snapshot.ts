import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { CONTENT_KEYS } from "@/lib/site-content";

/**
 * Strat de salvare PERMANENTĂ a conținutului editat din dashboard.
 *
 * Pe lângă baza de date SQLite (sursa principală de adevăr), fiecare salvare
 * scrie o copie de rezervă pe disc, în folderul `data/` al proiectului:
 *   - data/content-snapshot.json  → toate secțiunile editabile (text, meniu, galerie...)
 *   - data/images-snapshot.json   → imaginile urcate din dashboard (base64)
 *
 * Dacă baza de date se pierde, se golește sau se corupte (ex. la publicare,
 * la un reset al mediului sau la o defecțiune), site-ul SE AUTORESTEAZĂ
 * automat din aceste fișiere — editările rămân salvate definitiv.
 *
 * Toate funcțiile sunt „best effort”: niciodată nu aruncă erori și nu pot
 * rupe o salvare sau o randare — DB rămâne sursa principală.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_SNAPSHOT_FILE = path.join(DATA_DIR, "content-snapshot.json");
const IMAGES_SNAPSHOT_FILE = path.join(DATA_DIR, "images-snapshot.json");

export interface SnapshotImage {
  filename: string;
  mimeType: string;
  data: string; // base64
}

/** Citește un fișier JSON sub formă de obiect ({} dacă lipsește / e corupt). */
function readJsonMap(file: string): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fișier lipsă sau corupt — tratăm ca gol
  }
  return {};
}

/** Scriere atomică: mai întâi în fișier temporar, apoi redenumire. */
function writeJsonFileAtomic(file: string, value: unknown): boolean {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(value), "utf8");
    fs.renameSync(tmp, file);
    return true;
  } catch {
    return false;
  }
}

/** Copia de rezervă a conținutului (secțiuni editabile). */
export function readContentSnapshot(): Record<string, unknown> {
  return readJsonMap(CONTENT_SNAPSHOT_FILE);
}

/** Rescrie complet copia de rezervă din DB (apelat după fiecare salvare). */
export async function rebuildContentSnapshot(): Promise<boolean> {
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: [...CONTENT_KEYS] } },
    });
    const map: Record<string, unknown> = {};
    for (const row of rows) {
      if (!(CONTENT_KEYS as readonly string[]).includes(row.key)) continue;
      try {
        const parsed: unknown = JSON.parse(row.value);
        if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
          map[row.key] = parsed;
        }
      } catch {
        // rând corupt în DB — nu-l copiem în snapshot
      }
    }
    return writeJsonFileAtomic(CONTENT_SNAPSHOT_FILE, map);
  } catch {
    return false;
  }
}

/** Copia de rezervă a imaginilor urcate din dashboard. */
export function readImagesSnapshot(): Record<string, SnapshotImage> {
  const raw = readJsonMap(IMAGES_SNAPSHOT_FILE);
  const out: Record<string, SnapshotImage> = {};
  for (const [id, value] of Object.entries(raw)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const v = value as Record<string, unknown>;
      if (
        typeof v.filename === "string" &&
        typeof v.mimeType === "string" &&
        typeof v.data === "string"
      ) {
        out[id] = { filename: v.filename, mimeType: v.mimeType, data: v.data };
      }
    }
  }
  return out;
}

/** Adaugă/actualizează o imagine în copia de rezervă (după fiecare upload). */
export function upsertImageSnapshot(id: string, image: SnapshotImage): boolean {
  const map = readJsonMap(IMAGES_SNAPSHOT_FILE);
  map[id] = image;
  return writeJsonFileAtomic(IMAGES_SNAPSHOT_FILE, map);
}
