import type { Project } from "@/lib/types";

/**
 * The compact info bar shown directly below the hero on the project detail
 * page. Four labelled columns: category, location, total area, year.
 */
export default function ProjectMetaStrip({ project }: { project: Project }) {
  const year = project.created_at
    ? new Date(project.created_at).getFullYear()
    : null;

  const cells: Array<{ label: string; value: string | null }> = [
    { label: "Category", value: project.category },
    { label: "Location", value: project.location },
    {
      label: "Total Area",
      value: project.total_area_sqm != null ? `${Number(project.total_area_sqm)} m²` : null,
    },
    { label: "Completed", value: year ? String(year) : null },
  ];

  const filled = cells.filter((c) => c.value);
  if (filled.length === 0) return null;

  return (
    <section className="glass-card p-5 md:p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {filled.map((c) => (
          <div key={c.label}>
            <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-2">
              {c.label}
            </div>
            <div className="text-white text-sm md:text-base font-medium tracking-wide">
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
