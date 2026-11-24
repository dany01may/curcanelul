/**
 * Helper-e de API pentru panoul de administrare.
 * Toate cererile folosesc căi relative (fără port sau domeniu).
 */

import type { ContentKey, SiteContent } from "@/lib/site-content";

export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/** Eroare dedicată pentru sesiuni lipsă / expirate (401). */
export class UnauthorizedError extends Error {
  constructor() {
    super("Sesiunea a expirat. Introdu parola din nou.");
    this.name = "UnauthorizedError";
  }
}

interface ContentResponse {
  ok?: boolean;
  content?: SiteContent;
}

interface UploadResponse {
  ok?: boolean;
  url?: string;
  id?: string;
}

/** GET /api/content — încarcă tot conținutul site-ului. */
export async function fetchSiteContent(): Promise<SiteContent> {
  const res = await fetch("/api/content", { cache: "no-store" });
  if (res.status === 401) throw new UnauthorizedError();
  const data = (await res.json().catch(() => null)) as ContentResponse | null;
  if (!res.ok || !data?.ok || !data.content) {
    throw new Error("Încărcarea conținutului a eșuat.");
  }
  return data.content;
}

/** PUT /api/content — salvează o singură secțiune de conținut. */
export async function saveContentSection(
  key: ContentKey,
  value: unknown,
): Promise<void> {
  const res = await fetch("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (res.status === 401) throw new UnauthorizedError();
  const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!res.ok || !data?.ok) {
    throw new Error("Salvarea secțiunii a eșuat.");
  }
}

/** GET /api/auth — spune dacă sesiunea curentă este deja deblocată. */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth", { cache: "no-store" });
    const data = (await res.json().catch(() => null)) as {
      authed?: boolean;
    } | null;
    return Boolean(data?.authed);
  } catch {
    return false;
  }
}

/** POST /api/auth — deblochează panoul cu parola. Returnează true la succes. */
export async function loginDashboard(password: string): Promise<boolean> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

/** DELETE /api/auth — deconectare din panou. */
export async function logoutDashboard(): Promise<void> {
  await fetch("/api/auth", { method: "DELETE" }).catch(() => undefined);
}

/** Validare client-side pentru imaginile urcate. */
export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Fișierul nu este o imagine. Acceptăm PNG, JPG sau WebP.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Imaginea depășește limita de ${MAX_IMAGE_SIZE_MB} MB.`;
  }
  return null;
}

/** POST /api/images — urcă o imagine și returnează URL-ul public. */
export async function uploadImageFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/images", { method: "POST", body });
  if (res.status === 401) throw new UnauthorizedError();
  const data = (await res.json().catch(() => null)) as UploadResponse | null;
  if (!res.ok || !data?.ok || typeof data.url !== "string" || data.url.length === 0) {
    throw new Error("Încărcarea imaginii a eșuat.");
  }
  return data.url;
}

/** Copie profundă simplă, sigură pentru conținut JSON. */
export function deepCloneContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}
