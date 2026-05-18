'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppImage as Image } from '@/components/AppImage';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 border-b-2 border-brand pb-3 text-center">
        非鉄金属買取
      </h1>
      {/* ヘッダー画像 */}
      <div className="mb-6 max-w-5xl mx-auto">
        <Image
          src="/images/company-exterior.jpg"
          alt="非鉄金属買取"
          width={800}
          height={225}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* 左サイドバー */}
        <aside>
          <NonmetalSidebar current="" />
        </aside>

        {/* メイン: 全商品一覧 */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCTS.map((product) => {
              const price = findPrice(product.name);
              return (
                <Link
                  key={product.id}
                  id={product.id}
                  href="/businessinfo"
                  className="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03] scroll-mt-32 border-2 border-brand"
                >
                  <div className="relative overflow-hidden">
                    {product.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={withBasePath(product.image)}
                        alt={product.name}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
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
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{product.name}</h3>
                    <div>
                      {loading ? (
                        <span className="text-gray-400">...</span>
                      ) : price?.price === '要問合せ' ? (
                        <span className="text-lg font-bold text-orange-500">要問合せ</span>
                      ) : price ? (
                        <>
                          <span className="text-3xl font-bold text-red-600">{Number(price.price).toLocaleString()}</span>
                          <span className="text-sm text-gray-600 ml-1">円/{price.unit?.replace('円/', '') || 'kg'}（税込）</span>
                        </>
                      ) : (
                        <span className="text-gray-400">価格未設定</span>
                      )}
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
