import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
