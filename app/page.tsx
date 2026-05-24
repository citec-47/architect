import Link from "next/link";
import { getAllProjects } from "@/lib/queries";
import ProjectHeroCard from "@/components/ProjectHeroCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const revalidate = 60;

export default async function HomePage() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  let dbError: string | null = null;

  try {
    projects = await getAllProjects();
  } catch (e) {
    dbError =
      "Database not reachable yet. Set DATABASE_URL in .env.local and run `npm run db:migrate`.";
  }

  const [featured, ...rest] = projects;

  return (
    <main className="min-h-screen px-3 sm:px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* If there's no featured project, show a plain header bar. */}
        {!featured && (
          <div className="glass-card">
            <SiteHeader />
          </div>
        )}

        {dbError && (
          <div className="glass-card p-6 md:p-12 text-center">
            <h1 className="hero-mega-title text-white mb-4">ARCHITECT SILAS</h1>
            <p className="text-white/70 max-w-md mx-auto">{dbError}</p>
          </div>
        )}

        {/* Top featured project — full GLASSHAVEN hero. */}
        {featured && <ProjectHeroCard project={featured} asLink />}

        {/* Rest of projects — compact cards in the same style. */}
        {rest.length > 0 && (
          <section id="projects" className="glass-card p-5 md:p-12">
            <h2 className="section-title text-white mb-6 md:mb-8">PROJECTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {rest.map((p) => (
                <ProjectHeroCard key={p.id} project={p} asLink height="compact" />
              ))}
            </div>
          </section>
        )}

        {!dbError && projects.length === 0 && (
          <section className="glass-card p-6 md:p-12 text-center">
            <h2 className="section-title text-white mb-4">NO PROJECTS YET</h2>
            <p className="text-white/70 mb-6">
              Sign in to the admin dashboard and add your first project.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full"
            >
              Admin Login
            </Link>
          </section>
        )}

        <SiteFooter />
      </div>
    </main>
  );
}
