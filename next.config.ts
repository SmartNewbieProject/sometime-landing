import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2riz12x19cmzu.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "dtdm4q9j639e3.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
