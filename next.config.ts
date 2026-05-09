import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Apple iOS Universal Links require the AASA file to be served at exactly
  // /.well-known/apple-app-site-association with Content-Type: application/json
  // and NO redirects. Next.js's `public/` directory excludes dotfile dirs from
  // its static asset serving, so we ship the file as a normal JSON path and
  // rewrite the canonical .well-known URL to it.
  // Used by Save My Money's Plaid OAuth redirect flow.
  async rewrites() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        destination: "/apple-app-site-association.json",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      },
      {
        source: "/apple-app-site-association.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      },
    ];
  },
};

export default nextConfig;
