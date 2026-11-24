import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readImagesSnapshot } from "@/lib/content-snapshot";

/** Imagini deja încercate de auto-recuperare în acest proces. */
const healedImageIds = new Set<string>();

interface ImagePayload {
  filename: string;
  mimeType: string;
  data: string; // base64
}

/** GET /api/images/[id] — servește o imagine urcată din dashboard.
 *
 *  Lanț de recuperare: DB → copia de rezervă de pe disc (data/images-snapshot.json).
 *  Dacă imaginea a dispărut din DB, este servită din backup ȘI rescrisă
 *  automat în DB (auto-vindecare), astfel încât imaginile din dashboard
 *  rămân pe site definitiv.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    let image: ImagePayload | null = null;

    // 1) DB — sursa principală
    try {
      const record = await db.uploadedImage.findUnique({ where: { id } });
      if (record) {
        image = { filename: record.filename, mimeType: record.mimeType, data: record.data };
      }
    } catch {
      // DB indisponibil — trecem pe backup
    }

    // 2) Backup de pe disc + auto-vindecare (rescriere în DB)
    if (!image) {
      const snapshotImage = readImagesSnapshot()[id];
      if (snapshotImage) {
        image = snapshotImage;
        if (!healedImageIds.has(id)) {
          healedImageIds.add(id);
          try {
            await db.uploadedImage.create({
              data: {
                id,
                filename: snapshotImage.filename,
                mimeType: snapshotImage.mimeType,
                data: snapshotImage.data,
              },
            });
          } catch {
            // DB încă indisponibil — servim din backup până se repară
          }
        }
      }
    }

    if (!image) {
      return new NextResponse("Imaginea nu a fost găsită.", { status: 404 });
    }

    const bytes = Buffer.from(image.data, "base64");
    const body = new Uint8Array(bytes);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(body.byteLength),
        // ID-ul e unic pentru conținut — cache etern e sigur
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Eroare la servirea imaginii.", { status: 500 });
  }
}
