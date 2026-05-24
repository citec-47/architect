"use client";

import { useState } from "react";

export type UploadedAsset = {
  url: string;
  public_id: string;
  resource_type: "image" | "video";
};

async function uploadFiles(
  files: FileList,
  onProgress?: (done: number, total: number) => void
): Promise<UploadedAsset[]> {
  const total = files.length;
  const results: UploadedAsset[] = [];

  // Upload sequentially so progress is meaningful and we don't trip Vercel
  // body-size or concurrent-stream limits with multiple large videos.
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const form = new FormData();
    form.append("files", f);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(
        `Upload failed for "${f.name}": ${data.message ?? res.statusText}`
      );
    }
    const json = (await res.json()) as { files: UploadedAsset[] };
    results.push(...json.files);
    onProgress?.(i + 1, total);
  }
  return results;
}

/** Single-image picker (used for hero, floor plan, service image). */
export function SingleImagePicker({
  value,
  publicId,
  onChange,
  label,
}: {
  value: string | null;
  publicId: string | null;
  onChange: (url: string | null, publicId: string | null) => void;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadFiles(files);
      const [first] = uploaded;
      onChange(first.url, first.public_id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs tracking-widest uppercase text-white/45 block">{label}</label>
      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-48 object-cover rounded-xl border border-white/10" />
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="absolute top-2 right-2 px-3 py-1 bg-black/70 text-white text-xs tracking-widest uppercase rounded-full"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-white/20 rounded-xl p-6 text-center">
          <input
            aria-label={label}
            title={label}
            type="file"
            accept="image/*"
            onChange={onPick}
            disabled={busy}
            className="block w-full text-sm text-white/60 file:mr-4 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-white file:text-slate-900 file:text-xs file:tracking-widest file:uppercase file:font-semibold"
          />
          {busy && <p className="text-white/60 text-xs mt-3">Uploading to Cloudinary...</p>}
        </div>
      )}
      {error && <p className="text-red-300 text-sm">{error}</p>}
    </div>
  );
}

/** Multi-file picker for gallery (images + videos). */
export function GalleryPicker({
  items,
  onChange,
}: {
  items: UploadedAsset[];
  onChange: (next: UploadedAsset[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<number>(0);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    setLastAdded(0);
    try {
      const uploaded = await uploadFiles(files, (done, total) => {
        setProgress(`Uploading ${done} of ${total}...`);
      });
      onChange([...items, ...uploaded]);
      setLastAdded(uploaded.length);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
      e.target.value = "";
    }
  }

  function removeAt(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  const imageCount = items.filter((i) => i.resource_type === "image").length;
  const videoCount = items.filter((i) => i.resource_type === "video").length;

  return (
    <div className="space-y-3">
      <div className="border border-dashed border-white/20 rounded-xl p-4">
        <input
          aria-label="Gallery files"
          title="Gallery files"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={onPick}
          disabled={busy}
          className="block w-full text-sm text-white/60 file:mr-4 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-white file:text-slate-900 file:text-xs file:tracking-widest file:uppercase file:font-semibold"
        />
        {busy && <p className="text-amber-300 text-xs mt-2">{progress ?? "Uploading..."}</p>}
        {!busy && lastAdded > 0 && (
          <p className="text-green-300 text-xs mt-2">
            ✓ Added {lastAdded} file{lastAdded === 1 ? "" : "s"} to the gallery.
            <strong className="ml-1 text-white">Click Publish below to save.</strong>
          </p>
        )}
      </div>

      {items.length > 0 && (
        <div className="text-xs text-white/55 tracking-widest uppercase">
          {imageCount} image{imageCount === 1 ? "" : "s"} · {videoCount} video{videoCount === 1 ? "" : "s"}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <div
              key={`${item.public_id}-${idx}`}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-800 border border-white/10"
            >
              {item.resource_type === "video" ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cloudinaryPoster(item.url)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      // If the poster URL fails, hide the broken-image icon.
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                aria-label="Remove"
                className="absolute top-1 right-1 px-2 py-0.5 bg-black/80 text-white text-[10px] tracking-widest uppercase rounded-full"
              >
                ×
              </button>
              <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/80 text-white text-[10px] uppercase tracking-widest rounded">
                {item.resource_type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function cloudinaryPoster(videoUrl: string): string {
  if (!videoUrl.includes("/video/upload/")) return videoUrl;
  return videoUrl
    .replace("/video/upload/", "/video/upload/so_0,c_fill,w_640,h_480/")
    .replace(/\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i, ".jpg");
}
