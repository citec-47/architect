import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { sql } from "@/lib/db";

export const revalidate = 60;

type GalleryItem = {
  id: number;
  project_id: number;
  url: string;
  media_type: "image" | "video";
  project_title: string;
  project_slug: string;
};

export default async function GalleryPage() {
  let items: GalleryItem[] = [];
  try {
    items = (await sql`
      SELECT pm.id, pm.project_id, pm.url, pm.media_type,
             p.title AS project_title, p.slug AS project_slug
      FROM project_media pm
      JOIN projects p ON p.id = pm.project_id
      WHERE pm.media_type = 'image'
      ORDER BY p.featured DESC, pm.display_order, pm.id
    `) as GalleryItem[];
  } catch {
    /* db not set up yet */
  }

  return (
    <main className="min-h-screen px-3 sm:px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="glass-card">
          <SiteHeader />
          <div className="px-6 md:px-12 pb-10 pt-6">
            <h1 className="hero-mega-title text-white mb-2">GALLERY</h1>
            <p className="text-white/55 text-sm tracking-widest uppercase">
              Images across every project
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="glass-card p-12 text-center text-white/55">
            No images yet — add a project from the admin dashboard.
          </div>
        ) : (
          <div className="glass-card p-6 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.project_slug}`}
                  className="relative aspect-square overflow-hidden rounded-xl bg-slate-800 group"
                >
                  <Image
                    src={item.url}
                    alt={item.project_title}
                    fill
                    sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs tracking-widest uppercase">
                      {item.project_title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <SiteFooter />
      </div>
    </main>
  );
}
