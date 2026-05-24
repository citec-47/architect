import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-12">
        <h1 className="section-title text-white">New Project</h1>
        <p className="text-white/60 text-sm mt-2">
          Fill out the GLASSHAVEN-style details. You can upload images and videos to Cloudinary
          for the hero, the floor plan, services, and the gallery.
        </p>
      </section>
      <ProjectForm />
    </div>
  );
}
