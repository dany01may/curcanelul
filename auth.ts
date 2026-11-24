import { createHash, timingSafeEqual } from "crypto";

/**
 * Autentificarea panoului de administrare.
 *
 * IMPORTANT: acest modul rulează DOAR pe server (API routes).
 * Niciodată importat în componente client — parola nu trebuie să
 * ajungă vreodată în bundle-ul de JavaScript al browserului.
 *
 * Parola poate fi schimbată prin variabila de mediu DASHBOARD_PASSWORD.
 */

const DASHBOARD_PASSWORD =
  process.env.DASHBOARD_PASSWORD ?? "N25_admin@@%";

/** Sare folosită la derivarea token-ului de sesiune. */
const SESSION_SALT =
  process.env.DASHBOARD_SESSION_SALT ?? "curcanelul-salt-v1";

export const SESSION_COOKIE = "dash_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 zile

/**
 * Token de sesiune derivat criptografic din parolă.
 * Nu poate fi calculat fără parolă, deci nu poate fi falsificat din browser.
 */
export function sessionToken(): string {
  return createHash("sha256")
    .update(`${SESSION_SALT}:${DASHBOARD_PASSWORD}`)
    .digest("hex");
}

/** Opțiunile cookie-ului de sesiune (httpOnly — inaccesibil din JS). */
export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

/** Comparație în timp constant — nu scoate informații din timpul de răspuns. */
export function verifyPassword(candidate: string): boolean {
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(DASHBOARD_PASSWORD, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Verifică dacă cererea poartă un cookie de sesiune valid. */
export function isAuthenticated(request: Request): boolean {
  const header = request.headers.get("cookie");
  if (!header) return false;

  const expected = sessionToken();
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${SESSION_COOKIE}=`)) continue;

    const value = decodeURIComponent(trimmed.slice(SESSION_COOKIE.length + 1));
    if (value.length !== expected.length) continue;
    if (timingSafeEqual(Buffer.from(value), Buffer.from(expected))) {
      return true;
    }
  }
  return false;
}
