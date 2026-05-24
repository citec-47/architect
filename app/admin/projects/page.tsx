import Link from "next/link";
import Image from "next/image";
import { getAllProjectsForAdmin } from "@/lib/queries";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();

  return (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-12 flex items-center justify-between flex-wrap gap-4">
        <h1 className="section-title text-white">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-6 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full"
        >
          + New Project
        </Link>
      </section>

      {projects.length === 0 ? (
        <section className="glass-card p-12 text-center">
          <p className="text-white/70 mb-6">No projects yet — create your first one.</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-6 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full"
          >
            + New Project
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="glass-card overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] w-full bg-slate-800">
                {p.hero_image_url ? (
                  <Image
                    src={p.hero_image_url}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs tracking-widest uppercase">
                    No hero image
                  </div>
                )}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                  {!p.published && (
                    <span className="px-2 py-1 bg-amber-300 text-slate-900 text-[10px] tracking-widest uppercase font-semibold rounded">
                      Draft
                    </span>
                  )}
                  {p.featured && (
                    <span className="px-2 py-1 bg-white text-slate-900 text-[10px] tracking-widest uppercase font-semibold rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="font-display text-white text-lg leading-tight mb-1">
                  {p.title}
                </h2>
                <p className="text-white/55 text-xs tracking-widest uppercase mb-4">
                  {p.category ?? "—"} {p.location ? `· ${p.location}` : ""}
                </p>
                <div className="mt-auto flex gap-2 text-xs">
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="flex-1 text-center px-3 py-2 border border-white/30 text-white rounded-full hover:bg-white/10 tracking-widest uppercase"
                  >
                    Edit
                  </Link>
                  {p.published && (
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="flex-1 text-center px-3 py-2 border border-white/30 text-white rounded-full hover:bg-white/10 tracking-widest uppercase"
                    >
                      View
                    </Link>
                  )}
                  <DeleteProjectButton id={p.id} title={p.title} />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
