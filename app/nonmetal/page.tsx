'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppImage as Image } from '@/components/AppImage';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';
import { PriceTag } from '@/components/PriceTag';
import { PRODUCTS } from '@/lib/products';
import { withBasePath } from '@/lib/basePath';

export default function NonmetalPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices()
      .then(setPrices)
      .finally(() => setLoading(false));
  }, []);

  // レンダリング後にURLハッシュへスクロール（stickyヘッダー高さ分オフセット）
  useEffect(() => {
    if (loading) return;
    const hash = window.location.hash;
    if (!hash) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash.slice(1));
      if (!el) return;
      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }, [loading]);

  function findPrice(productName: string) {
    return prices.find((p) => p.subcategory === productName);
  }

  // 表示する商品：スプレッドシートに該当行があり、かつ「非表示」フラグが立っていないもの
  const visibleProducts = PRODUCTS.filter((p) => {
    const row = prices.find((pr) => pr.subcategory === p.name);
    return row !== undefined && !row.hidden;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1
        className="text-4xl md:text-5xl font-black mb-8 text-center"
        style={{
          color: '#111111',
          WebkitTextStroke: '3.5px #FACC15',
          paintOrder: 'stroke fill',
          fontFamily: 'var(--font-noto-sans-jp), "Hiragino Sans", "Yu Gothic", sans-serif',
        }}
      >
        非鉄金属買取
      </h1>
      {/* ヘッダー画像 */}
      <div className="mb-6 max-w-5xl mx-auto">
        <Image
          src="/images/company-exterior.jpg"
          alt="非鉄金属買取"
          width={800}
          height={225}
          className="rounded-none w-full h-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* 左サイドバー */}
        <aside>
          <NonmetalSidebar current="" />
        </aside>

        {/* メイン: 全商品一覧 */}
        <div>
          {loading && (
            <p className="text-gray-400 animate-pulse text-center py-12">買取価格を読み込み中...</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {visibleProducts.map((product) => {
              const price = findPrice(product.name);
              return (
                <Link
                  key={product.id}
                  id={product.id}
                  href={`/nonmetal/${product.id}`}
                  className="flex flex-col h-72 bg-white rounded-none shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03] scroll-mt-32 border-2 border-brand"
                >
                  {/* 写真エリア（7） */}
                  <div className="relative overflow-hidden flex-[7] min-h-0">
                    {product.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={withBasePath(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={withBasePath('/images/Logo.jpg')}
                          alt="プラ・リサイクル"
                          className="h-20 w-20 rounded-full opacity-50"
                        />
                      </div>
                    )}
                    {price?.direction === 'UP' && <UpBadge size="lg" />}
                  </div>
                  {/* 文字エリア（3） */}
                  <div className="p-2 text-center flex-[3] min-h-0 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{product.name}</h3>
                    <div>
                      <PriceTag price={price} loading={loading} size="md" />
                    </div>
                    {/* 商品説明文は非表示 */}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
