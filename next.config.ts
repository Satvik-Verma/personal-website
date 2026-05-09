import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apple App Site Association — must be served as application/json
        // for iOS Universal Links to validate.
        // Used by Save My Money's Plaid OAuth redirect flow.
        source: "/.well-known/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
