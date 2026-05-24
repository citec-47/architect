import Image from "next/image";
import { cldImage } from "@/lib/cloudinary-url";
import { adaptiveGridCols } from "@/lib/grid";
import type { ProjectService } from "@/lib/types";

/**
 * GLASSHAVEN "OUR SERVICES" card with the numbered 01/02/03/04 grid.
 */
export default function ServicesGrid({ services }: { services: ProjectService[] }) {
  if (!services || services.length === 0) return null;

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
              <p className="text-white/55 text-[13px] leading-relaxed">
                {s.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
