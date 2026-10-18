import { NextResponse } from "next/server";
import { saveMessage } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, message } = await req.json().catch(() => ({}));

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await saveMessage({ name, email, message });
  return NextResponse.json({ ok: true });
}
