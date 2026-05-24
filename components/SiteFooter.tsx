import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="px-6 md:px-12 py-10 mt-12 text-white/60 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-white text-lg tracking-tight">
          ARCHITECT SILAS
        </div>
        <div className="flex gap-6 text-xs tracking-widest">
          <Link href="/about" className="hover:text-white">ABOUT</Link>
          <Link href="/contact" className="hover:text-white">CONTACT</Link>
          <Link href="/login" className="hover:text-white">ADMIN</Link>
        </div>
        <div className="text-xs tracking-widest">
          &copy; {new Date().getFullYear()} STUDIO SILAS
        </div>
      </div>
    </footer>
  );
}
