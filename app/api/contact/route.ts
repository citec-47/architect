import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
  const { name, email, message } = body;
  if (!name || !email || !message) {
    return NextResponse.json({ message: "Name, email, and message are required" }, { status: 400 });
  }
  const inserted = (await sql`
    INSERT INTO contact_messages (name, email, message)
    VALUES (${name}, ${email}, ${message})
    RETURNING id, name, email, message, read, created_at
  `) as Array<Record<string, unknown>>;
  return NextResponse.json({ message: "Message received", data: inserted[0] }, { status: 201 });
}
