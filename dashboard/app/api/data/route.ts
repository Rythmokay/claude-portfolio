import { NextResponse } from "next/server";
import { getDashboardData, saveDashboardData } from "@/lib/db";
import { cookies } from "next/headers";

async function isAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  if (!(await isAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const success = await saveDashboardData(body);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
