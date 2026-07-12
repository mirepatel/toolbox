import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Tool thumbnails / previews can be swapped for real domains as tools land.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.qrserver.com" }],
  },
};

export default nextConfig;
