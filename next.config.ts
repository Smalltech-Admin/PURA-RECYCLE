import type { NextConfig } from "next";

// 公開先に応じた basePath。
// - ローカル開発                                        : ''
// - GitHub Pages のサブパス公開 (/PURA-RECYCLE/)        : '/PURA-RECYCLE'
// - 独自ドメイン公開 (https://pura-recycle.com/)        : ''
//
// GITHUB_ACTIONS は Actions 上で常に true になるため、それだけでは
// 独自ドメインへ切り替えられない。移管時は deploy.yml の env に
// SITE_BASE_PATH: '' を足すこと（この1箇所だけで全ページ・全画像が切り替わる）。
const basePath =
  process.env.SITE_BASE_PATH !== undefined
    ? process.env.SITE_BASE_PATH
    : process.env.GITHUB_ACTIONS === 'true'
      ? '/PURA-RECYCLE'
      : '';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
