import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Sessions are HMAC-signed with the dashboard password, so a forged cookie
// is rejected and changing the password signs everyone out.
function secret(): string | null {
  return process.env.SESSION_SECRET || process.env.DASHBOARD_PASSWORD || null;
}

function sign(payload: string, key: string): string {
  return crypto.createHmac("sha256", key).update(payload).digest("base64url");
}

export function createSessionToken(): string | null {
  const key = secret();
  if (!key) return null;
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires, key)}`;
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export async function isAuth(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(expires, key));
}
