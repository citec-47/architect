/**
 * Inject Cloudinary delivery transformations into an existing image URL.
 *
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/folder/file.jpg
 *     ->
 *   https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,c_limit,w_1600/v123/folder/file.jpg
 *
 * f_auto = best format the browser supports (AVIF > WebP > JPEG)
 * q_auto = smart per-image quality
 * c_limit = downscale only (never enlarge)
 *
 * Has no effect on non-Cloudinary URLs (returns the input unchanged).
 */
export function cldImage(url: string | null | undefined, maxWidth = 1600): string | undefined {
  if (!url) return undefined;
  if (!url.includes("/image/upload/")) return url;
  if (url.includes("f_auto") || url.includes("q_auto")) return url;
  const transform = `f_auto,q_auto,c_limit,w_${maxWidth}`;
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}

/** Same idea for video posters. */
export function cldVideoPoster(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (!url.includes("/video/upload/")) return url;
  return url
    .replace("/video/upload/", "/video/upload/so_0,c_fill,w_1280,h_720,q_auto,f_auto/")
    .replace(/\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i, ".jpg");
}
