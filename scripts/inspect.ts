/**
 * Quick inspection of project media in the database.
 * Usage:  npx tsx scripts/inspect.ts
 */
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const projects = (await sql`SELECT * FROM projects ORDER BY id`) as Array<Record<string, unknown>>;

  console.log(`\n${projects.length} projects:\n`);
  for (const p of projects) {
    console.log(`  [${p.id}] ${p.title} (${p.slug}) ${p.published ? "✓ published" : "DRAFT"}`);
    console.log(`       hero_image_url:       ${p.hero_image_url || "<none>"}`);
    console.log(`       hero_image_public_id: ${p.hero_image_public_id || "<none>"}`);
    console.log(`       floor_plan_image_url: ${p.floor_plan_image_url || "<none>"}`);
    console.log(`       total_area_sqm:       ${p.total_area_sqm}`);

    const media = (await sql`
      SELECT id, media_type, url, cloudinary_public_id
      FROM project_media WHERE project_id = ${p.id as number}
      ORDER BY display_order, id
    `) as Array<{ id: number; media_type: string; url: string; cloudinary_public_id: string | null }>;
    const services = (await sql`
      SELECT id, service_number, title, image_url FROM project_services WHERE project_id = ${p.id as number}
    `) as Array<{ id: number; service_number: number; title: string; image_url: string | null }>;
    const rooms = (await sql`
      SELECT id, room_name, area_sqm FROM project_rooms WHERE project_id = ${p.id as number}
    `) as Array<{ id: number; room_name: string; area_sqm: number | null }>;

    console.log(`       media:    ${media.length}`);
    for (const m of media) {
      const type = m.media_type === "video" ? "🎬 VIDEO" : "🖼  IMAGE";
      console.log(`         ${type}  ${m.url}`);
    }
    console.log(`       services: ${services.length}`);
    for (const s of services) {
      console.log(`         ${String(s.service_number).padStart(2, "0")} - ${s.title}${s.image_url ? " (has image)" : ""}`);
    }
    console.log(`       rooms:    ${rooms.length}`);
    for (const r of rooms) {
      console.log(`         ${r.room_name} — ${r.area_sqm} m²`);
    }
    console.log();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
