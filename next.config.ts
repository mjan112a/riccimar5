import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable server-side rendering for pages that use PDF rendering
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
