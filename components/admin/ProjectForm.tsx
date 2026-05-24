"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject, type ProjectInput } from "@/app/admin/actions";
import { SingleImagePicker, GalleryPicker, type UploadedAsset } from "./MediaPicker";
import type { ProjectDetail } from "@/lib/types";

type ServiceRow = {
  service_number: number;
  title: string;
  description: string;
  image_url: string | null;
  image_public_id: string | null;
};

type RoomRow = {
  room_name: string;
  area_sqm: string;
};

function toServiceRows(p?: ProjectDetail): ServiceRow[] {
  if (!p) return [];
  return p.services.map((s) => ({
    service_number: s.service_number,
    title: s.title,
    description: s.description ?? "",
    image_url: s.image_url,
    image_public_id: s.image_public_id,
  }));
}

function toRoomRows(p?: ProjectDetail): RoomRow[] {
  if (!p) return [];
  return p.rooms.map((r) => ({
    room_name: r.room_name,
    area_sqm: r.area_sqm != null ? String(r.area_sqm) : "",
  }));
}

function toGalleryAssets(p?: ProjectDetail): UploadedAsset[] {
  if (!p) return [];
  return p.media.map((m) => ({
    url: m.url,
    public_id: m.cloudinary_public_id ?? m.url,
    resource_type: m.media_type,
  }));
}

export default function ProjectForm({ initial }: { initial?: ProjectDetail }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Residential");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  // New projects default to draft so the admin can fill everything out before going live.
  const [published, setPublished] = useState(initial?.published ?? false);

  const [heroUrl, setHeroUrl] = useState<string | null>(initial?.hero_image_url ?? null);
  const [heroPid, setHeroPid] = useState<string | null>(initial?.hero_image_public_id ?? null);

  const [planUrl, setPlanUrl] = useState<string | null>(initial?.floor_plan_image_url ?? null);
  const [planPid, setPlanPid] = useState<string | null>(initial?.floor_plan_public_id ?? null);

  const [totalArea, setTotalArea] = useState(
    initial?.total_area_sqm != null ? String(initial.total_area_sqm) : ""
  );
  const [watermark, setWatermark] = useState(initial?.watermark_handle ?? "");

  const [services, setServices] = useState<ServiceRow[]>(toServiceRows(initial));
  const [rooms, setRooms] = useState<RoomRow[]>(toRoomRows(initial));
  const [gallery, setGallery] = useState<UploadedAsset[]>(toGalleryAssets(initial));

  function addService() {
    setServices((cur) => [
      ...cur,
      {
        service_number: cur.length + 1,
        title: "",
        description: "",
        image_url: null,
        image_public_id: null,
      },
    ]);
  }
  function updateService(idx: number, patch: Partial<ServiceRow>) {
    setServices((cur) => cur.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }
  function removeService(idx: number) {
    setServices((cur) => cur.filter((_, i) => i !== idx));
  }

  function addRoom() {
    setRooms((cur) => [...cur, { room_name: "", area_sqm: "" }]);
  }
  function updateRoom(idx: number, patch: Partial<RoomRow>) {
    setRooms((cur) => cur.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }
  function removeRoom(idx: number) {
    setRooms((cur) => cur.filter((_, i) => i !== idx));
  }

  function buildInput(asPublished: boolean): ProjectInput | null {
    if (!title.trim()) {
      setError("Title is required");
      return null;
    }
    return {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      location: location.trim() || null,
      description: description.trim() || null,
      category: category.trim() || null,
      featured,
      published: asPublished,
      hero_image_url: heroUrl,
      hero_image_public_id: heroPid,
      floor_plan_image_url: planUrl,
      floor_plan_public_id: planPid,
      total_area_sqm: totalArea ? Number(totalArea) : null,
      watermark_handle: watermark.trim() || null,
      services: services
        .filter((s) => s.title.trim())
        .map((s, i) => ({
          service_number: s.service_number || i + 1,
          title: s.title.trim(),
          description: s.description.trim() || null,
          image_url: s.image_url,
          image_public_id: s.image_public_id,
        })),
      rooms: rooms
        .filter((r) => r.room_name.trim())
        .map((r) => ({
          room_name: r.room_name.trim(),
          area_sqm: r.area_sqm ? Number(r.area_sqm) : null,
        })),
      media: gallery.map((g) => ({
        media_type: g.resource_type,
        url: g.url,
        cloudinary_public_id: g.public_id,
        caption: null,
      })),
    };
  }

  function save(asPublished: boolean) {
    setError(null);
    setSuccess(null);
    const input = buildInput(asPublished);
    if (!input) return;
    setPublished(asPublished);
    const mediaCount = input.media.length;
    startTransition(async () => {
      try {
        if (initial) {
          await updateProject(initial.id, input);
          setSuccess(
            asPublished
              ? `Published. ${mediaCount} gallery item${mediaCount === 1 ? "" : "s"} saved.`
              : `Saved as draft. ${mediaCount} gallery item${mediaCount === 1 ? "" : "s"} saved.`
          );
          router.refresh();
        } else {
          await createProject(input);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {initial && (
        <section className="glass-card p-4 md:p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                published ? "bg-green-400" : "bg-amber-300"
              }`}
            />
            <span className="text-white text-sm tracking-widest uppercase">
              {published ? "Live on site" : "Draft (hidden)"}
            </span>
          </div>
          <div className="text-xs text-white/45">
            Last updated {new Date(initial.updated_at).toLocaleString()}
          </div>
        </section>
      )}

      {/* Basics */}
      <section className="glass-card p-6 md:p-10 space-y-4">
        <h2 className="text-white font-display text-xl mb-2">Project basics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title (the big GLASSHAVEN-style name)">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="GLASSHAVEN" />
          </Field>
          <Field label="Subtitle (tagline shown under the title)">
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="A NEW STANDARD OF MODERN LIVING" />
          </Field>
          <Field label="Location">
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="BAMENDA, CAMEROON" />
          </Field>
          <Field label="Category">
            <select aria-label="Project category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Hospitality</option>
              <option>Interior</option>
              <option>Public</option>
            </select>
          </Field>
        </div>

        <Field label="Description (shown above OUR SERVICES)">
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short narrative about the building..."
          />
        </Field>

        <label className="flex items-center gap-3 text-white/80 text-sm pt-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-auto"
          />
          Featured — pin to the top of the homepage as the big hero
        </label>
      </section>

      {/* Hero image */}
      <section className="glass-card p-6 md:p-10 space-y-4">
        <h2 className="text-white font-display text-xl mb-2">Hero image</h2>
        <p className="text-white/55 text-sm">
          The full-bleed image behind the big project name on the homepage card and detail page.
        </p>
        <SingleImagePicker
          label="Hero"
          value={heroUrl}
          publicId={heroPid}
          onChange={(u, p) => {
            setHeroUrl(u);
            setHeroPid(p);
          }}
        />
      </section>

      {/* Services */}
      <section className="glass-card p-6 md:p-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-display text-xl">Services (the 01 / 02 / 03 / 04 grid)</h2>
          <button
            type="button"
            onClick={addService}
            className="px-4 py-2 border border-white/30 text-white rounded-full text-xs tracking-widest uppercase hover:bg-white/10"
          >
            + Add Service
          </button>
        </div>

        {services.length === 0 && (
          <p className="text-white/45 text-sm">No services yet — add four to match the reference design.</p>
        )}

        {services.map((s, idx) => (
          <div key={idx} className="border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-white/55 text-xs tracking-widest uppercase">
                Service {String(idx + 1).padStart(2, "0")}
              </div>
              <button
                type="button"
                onClick={() => removeService(idx)}
                className="text-red-300 text-xs tracking-widest uppercase"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Number">
                <input
                  type="number"
                  min={1}
                  value={s.service_number}
                  onChange={(e) =>
                    updateService(idx, { service_number: Number(e.target.value) || idx + 1 })
                  }
                />
              </Field>
              <Field label="Title" className="md:col-span-2">
                <input
                  value={s.title}
                  onChange={(e) => updateService(idx, { title: e.target.value })}
                  placeholder="PROPERTY SHOWCASE"
                />
              </Field>
            </div>
            <Field label="Short description">
              <textarea
                rows={2}
                value={s.description}
                onChange={(e) => updateService(idx, { description: e.target.value })}
              />
            </Field>
            <SingleImagePicker
              label="Service image"
              value={s.image_url}
              publicId={s.image_public_id}
              onChange={(u, p) => updateService(idx, { image_url: u, image_public_id: p })}
            />
          </div>
        ))}
      </section>

      {/* House plan + rooms */}
      <section className="glass-card p-6 md:p-10 space-y-4">
        <h2 className="text-white font-display text-xl">House plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Total area (m²)">
            <input
              type="number"
              step="0.1"
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="92"
            />
          </Field>
          <Field label="Watermark on plan (eg. @glasshaven)">
            <input
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              placeholder="@glasshaven"
            />
          </Field>
        </div>

        <SingleImagePicker
          label="Floor plan image"
          value={planUrl}
          publicId={planPid}
          onChange={(u, p) => {
            setPlanUrl(u);
            setPlanPid(p);
          }}
        />

        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white/80 text-sm tracking-widest uppercase">Rooms</h3>
            <button
              type="button"
              onClick={addRoom}
              className="px-4 py-2 border border-white/30 text-white rounded-full text-xs tracking-widest uppercase hover:bg-white/10"
            >
              + Add Room
            </button>
          </div>
          {rooms.length === 0 && (
            <p className="text-white/45 text-sm">No rooms yet — add Living Room, Dining Room, etc.</p>
          )}
          {rooms.map((r, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-7">
                <input
                  aria-label="Room name"
                  value={r.room_name}
                  onChange={(e) => updateRoom(idx, { room_name: e.target.value })}
                  placeholder="Living Room"
                />
              </div>
              <div className="col-span-3">
                <input
                  aria-label="Room area in square metres"
                  type="number"
                  step="0.1"
                  value={r.area_sqm}
                  onChange={(e) => updateRoom(idx, { area_sqm: e.target.value })}
                  placeholder="m²"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => removeRoom(idx)}
                  className="w-full px-3 py-2 text-red-300 border border-white/10 rounded-md text-xs tracking-widest uppercase hover:bg-white/5"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="glass-card p-6 md:p-10 space-y-4">
        <h2 className="text-white font-display text-xl">Gallery (extra images & videos)</h2>
        <p className="text-white/55 text-sm">
          Drop in additional renders, on-site photos, or walk-through videos.
        </p>
        <GalleryPicker items={gallery} onChange={setGallery} />
      </section>

      {/* Submit */}
      <section className="glass-card p-5 md:p-6 sticky bottom-3 z-10 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => save(true)}
            disabled={pending}
            className="w-full sm:w-auto px-8 py-3 bg-white text-slate-900 font-semibold tracking-widest text-xs uppercase rounded-full disabled:opacity-50 hover:bg-white/90"
          >
            {pending ? "Working..." : initial ? (published ? "Update & Republish" : "Publish Project") : "Publish Project"}
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={pending}
            className="w-full sm:w-auto px-6 py-3 border border-white/30 text-white tracking-widest text-xs uppercase rounded-full hover:bg-white/10 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="w-full sm:w-auto sm:ml-auto px-6 py-3 text-white/70 tracking-widest text-xs uppercase hover:text-white"
          >
            Cancel
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-500/15 border border-red-500/40 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-3 p-3 bg-green-500/15 border border-green-500/40 rounded-lg">
            <p className="text-green-300 text-sm">✓ {success}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  // Wrapping children inside <label> creates an implicit input<->label
  // association — no need for htmlFor/id pairs on every input, and the
  // a11y linter stops complaining about "form element has no label".
  return (
    <label className={`block ${className}`}>
      <span className="text-xs tracking-widest uppercase text-white/45 block mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
