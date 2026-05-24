"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteAsset } from "@/lib/cloudinary";
import { slugify } from "@/lib/queries";

export type ServiceInput = {
  service_number: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
};

export type RoomInput = {
  room_name: string;
  area_sqm?: number | null;
};

export type MediaInput = {
  media_type: "image" | "video";
  url: string;
  cloudinary_public_id?: string | null;
  caption?: string | null;
};

export type ProjectInput = {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  description?: string | null;
  category?: string | null;
  featured: boolean;
  published: boolean;
  hero_image_url?: string | null;
  hero_image_public_id?: string | null;
  floor_plan_image_url?: string | null;
  floor_plan_public_id?: string | null;
  total_area_sqm?: number | null;
  watermark_handle?: string | null;
  services: ServiceInput[];
  rooms: RoomInput[];
  media: MediaInput[];
};

export async function createProject(input: ProjectInput) {
  await requireAdmin();
  const slug = await slugify(input.title);

  const inserted = (await sql`
    INSERT INTO projects (
      slug, title, subtitle, location, description, category, featured, published,
      hero_image_url, hero_image_public_id,
      floor_plan_image_url, floor_plan_public_id,
      total_area_sqm, watermark_handle
    ) VALUES (
      ${slug}, ${input.title}, ${input.subtitle ?? null}, ${input.location ?? null},
      ${input.description ?? null}, ${input.category ?? null}, ${input.featured}, ${input.published},
      ${input.hero_image_url ?? null}, ${input.hero_image_public_id ?? null},
      ${input.floor_plan_image_url ?? null}, ${input.floor_plan_public_id ?? null},
      ${input.total_area_sqm ?? null}, ${input.watermark_handle ?? null}
    ) RETURNING id, slug
  `) as unknown as Array<{ id: number; slug: string }>;

  const projectId = inserted[0].id;
  await insertChildren(projectId, input);

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${projectId}/edit`);
}

export async function updateProject(id: number, input: ProjectInput) {
  await requireAdmin();
  const slug = await slugify(input.title, id);

  // Detect orphaned Cloudinary assets to clean up
  const previousRows = (await sql`
    SELECT hero_image_public_id, floor_plan_public_id FROM projects WHERE id = ${id}
  `) as Array<{ hero_image_public_id: string | null; floor_plan_public_id: string | null }>;
  const prev = previousRows[0];

  await sql`
    UPDATE projects SET
      slug = ${slug},
      title = ${input.title},
      subtitle = ${input.subtitle ?? null},
      location = ${input.location ?? null},
      description = ${input.description ?? null},
      category = ${input.category ?? null},
      featured = ${input.featured},
      published = ${input.published},
      hero_image_url = ${input.hero_image_url ?? null},
      hero_image_public_id = ${input.hero_image_public_id ?? null},
      floor_plan_image_url = ${input.floor_plan_image_url ?? null},
      floor_plan_public_id = ${input.floor_plan_public_id ?? null},
      total_area_sqm = ${input.total_area_sqm ?? null},
      watermark_handle = ${input.watermark_handle ?? null},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;

  // Clean up replaced hero/floor-plan assets
  if (prev?.hero_image_public_id && prev.hero_image_public_id !== input.hero_image_public_id) {
    await deleteAsset(prev.hero_image_public_id, "image");
  }
  if (prev?.floor_plan_public_id && prev.floor_plan_public_id !== input.floor_plan_public_id) {
    await deleteAsset(prev.floor_plan_public_id, "image");
  }

  // Replace children — collect public IDs we're about to drop so we can purge them.
  const [oldMedia, oldServices] = (await Promise.all([
    sql`SELECT cloudinary_public_id, media_type FROM project_media WHERE project_id = ${id}`,
    sql`SELECT image_public_id FROM project_services WHERE project_id = ${id}`,
  ])) as [
    Array<{ cloudinary_public_id: string | null; media_type: "image" | "video" }>,
    Array<{ image_public_id: string | null }>,
  ];

  const keepingMediaIds = new Set(
    input.media.map((m) => m.cloudinary_public_id).filter(Boolean) as string[]
  );
  const keepingServiceIds = new Set(
    input.services.map((s) => s.image_public_id).filter(Boolean) as string[]
  );

  await sql`DELETE FROM project_media    WHERE project_id = ${id}`;
  await sql`DELETE FROM project_services WHERE project_id = ${id}`;
  await sql`DELETE FROM project_rooms    WHERE project_id = ${id}`;
  await insertChildren(id, input);

  for (const m of oldMedia) {
    if (m.cloudinary_public_id && !keepingMediaIds.has(m.cloudinary_public_id)) {
      await deleteAsset(m.cloudinary_public_id, m.media_type);
    }
  }
  for (const s of oldServices) {
    if (s.image_public_id && !keepingServiceIds.has(s.image_public_id)) {
      await deleteAsset(s.image_public_id, "image");
    }
  }

  revalidatePath("/");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: number) {
  await requireAdmin();

  const project = (await sql`
    SELECT slug, hero_image_public_id, floor_plan_public_id FROM projects WHERE id = ${id}
  `) as Array<{ slug: string; hero_image_public_id: string | null; floor_plan_public_id: string | null }>;
  if (project.length === 0) return;

  const media = (await sql`
    SELECT cloudinary_public_id, media_type FROM project_media WHERE project_id = ${id}
  `) as Array<{ cloudinary_public_id: string | null; media_type: "image" | "video" }>;
  const services = (await sql`
    SELECT image_public_id FROM project_services WHERE project_id = ${id}
  `) as Array<{ image_public_id: string | null }>;

  await sql`DELETE FROM projects WHERE id = ${id}`;

  // Purge Cloudinary assets after the DB row is gone.
  const p = project[0];
  if (p.hero_image_public_id) await deleteAsset(p.hero_image_public_id, "image");
  if (p.floor_plan_public_id) await deleteAsset(p.floor_plan_public_id, "image");
  for (const m of media) {
    if (m.cloudinary_public_id) await deleteAsset(m.cloudinary_public_id, m.media_type);
  }
  for (const s of services) {
    if (s.image_public_id) await deleteAsset(s.image_public_id, "image");
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

async function insertChildren(projectId: number, input: ProjectInput) {
  for (let i = 0; i < input.services.length; i++) {
    const s = input.services[i];
    await sql`
      INSERT INTO project_services (
        project_id, service_number, title, description, image_url, image_public_id, display_order
      ) VALUES (
        ${projectId}, ${s.service_number}, ${s.title}, ${s.description ?? null},
        ${s.image_url ?? null}, ${s.image_public_id ?? null}, ${i}
      )
    `;
  }
  for (let i = 0; i < input.rooms.length; i++) {
    const r = input.rooms[i];
    await sql`
      INSERT INTO project_rooms (project_id, room_name, area_sqm, display_order)
      VALUES (${projectId}, ${r.room_name}, ${r.area_sqm ?? null}, ${i})
    `;
  }
  for (let i = 0; i < input.media.length; i++) {
    const m = input.media[i];
    await sql`
      INSERT INTO project_media (
        project_id, media_type, url, cloudinary_public_id, caption, display_order
      ) VALUES (
        ${projectId}, ${m.media_type}, ${m.url},
        ${m.cloudinary_public_id ?? null}, ${m.caption ?? null}, ${i}
      )
    `;
  }
}

export async function markMessageRead(id: number, read: boolean) {
  await requireAdmin();
  await sql`UPDATE contact_messages SET read = ${read} WHERE id = ${id}`;
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  await sql`DELETE FROM contact_messages WHERE id = ${id}`;
  revalidatePath("/admin/messages");
}
