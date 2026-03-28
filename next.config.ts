import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGitHubPages ? '/PURA-RECYCLE' : '',
  assetPrefix: isGitHubPages ? '/PURA-RECYCLE/' : '',
};

export default nextConfig;
