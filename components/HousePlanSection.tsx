import Image from "next/image";
import type { Project, ProjectRoom } from "@/lib/types";

/**
 * GLASSHAVEN "HOUSE PLAN" card — total area + room-by-room table + floor plan image.
 */
export default function HousePlanSection({
  project,
  rooms,
}: {
  project: Project;
  rooms: ProjectRoom[];
}) {
  if (!project.floor_plan_image_url && (!rooms || rooms.length === 0)) {
    return null;
  }

  return (
    <section className="glass-card p-5 md:p-12">
      <h2 className="section-title text-white mb-2">HOUSE PLAN</h2>
      {project.total_area_sqm != null && (
        <p className="text-white/70 text-sm tracking-widest uppercase mb-8">
          The area is {Number(project.total_area_sqm)} m²
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="divide-y divide-white/10">
          {rooms.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between py-3 text-white text-sm"
            >
              <span className="text-white/85">{r.room_name}</span>
              <span className="text-white/65 tabular-nums">
                {r.area_sqm != null ? `${Number(r.area_sqm)} m²` : "—"}
              </span>
            </div>
          ))}
        </div>

        {project.floor_plan_image_url && (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-800">
            <Image
              src={project.floor_plan_image_url}
              alt={`${project.title} floor plan`}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
            {project.watermark_handle && (
              <div className="absolute bottom-3 right-4 text-white/80 text-xs tracking-widest">
                {project.watermark_handle}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
