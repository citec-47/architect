import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, getAllProjects } from "@/lib/queries";
import ProjectHeroCard from "@/components/ProjectHeroCard";
import ProjectMetaStrip from "@/components/ProjectMetaStrip";
import ProjectOverview from "@/components/ProjectOverview";
import ServicesGrid from "@/components/ServicesGrid";
import HousePlanSection from "@/components/HousePlanSection";
import MediaGallery from "@/components/MediaGallery";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // For the "More projects" footer strip.
  const others = (await getAllProjects()).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen px-3 sm:px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <ProjectHeroCard project={project} />
        <ProjectMetaStrip project={project} />
        <ProjectOverview project={project} />
        <ServicesGrid services={project.services} />
        <HousePlanSection project={project} rooms={project.rooms} />
        <MediaGallery media={project.media} />

        {others.length > 0 && <MoreProjects projects={others} />}

        <div className="text-center pt-2 pb-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 text-white/80 hover:text-white text-xs tracking-widest uppercase border border-white/20 rounded-full"
          >
            ← Back to all projects
          </Link>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}

function MoreProjects({
  projects,
}: {
  projects: Awaited<ReturnType<typeof getAllProjects>>;
}) {
  return (
    <section className="glass-card p-5 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 md:mb-10">
        <div className="md:col-span-3">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-2">0</div>
          <h2 className="font-display text-white text-2xl md:text-3xl tracking-tight">
            MORE PROJECTS
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-800 group block"
          >
            {p.hero_image_url && (
              <Image
                src={p.hero_image_url}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="text-white/55 text-[10px] tracking-widest uppercase mb-1">
                {p.category}
              </div>
              <div className="text-white font-display text-xl md:text-2xl tracking-tight">
                {p.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
