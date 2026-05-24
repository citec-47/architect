/**
 * Run schema.sql against the NeonDB instance pointed at by DATABASE_URL,
 * then seed an initial admin row from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Usage:  npm run db:migrate
 */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Copy .env.local.example to .env.local first.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const schema = readFileSync(join(process.cwd(), "database", "schema.sql"), "utf8");

  console.log("Applying schema.sql ...");
  // Strip `--` comments line-by-line first, then split on `;`.
  // (Stripping before split is critical: a leading comment block would otherwise
  // make the whole CREATE TABLE chunk look like it "starts with --" and get filtered.)
  const cleaned = schema
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("--");
      return idx === -1 ? line : line.slice(0, idx);
    })
    .join("\n");

  const statements = cleaned
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // neon HTTP driver: call sql as a function with raw SQL string.
  const run = sql as unknown as (q: string) => Promise<unknown>;
  for (const stmt of statements) {
    try {
      await run(stmt);
    } catch (err) {
      console.error(`Failed running:\n${stmt.slice(0, 200)}...\n`);
      throw err;
    }
  }
  console.log(`  ${statements.length} statements applied.`);

  const email = process.env.ADMIN_EMAIL ?? "silaschah18@gmail.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe@2026";
  const hash = await bcrypt.hash(password, 10);

  const existing = await sql`SELECT id FROM admins WHERE email = ${email}`;
  if (existing.length === 0) {
    await sql`INSERT INTO admins (email, password_hash) VALUES (${email}, ${hash})`;
    console.log(`  seeded admin: ${email}`);
  } else {
    console.log(`  admin ${email} already exists, leaving password untouched.`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
