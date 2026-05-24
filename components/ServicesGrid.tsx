import Image from "next/image";
import { cldImage } from "@/lib/cloudinary-url";
import { adaptiveGridCols } from "@/lib/grid";
import type { ProjectService } from "@/lib/types";

/**
 * GLASSHAVEN "OUR SERVICES" card.
 *
 * - 1 service  -> wide side-by-side feature card (image left, text right)
 * - 2+ services -> adaptive grid that scales with the count
 */
export default function ServicesGrid({ services }: { services: ProjectService[] }) {
  if (!services || services.length === 0) return null;

  // Single-service: render as a wide horizontal feature card.
  if (services.length === 1) {
    const s = services[0];
    return (
      <section className="glass-card p-5 md:p-12">
        <h2 className="section-title text-white mb-6 md:mb-10">OUR SERVICES</h2>
        <article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-800">
            {s.image_url && (
              <Image
                src={cldImage(s.image_url, 1200)!}
                alt={s.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="space-y-4 md:space-y-6">
            <div className="service-number text-white">
              {String(s.service_number).padStart(2, "0")}
            </div>
            <h3 className="text-white text-xl md:text-2xl tracking-widest uppercase font-semibold">
              {s.title}
            </h3>
            {s.description && (
              <p className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {s.description}
              </p>
            )}
          </div>
        </article>
      </section>
    );
  }

  // 2+ services: standard adaptive grid.
  return (
    <section className="glass-card p-5 md:p-12">
      <h2 className="section-title text-white mb-6 md:mb-12">OUR SERVICES</h2>
      <div className={`grid gap-5 md:gap-6 ${adaptiveGridCols(services.length)}`}>
        {services.map((s) => (
          <article key={s.id} className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-800">
              {s.image_url && (
                <Image
                  src={cldImage(s.image_url, 800)!}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="service-number text-white">
              {String(s.service_number).padStart(2, "0")}
            </div>
            <h3 className="text-white text-sm tracking-widest uppercase font-semibold">
              {s.title}
            </h3>
            {s.description && (
              <p className="text-white/55 text-[13px] leading-relaxed whitespace-pre-wrap">
                {s.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
