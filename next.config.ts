import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
};

export default nextConfig;
