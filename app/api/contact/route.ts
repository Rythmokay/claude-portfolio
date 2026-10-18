import { NextResponse } from "next/server";

// Placeholder endpoint so the contact form works out of the box.
// Replace the body of this handler with your own backend logic
// (send an email, write to a database, call a CRM, etc.).
export async function POST(req: Request) {
  const { name, email, message } = await req.json().catch(() => ({}));

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // TODO: handle the submission here.
  return NextResponse.json({ ok: true });
}
