import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type Counts = { projects: number; messages: number; unread: number };

async function getCounts(): Promise<Counts> {
  const [p, m, u] = (await Promise.all([
    sql`SELECT COUNT(*)::int AS c FROM projects`,
    sql`SELECT COUNT(*)::int AS c FROM contact_messages`,
    sql`SELECT COUNT(*)::int AS c FROM contact_messages WHERE read = false`,
  ])) as Array<Array<{ c: number }>>;
  return { projects: p[0].c, messages: m[0].c, unread: u[0].c };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  return (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-12">
        <h1 className="section-title text-white mb-2">Studio Dashboard</h1>
        <p className="text-white/60 text-sm">Manage projects, media, and incoming messages.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Projects" value={counts.projects} href="/admin/projects" />
        <StatCard label="Messages" value={counts.messages} href="/admin/messages" />
        <StatCard label="Unread" value={counts.unread} href="/admin/messages" highlight />
      </section>

      <section className="glass-card p-6 md:p-12">
        <h2 className="section-title text-white mb-6" style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className="px-6 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full"
          >
            + New Project
          </Link>
          <Link
            href="/admin/projects"
            className="px-6 py-3 border border-white/30 text-white font-semibold tracking-widest text-xs uppercase rounded-full hover:bg-white/10"
          >
            Manage Projects
          </Link>
          <Link
            href="/admin/messages"
            className="px-6 py-3 border border-white/30 text-white font-semibold tracking-widest text-xs uppercase rounded-full hover:bg-white/10"
          >
            View Messages
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="glass-card p-8 hover:bg-white/5 transition-colors block"
    >
      <div className="text-xs tracking-widest uppercase text-white/50 mb-3">{label}</div>
      <div
        className={`hero-mega-title ${highlight && value > 0 ? "text-amber-300" : "text-white"}`}
        style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
      >
        {value}
      </div>
    </Link>
  );
}
