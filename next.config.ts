import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      { source: "/english", destination: "/en", permanent: true },
      { source: "/portugu%C3%AAs", destination: "/pt", permanent: true },
      { source: "/fran%C3%A7ais", destination: "/fr", permanent: true },
      { source: "/our-team", destination: "/en/consultants", permanent: true },
      { source: "/book-a-consultation", destination: "/en/find-a-consultant", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
