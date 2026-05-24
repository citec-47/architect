import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-12 text-center max-w-md">
        <h1 className="hero-mega-title text-white mb-4">404</h1>
        <p className="text-white/70 mb-8">We couldn't find that page.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
