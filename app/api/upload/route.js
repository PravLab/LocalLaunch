import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// export const runtime = "edge"; // 🛡️ required for Vercel Edge Functions
export const runtime = "nodejs";


export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Invalid file upload." }, { status: 400 });
    }

    // ✅ Generate unique filename to avoid collisions
    const filename = `${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Check token or Blob connection." }, { status: 500 });
  }
}
