import { NextResponse } from "next/server";
import { testConnection, syncToSupabase } from "@/lib/db";
import { cookies } from "next/headers";

async function isAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

export async function POST(req: Request) {
  if (!(await isAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, connectionString } = await req.json();

    if (action === "test") {
      const result = await testConnection(connectionString);
      return NextResponse.json(result);
    } else if (action === "sync") {
      const result = await syncToSupabase(connectionString);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
