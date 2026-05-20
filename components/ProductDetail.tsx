'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';
import { withBasePath } from '@/lib/basePath';
import { UpBadge } from '@/components/UpBadge';
import type { Product } from '@/lib/products';
import { PRODUCT_NOTES } from '@/lib/productNotes';

export function ProductDetail({ product }: { product: Product }) {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices()
      .then(setPrices)
      .finally(() => setLoading(false));
  }, []);

  const price = prices.find((p) => p.subcategory === product.name);
  const notes = PRODUCT_NOTES[product.id];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* パンくず */}
      <div className="mb-4 text-sm">
        <Link href="/nonmetal" className="text-brand-dark hover:underline">
          ← 買取価格一覧へ戻る
        </Link>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b-2 border-brand pb-3 text-center">
        {product.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 画像 */}
        <div className="relative border-2 border-brand bg-white overflow-hidden">
          {product.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={withBasePath(product.image)}
              alt={product.name}
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBasePath('/images/Logo.jpg')}
                alt="プラ・リサイクル"
                className="h-24 w-24 rounded-full opacity-50"
              />
            </div>
          )}
          {price?.direction === 'UP' && <UpBadge size="lg" />}
        </div>

        {/* 価格 */}
        <div className="border-2 border-gray-200 bg-white p-6 flex flex-col justify-center text-center">
          <p className="text-sm text-gray-600 mb-2">買取価格</p>
          {product.priceLines ? (
            <div className="leading-tight">
              {product.priceLines.map((line) => (
                <p key={line} className="text-2xl md:text-3xl font-bold text-red-600">{line}</p>
              ))}
            </div>
          ) : loading ? (
            <span className="text-gray-400">読み込み中...</span>
          ) : price?.price === '要問合せ' ? (
            <span className="text-2xl font-bold text-orange-500">要問合せ</span>
          ) : price ? (
            <p>
              <span className="text-4xl font-bold text-red-600">
                {Number(price.price).toLocaleString()}
              </span>
              <span className="text-base text-gray-600 ml-1">
                円/{price.unit?.replace('円/', '') || 'kg'}（税込）
              </span>
            </p>
          ) : (
            <span className="text-gray-400">価格未設定</span>
          )}
          <p className="text-xs text-gray-400 mt-3">
            ※相場により変動します。最新価格はお問い合わせください。
          </p>
        </div>
      </div>

      {/* 詳細・注意事項 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-brand-dark mb-3 border-b-2 border-brand pb-2">
          商品の詳細・注意事項
        </h2>
        <div className="bg-white border border-gray-200 p-6 space-y-3">
          {product.desc && (
            <p className="text-base text-gray-800 font-bold leading-relaxed">{product.desc}</p>
          )}
          {notes && (
            <ol className="list-decimal pl-5 space-y-2 text-base text-gray-700 leading-relaxed">
              {notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ol>
          )}
          {price?.note && (
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {price.note}
            </p>
          )}
          {!product.desc && !notes && !price?.note && (
            <p className="text-gray-500">
              詳細は準備中です。お気軽にお問い合わせください。
            </p>
          )}
        </div>
      </section>

      {/* 買取の流れ（買取の案内ページへ誘導） */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-brand-dark mb-3 border-b-2 border-brand pb-2">
          買取の流れ
        </h2>
        <div className="bg-white border border-gray-200 p-6 text-center">
          <p className="text-gray-700 mb-4">買取方法・買取の流れについては「買取の案内」をご覧ください。</p>
          <Link
            href="/businessinfo#kaitori-houhou"
            className="inline-block px-8 py-3 text-white font-bold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--c-brand-phone)' }}
          >
            買取方法についてはこちら
          </Link>
        </div>
      </section>

      {/* お問い合わせ */}
      <section className="bg-brand p-6 text-center text-gray-800">
        <p className="text-sm mb-1">お問い合わせはこちら</p>
        <a href="tel:048-483-6687" className="block font-black text-3xl hover:underline leading-tight">
          TEL: 048-483-6687
        </a>
        <a href="tel:0120-472-872" className="block font-bold text-xl mt-1 hover:underline">
          フリーダイヤル: 0120-472-872
        </a>
        <p className="text-xs text-gray-700 mt-2">営業時間 AM8:30〜PM7:00 / 年中無休</p>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/nonmetal"
          className="inline-block px-8 py-3 text-white font-bold"
          style={{ backgroundColor: '#5a8a30' }}
        >
          買取価格一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
