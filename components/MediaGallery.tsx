import Image from "next/image";
import { cldImage, cldVideoPoster } from "@/lib/cloudinary-url";
import type { ProjectMedia } from "@/lib/types";

/**
 * Project gallery. Images render as a masonry-like grid;
 * videos get their own section with auto-poster thumbnails from Cloudinary
 * and inline playback on click.
 */
export default function MediaGallery({ media }: { media: ProjectMedia[] }) {
  if (!media || media.length === 0) return null;

  const images = media.filter((m) => m.media_type === "image");
  const videos = media.filter((m) => m.media_type === "video");

  return (
    <>
      {images.length > 0 && <ImagesSection images={images} />}
      {videos.length > 0 && <VideosSection videos={videos} />}
    </>
  );
}

function ImagesSection({ images }: { images: ProjectMedia[] }) {
  return (
    <section className="glass-card p-5 md:p-12">
      <SectionHeader number="0" title="GALLERY" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((item, idx) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-xl bg-slate-800 ${
              // Make every 5th image taller for a magazine-style rhythm
              idx % 5 === 0 ? "aspect-[3/4] row-span-2" : "aspect-square"
            }`}
          >
            <Image
              src={cldImage(item.url, 900)!}
              alt={item.caption ?? ""}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function VideosSection({ videos }: { videos: ProjectMedia[] }) {
  return (
    <section className="glass-card p-5 md:p-12">
      <SectionHeader number="0" title="VIDEOS" subtitle={`${videos.length} clip${videos.length === 1 ? "" : "s"}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {videos.map((v) => (
          <VideoPlayer key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}

function VideoPlayer({ video }: { video: ProjectMedia }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <video
        src={video.url}
        poster={cldVideoPoster(video.url)}
        controls
        preload="metadata"
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 md:mb-10">
      <div className="md:col-span-3">
        <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-2">
          {number}
        </div>
        <h2 className="font-display text-white text-2xl md:text-3xl tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <div className="md:col-span-9 self-end text-white/55 text-xs tracking-widest uppercase">
          {subtitle}
        </div>
      )}
    </div>
  );
}

