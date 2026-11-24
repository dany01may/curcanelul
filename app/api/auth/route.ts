import { NextResponse } from "next/server";
import {
  isAuthenticated,
  sessionCookieOptions,
  sessionToken,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";

/** GET /api/auth — verifică dacă sesiunea curentă este autentificată. */
export async function GET(request: Request) {
  return NextResponse.json({ ok: true, authed: isAuthenticated(request) });
}

/** POST /api/auth — deblochează panoul cu parola corectă. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (password.length === 0 || !verifyPassword(password)) {
    // Mică întârziere ca să îngreunăm încercările automate de ghicire.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json(
      { ok: false, error: "Parolă incorectă." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, sessionToken(), sessionCookieOptions());
  return response;
}

/** DELETE /api/auth — deconectare (invalidează cookie-ul de sesiune). */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
