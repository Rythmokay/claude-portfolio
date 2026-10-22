import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isAuth,
  safeEqual,
} from "@/lib/auth";

// Credentials come only from env vars — never commit a fallback password
const ADMIN_EMAIL = process.env.DASHBOARD_EMAIL || "admin@rythm.com";
const ADMIN_PASSWORD = process.env.DASHBOARD_PASSWORD;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const token = createSessionToken();
    if (
      ADMIN_PASSWORD &&
      token &&
      email === ADMIN_EMAIL &&
      typeof password === "string" &&
      safeEqual(password, ADMIN_PASSWORD)
    ) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
        sameSite: "lax",
      });

      return NextResponse.json({ success: true, email: ADMIN_EMAIL });
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ isAuthenticated: await isAuth() });
}
