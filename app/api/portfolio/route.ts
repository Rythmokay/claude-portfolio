import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // Contact messages are private — never ship them to the public site
  const { messages: _messages, ...publicData } = await getPortfolioData();
  return NextResponse.json(publicData);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await savePortfolioData(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
