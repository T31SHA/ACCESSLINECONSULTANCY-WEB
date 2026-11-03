import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://plausible.io https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https://plausible.io https://*.r2.cloudflarestorage.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com https://cal.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1536, 1920],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: { optimizePackageImports: ["lucide-react"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Legacy WordPress slugs → new IA (301)
      { source: "/about-us", destination: "/about", statusCode: 301 },
      { source: "/our-services", destination: "/services", statusCode: 301 },
      { source: "/our-partners", destination: "/industries", statusCode: 301 },
      { source: "/gis-remote-sensing", destination: "/team", statusCode: 301 },
      { source: "/logistics-support", destination: "/careers", statusCode: 301 },
      // Close legacy WP surfaces (incl. the public users endpoint)
      { source: "/wp-json/:path*", destination: "/", statusCode: 301 },
      { source: "/wp-admin/:path*", destination: "/", statusCode: 301 },
      { source: "/wp-login.php", destination: "/", statusCode: 301 },
      { source: "/feed", destination: "/insights", statusCode: 301 },
      { source: "/:path*/feed", destination: "/insights", statusCode: 301 },
    ];
  },
};

export default nextConfig;
