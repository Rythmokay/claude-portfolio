import { NextResponse } from "next/server";
import { saveMessage } from "@/lib/db";
import { sendContactEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // Honeypot: real visitors never see or fill this field
  if (body.company) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 254 || message.length > 5000 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const msg = { name, email, message };

  // Store for the dashboard and email the inbox at the same time
  const [stored, emailed] = await Promise.all([
    saveMessage(msg),
    sendContactEmail(msg),
  ]);

  if (!stored && !emailed) {
    return NextResponse.json({ error: "Could not deliver message" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored, emailed });
}
