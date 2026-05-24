import { sql } from "./db";
import type {
  Project,
  ProjectDetail,
  ProjectMedia,
  ProjectRoom,
  ProjectService,
} from "./types";

/** Public — only published projects, featured first. */
export async function getAllProjects(): Promise<Project[]> {
  return (await sql`
    SELECT * FROM projects
    WHERE published = true
    ORDER BY featured DESC, created_at DESC
  `) as unknown as Project[];
}

/** Admin — everything including drafts. */
export async function getAllProjectsForAdmin(): Promise<Project[]> {
  return (await sql`
    SELECT * FROM projects
    ORDER BY published ASC, featured DESC, created_at DESC
  `) as unknown as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await sql`
    SELECT * FROM projects
    WHERE featured = true AND published = true
    ORDER BY created_at DESC
  `) as unknown as Project[];
}

/** Public: only published. Drafts return 404 to non-admins. */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const rows = (await sql`
    SELECT * FROM projects WHERE slug = ${slug} AND published = true LIMIT 1
  `) as unknown as Project[];
  if (rows.length === 0) return null;
  return enrichProject(rows[0]);
}

export async function getProjectById(id: number): Promise<ProjectDetail | null> {
  const rows = (await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`) as unknown as Project[];
  if (rows.length === 0) return null;
  return enrichProject(rows[0]);
}

async function enrichProject(project: Project): Promise<ProjectDetail> {
  const [media, services, rooms] = await Promise.all([
    sql`SELECT * FROM project_media WHERE project_id = ${project.id} ORDER BY display_order, id`,
    sql`SELECT * FROM project_services WHERE project_id = ${project.id} ORDER BY display_order, service_number`,
    sql`SELECT * FROM project_rooms WHERE project_id = ${project.id} ORDER BY display_order, id`,
  ]);
  return {
    ...project,
    media: media as unknown as ProjectMedia[],
    services: services as unknown as ProjectService[],
    rooms: rooms as unknown as ProjectRoom[],
  };
}

export async function slugify(title: string, existingId?: number): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "project";

  let candidate = base;
  let n = 2;
  while (true) {
    const rows = existingId
      ? ((await sql`SELECT id FROM projects WHERE slug = ${candidate} AND id <> ${existingId} LIMIT 1`) as { id: number }[])
      : ((await sql`SELECT id FROM projects WHERE slug = ${candidate} LIMIT 1`) as { id: number }[]);
    if (rows.length === 0) return candidate;
    candidate = `${base}-${n++}`;
  }
}
