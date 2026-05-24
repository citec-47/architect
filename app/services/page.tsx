import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const SERVICES = [
  {
    n: "01",
    title: "PROPERTY SHOWCASE",
    desc: "High-impact visuals that elevate each property's unique essence.",
  },
  {
    n: "02",
    title: "SITE PLANNING",
    desc: "Refined layouts that harmonize with the natural landscape.",
  },
  {
    n: "03",
    title: "BUILDING DESIGN",
    desc: "Timeless architecture blending form, function, and sophistication.",
  },
  {
    n: "04",
    title: "SPACE PLANNING",
    desc: "Purposeful interiors designed for flow, balance, and quiet luxury.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-3 sm:px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="glass-card">
          <SiteHeader />
          <div className="px-6 md:px-12 pb-16 pt-6">
            <h1 className="hero-mega-title text-white mb-2">SERVICES</h1>
            <p className="text-white/55 text-sm tracking-widest uppercase mb-10">
              What the studio offers
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((s) => (
                <article key={s.n} className="flex flex-col gap-3">
                  <div className="service-number text-white">{s.n}</div>
                  <h2 className="text-white text-sm tracking-widest uppercase font-semibold">
                    {s.title}
                  </h2>
                  <p className="text-white/55 text-[13px] leading-relaxed">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
