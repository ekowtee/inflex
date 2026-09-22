import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://inflexions.tech https://www.google-analytics.com https://www.googletagmanager.com;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://challenges.cloudflare.com https://www.google.com;
  connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where the browser accepts it, WebP otherwise. The sources
    // in public/ are already WebP; this is the optimizer's output format.
    formats: ["image/avif", "image/webp"],
    // Next's defaults generate eight srcset candidates per responsive image.
    // On a page with 49 images that is a lot of markup for the preload
    // scanner to walk before first paint, and this site has no 4K artwork to
    // serve. Four device widths and three fixed sizes cover every layout the
    // design uses.
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [96, 180, 240],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
