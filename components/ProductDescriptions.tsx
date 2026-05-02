'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';
import { PRODUCTS } from '@/lib/products';

export function ProductDescriptions() {
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

  if (loading) {
    return <p className="text-gray-400 animate-pulse text-center py-8">商品説明を読み込み中...</p>;
  }

  return (
    <div className="space-y-4">
      {PRODUCTS.map((product) => {
        const price = prices.find((p) => p.subcategory === product.name);
        return (
          <div
            key={product.id}
            id={`desc-${product.id}`}
            className="bg-white rounded-lg shadow-sm p-5 scroll-mt-32"
          >
            <div className="flex justify-between items-start mb-2 gap-3">
              <h3 className="font-bold text-lg text-gray-800">
                {product.no}. {product.name}
              </h3>
              <Link
                href={`/nonmetal#${product.id}`}
                className="text-sm text-brand-dark hover:underline whitespace-nowrap font-bold shrink-0"
              >
                価格表 →
              </Link>
            </div>
            {price?.note ? (
              <p className="text-sm text-gray-700 leading-relaxed">{price.note}</p>
            ) : (
              <p className="text-sm text-gray-400">説明文未設定</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
