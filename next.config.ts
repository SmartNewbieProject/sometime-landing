import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/indexnow/:key.txt",
          destination: "https://api.some-in-univ.com/api/indexnow/:key.txt",
        },
        // 백엔드 shareUrl 버그(solo-nestjs-api tarot.service.ts)로 이미 배포된 구링크 호환.
        // 이 레포엔 /tarot 페이지 자체가 없고, 실제 SSR은 api.some-in-univ.com/web/tarot/:slug 가 서빙.
        {
          source: "/web/tarot/:slug",
          destination: "https://api.some-in-univ.com/web/tarot/:slug",
        },
        {
          source: "/web/jp/tarot/:slug",
          destination: "https://api.some-in-univ.com/web/jp/tarot/:slug",
        },
      ],
    };
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2riz12x19cmzu.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dtdm4q9j639e3.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
