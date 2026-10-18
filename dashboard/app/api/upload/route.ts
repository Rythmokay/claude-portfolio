import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "portfolio-assets";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const ext = path.extname(originalName) || "";
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${baseName}_${Date.now()}${ext}`;

    // Target upload path in root public/uploads and local dashboard/public/uploads
    const uploadDirs = [
      path.resolve(process.cwd(), "..", "public", "uploads"),
      path.resolve(process.cwd(), "public", "uploads"),
    ];

    for (const dir of uploadDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, uniqueFilename), buffer);
    }

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      originalName,
      size: file.size,
      type: file.type,
      bucket,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const uploadDir = path.resolve(process.cwd(), "..", "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    return NextResponse.json({ files: [] });
  }

  try {
    const fileNames = fs.readdirSync(uploadDir).filter((f) => !f.startsWith("."));
    const files = fileNames
      .map((f) => {
        const stat = fs.statSync(path.join(uploadDir, f));
        const ext = path.extname(f).toLowerCase();
        const isImage = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(ext);
        const isPdf = ext === ".pdf";
        return {
          name: f,
          url: `/uploads/${f}`,
          size: stat.size,
          updatedAt: stat.mtime,
          isImage,
          isPdf,
        };
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ files });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, files: [] }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await req.json();
    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    const safeFilename = path.basename(filename);
    const target = path.resolve(process.cwd(), "..", "public", "uploads", safeFilename);
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
