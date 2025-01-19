import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  matcher: ["*"],
};

export default nextConfig;
