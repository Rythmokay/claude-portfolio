import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // Contact messages are private — never ship them to the public site
  const { messages: _messages, ...publicData } = await getPortfolioData();
  return NextResponse.json(publicData);
}

// Writes go through the authenticated dashboard only (its /api/data PUT)
