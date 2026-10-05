import type { NextConfig } from "next";

// basePath は CI では必ず GitHub Pages の設定そのもの（configure-pages の
// base_path）から受け取る。サブパス公開なら "/PURA-RECYCLE"、
// カスタムドメインなら空文字が渡る。
//
// CI で未設定なら推測せずに落とす。以前はここで GITHUB_ACTIONS を見て
// "/PURA-RECYCLE" を補っていたが、その分岐が発動するのは
// 「カスタムドメインへ移管したのに空文字が届かなかったとき」だけで、
// しかもビルドは成功してしまう（全アセットが /PURA-RECYCLE/_next/... を指す
// 壊れたサイトが公開される）。落とせば前回の公開物が残る。
const inCI = process.env.GITHUB_ACTIONS === 'true';
const rawBasePath = process.env.SITE_BASE_PATH;

if (inCI && rawBasePath === undefined) {
  throw new Error(
    'CI では SITE_BASE_PATH（actions/configure-pages の base_path）を必ず渡すこと。推測しない。'
  );
}

const basePath = rawBasePath ?? '';

// どちらの basePath でビルドしたかをデプロイログに残す。
// 移管時の取り違えを後から判別できるようにするため。
console.log('[next.config] basePath =', JSON.stringify(basePath));

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
