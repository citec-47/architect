import Image from "next/image";
import Link from "next/link";
import SiteHeader from "./SiteHeader";
import { cldImage } from "@/lib/cloudinary-url";
import type { Project } from "@/lib/types";

/**
 * The big GLASSHAVEN-style hero card.
 *
 * When `asLink` is true, the card itself is clickable. In that mode we render
 * the SiteHeader nav as a sibling overlay (NOT inside the Link) so its nav
 * <Link>s aren't nested inside the card's <Link> — that nesting throws a
 * hydration error ("<a> cannot be a descendant of <a>").
 */
export default function ProjectHeroCard({
  project,
  asLink,
  height = "tall",
}: {
  project: Project;
  asLink?: boolean;
  height?: "tall" | "compact";
}) {
  const heightCls =
    height === "tall"
      ? "min-h-[70vh] md:min-h-[80vh]"
      : "min-h-[360px] sm:min-h-[420px] md:min-h-[520px]";

  const showNav = height === "tall";

  const card = (
    <div
      className={`relative ${heightCls} w-full overflow-hidden rounded-2xl md:rounded-3xl bg-[var(--bg-card)]`}
    >
      {project.hero_image_url ? (
        <Image
          src={cldImage(project.hero_image_url, 1920)!}
          alt={project.title}
          fill
          priority={height === "tall"}
          fetchPriority={height === "tall" ? "high" : "auto"}
          sizes="(max-width: 1024px) 100vw, 1280px"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />

      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-12 pt-20 md:pt-12">
        <div />
        <div>
          <h1 className="hero-mega-title text-white drop-shadow-lg break-words">
            {project.title}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 text-white text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mt-6">
          <div className="max-w-md leading-relaxed">{project.subtitle}</div>
          <div className="sm:text-right opacity-80">{project.location}</div>
        </div>
      </div>
    </div>
  );

  if (asLink) {
    // Nav sits ABOVE the Link via z-index, so nav clicks aren't intercepted
    // and there is no nested-anchor hydration error.
    return (
      <div className="relative group">
        <Link
          href={`/projects/${project.slug}`}
          className="block transition-transform duration-300 group-hover:scale-[1.005]"
          aria-label={`Open project ${project.title}`}
        >
          {card}
        </Link>
        {showNav && (
          <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
            <div className="pointer-events-auto">
              <SiteHeader overlay />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Non-link variant (used on the project detail page): nav lives inside,
  // no Link wrapper so no nesting issue.
  return (
    <div className="relative">
      {card}
      {showNav && (
        <div className="absolute top-0 left-0 right-0 z-30">
          <SiteHeader overlay />
        </div>
      )}
    </div>
  );
}
