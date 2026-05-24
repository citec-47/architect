"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/#projects", label: "PROJECTS" },
  { href: "/services", label: "SERVICES" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/contact", label: "CONTACTS" },
];

/**
 * Site nav. Inline on desktop, hamburger -> full-screen overlay on mobile.
 * `overlay` mode pins it absolute over a dark hero (used on home + project detail).
 */
export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <header
      className={
        overlay
          ? "absolute top-0 left-0 right-0 z-20 px-4 md:px-8 py-4 md:py-6"
          : "px-4 md:px-8 py-4 md:py-6 bg-[var(--bg-card)]"
      }
    >
      <div className="flex items-center justify-between md:justify-end gap-6">
        {/* Mobile-only studio mark, so the bar isn't empty next to the burger */}
        <Link
          href="/"
          className="md:hidden font-display text-white text-base tracking-tight"
          aria-label="Home"
        >
          ARCHITECT
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] tracking-[0.25em] text-white/90">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="md:hidden p-2 text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-[var(--bg-card)] flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <Link href="/" className="font-display text-white text-lg tracking-tight" onClick={() => setOpen(false)}>
              ARCHITECT
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2 text-white"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 flex flex-col px-6 py-10 gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-white text-2xl font-display tracking-wide py-3 border-b border-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-auto text-white/55 text-xs tracking-widest uppercase py-4 text-center border border-white/15 rounded-full"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
