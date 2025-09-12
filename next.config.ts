import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    // Allow large multipart/form-data uploads (covers, product images)
    bodySizeLimit: "20mb",
  },
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  // Increase API route body size limit
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default nextConfig;
