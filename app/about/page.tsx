import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-3 sm:px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="glass-card">
          <SiteHeader />
          <div className="px-5 md:px-12 pb-12 md:pb-16 pt-8 md:pt-10">
            <h1 className="hero-mega-title text-white mb-8">ABOUT</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  Architect Silas is an independent design studio building modern,
                  light-filled spaces — homes, hospitality, and commercial work
                  rooted in a clear sense of place.
                </p>
                <p className="text-white/60 leading-relaxed">
                  Every project begins with the same question: what does this site
                  want to be? From there we work through site planning, building
                  design, and the interior detail that shapes everyday life.
                </p>
              </div>
              <div className="space-y-6 text-white/75">
                <div>
                  <div className="text-xs tracking-widest uppercase text-white/45 mb-1">
                    Studio
                  </div>
                  <div>Bamenda, Cameroon</div>
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-white/45 mb-1">
                    Practice
                  </div>
                  <div>Residential · Commercial · Hospitality · Interiors</div>
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-white/45 mb-1">
                    Contact
                  </div>
                  <div>silaschah18@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
