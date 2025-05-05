import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ez-staging.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dev.eazyconnections.ai",
      },
      {
        protocol: "https",
        hostname: "scontent.flhe6-1.fna.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
