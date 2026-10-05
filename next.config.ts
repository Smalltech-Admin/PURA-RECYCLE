import type { NextConfig } from "next";

// 公開先に応じた basePath。
// - ローカル開発                                        : ''
// - GitHub Pages のサブパス公開 (/PURA-RECYCLE/)        : '/PURA-RECYCLE'
// - 独自ドメイン公開 (https://pura-recycle.com/)        : ''
//
// GITHUB_ACTIONS は Actions 上で常に true になるため、それだけでは
// 独自ドメインへ切り替えられない。移管時は deploy.yml の env に
// SITE_BASE_PATH: '' を足す。これでページ・画像・建値JSONの参照先は切り替わるが、
// 他にも変更が要る（robots / sitemap / Pages のカスタムドメイン / DNS）。
// 手順は docs/ドメイン移管手順.md を参照すること。
//
// 不正な値（先頭が / でない等）はビルドが落ちるので黙って公開されることはない。
// ただし空文字が undefined に化けると GITHUB_ACTIONS 側に落ちてビルドは通るため、
// 採用した値をログに出して確かめられるようにしている。
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

// どちらの basePath でビルドしたかをデプロイログに残す。
// 移管時の取り違え（/PURA-RECYCLE 付きの成果物を独自ドメイン直下に置く）を
// ログから判別できるようにするため。
console.log('[next.config] basePath =', JSON.stringify(basePath));

export default nextConfig;
