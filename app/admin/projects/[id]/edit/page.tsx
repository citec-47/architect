import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/queries";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(Number(id));
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-12">
        <h1 className="section-title text-white">Edit · {project.title}</h1>
        <p className="text-white/60 text-sm mt-2">
          Update text, swap images/videos, or reorder services and rooms.
        </p>
      </section>
      <ProjectForm initial={project} />
    </div>
  );
}
