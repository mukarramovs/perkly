import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub pages uses repository name as base path if not a custom domain
  basePath: '/perkly',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
