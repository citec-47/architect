import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-3 sm:px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="glass-card">
          <SiteHeader />
          <div className="px-5 md:px-12 pb-12 md:pb-16 pt-8 md:pt-10">
            <h1 className="hero-mega-title text-white mb-2">CONTACT</h1>
            <p className="text-white/60 text-sm tracking-widest uppercase mb-10">
              Tell us about your project
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />
              <div className="text-white/75 space-y-6 self-start">
                <div>
                  <div className="text-xs tracking-widest uppercase text-white/45 mb-1">
                    Email
                  </div>
                  <div>studio@architectsilas.com</div>
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-white/45 mb-1">
                    Studio
                  </div>
                  <div>Bamenda, Cameroon</div>
                </div>
                <p className="text-white/55 text-sm leading-relaxed pt-4 border-t border-white/10">
                  We respond to new project enquiries within two business days.
                </p>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
