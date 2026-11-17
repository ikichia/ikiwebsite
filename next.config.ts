import type { NextConfig } from "next";

import { studioDataset, studioProjectId, validateSanityConfig } from "./src/sanity/settings";

validateSanityConfig(studioProjectId, studioDataset, process.env.VERCEL_ENV, process.env.VERCEL);

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/properties", destination: "/en/properties", permanent: false },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
  },
  turbopack: {
    rules: {
      "src/app/globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
