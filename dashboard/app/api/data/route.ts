import { NextResponse } from "next/server";
import { getDashboardData, saveDashboardData } from "@/lib/db";
import { isAuth } from "@/lib/auth";

export async function GET() {
  // Messages are served only by the authenticated /api/messages route
  const { messages: _messages, ...data } = await getDashboardData();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  if (!(await isAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Never write messages into the content blob
    const { messages: _messages, ...body } = await req.json();
    const success = await saveDashboardData({ ...body, messages: [] });
    if (!success) {
      return NextResponse.json(
        { error: "Could not persist changes. Set DATABASE_URL so the dashboard and portfolio share storage." },
        { status: 500 }
      );
    }
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
