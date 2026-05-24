import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { createSession } from "@/lib/auth";

type AdminRow = { id: number; email: string; password_hash: string };

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password required" }, { status: 400 });
  }

  const rows = (await sql`SELECT id, email, password_hash FROM admins WHERE email = ${email} LIMIT 1`) as AdminRow[];
  const admin = rows[0];

  if (!admin) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  await createSession({ email: admin.email, adminId: admin.id });
  return NextResponse.json({ message: "Login successful", email: admin.email });
}
