import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { upsertImageSnapshot } from "@/lib/content-snapshot";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** POST /api/images — urcă o imagine (multipart, câmpul „file") — doar cu sesiune validă. */
export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { ok: false, error: "Acces interzis. Autentifică-te mai întâi." },
      { status: 401 }
    );
  }
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Fișierul lipsește." },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Fișierul nu este o imagine." },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Imaginea depășește 5 MB." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const record = await db.uploadedImage.create({
      data: {
        filename: file.name || "imagine",
        mimeType: file.type,
        data: buffer.toString("base64"),
      },
    });

    // Salvare PERMANENTĂ: imaginea se pune și în copia de rezervă de pe disc
    // (data/images-snapshot.json), ca să poată fi recuperată dacă DB se pierde.
    upsertImageSnapshot(record.id, {
      filename: record.filename,
      mimeType: record.mimeType,
      data: record.data,
    });

    return NextResponse.json({
      ok: true,
      id: record.id,
      url: `/api/images/${record.id}`,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Încărcarea a eșuat." },
      { status: 500 }
    );
  }
}
