import { NextResponse } from "next/server";
import path from "path";
import { isAuth } from "@/lib/auth";
import { put, list, del } from "@vercel/blob";

// Uploads go to Vercel Blob (public store): the deployed filesystem is
// read-only, and Blob URLs are absolute so the portfolio site can use them too.
const PREFIX = "uploads/";

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

    const originalName = file.name;
    const ext = path.extname(originalName) || "";
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${baseName}_${Date.now()}${ext}`;

    const blob = await put(`${PREFIX}${uniqueFilename}`, file, {
      access: "public",
      contentType: file.type || undefined,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
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
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
    const files = blobs
      .map((b) => {
        const name = b.pathname.slice(PREFIX.length);
        const ext = path.extname(name).toLowerCase();
        return {
          name,
          url: b.url,
          size: b.size,
          updatedAt: b.uploadedAt,
          isImage: [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(ext),
          isPdf: ext === ".pdf",
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

    await del(`${PREFIX}${path.basename(filename)}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
