import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't get confused by a stray
  // lockfile in a parent directory (eg. ~/package-lock.json).
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    // Auto-optimize all next/image renders to AVIF/WebP when supported.
    formats: ["image/avif", "image/webp"],
    // Cache optimized variants for 30 days (default is 60s).
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
