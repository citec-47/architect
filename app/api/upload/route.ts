import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const files = form.getAll("files");
  if (files.length === 0) {
    return NextResponse.json({ message: "No files provided" }, { status: 400 });
  }

  const results: Array<{ url: string; public_id: string; resource_type: "image" | "video" }> = [];
  for (const f of files) {
    if (!(f instanceof File)) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const uploaded = await uploadBuffer(buf, f.name, f.type);
    results.push(uploaded);
  }
  return NextResponse.json({ files: results });
}
