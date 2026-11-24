import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { getSiteContent } from "@/lib/content-server";
import { rebuildContentSnapshot } from "@/lib/content-snapshot";
import { normalizeSection } from "@/lib/content-normalize";
import { CONTENT_KEYS, type ContentKey } from "@/lib/site-content";

const UNAUTHORIZED = { ok: false, error: "Acces interzis. Autentifică-te mai întâi." };

/** GET /api/content — conținutul complet al site-ului (doar cu sesiune validă). */
export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json({ ok: true, content });
}

/** PUT /api/content — salvează o secțiune ({ key, value }). */
export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }
  try {
    const body = (await request.json().catch(() => null)) as {
      key?: unknown;
      value?: unknown;
    } | null;

    const key = body?.key;
    if (typeof key !== "string" || !(CONTENT_KEYS as readonly string[]).includes(key)) {
      return NextResponse.json(
        { ok: false, error: "Secțiune necunoscută." },
        { status: 400 }
      );
    }

    const value = body?.value;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return NextResponse.json(
        { ok: false, error: "Valoarea secțiunii este invalidă." },
        { status: 400 }
      );
    }

    // Normalizare defensivă: secțiunea salvată este adusă GARANTAT la forma
    // completă așteptată de componente, astfel încât o salvare incompletă să
    // nu poată niciodată să strice randarea paginii publice.
    const normalized = normalizeSection(key as ContentKey, value);

    await db.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(normalized) },
      create: { key, value: JSON.stringify(normalized) },
    });

    // Salvare PERMANENTĂ: după fiecare editare rescriem și copia de rezervă
    // de pe disc (data/content-snapshot.json). Dacă DB s-ar pierde vreodată,
    // site-ul se restaurează singur din acest fișier. Eșecul backup-ului nu
    // anulează salvarea (DB rămâne sursa principală).
    await rebuildContentSnapshot();

    return NextResponse.json({ ok: true, value: normalized });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Salvarea a eșuat." },
      { status: 500 }
    );
  }
}
