import type { Project } from "@/lib/types";

/**
 * Stylized description block. Replaces the old plain paragraph section.
 */
export default function ProjectOverview({ project }: { project: Project }) {
  if (!project.description) return null;

  return (
    <section className="glass-card p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
        <div className="md:col-span-3">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-2">
            01
          </div>
          <h2 className="font-display text-white text-2xl md:text-3xl tracking-tight">
            OVERVIEW
          </h2>
        </div>
        <div className="md:col-span-9">
          <p className="text-white/85 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      </div>
    </section>
  );
}
