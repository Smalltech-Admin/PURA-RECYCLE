'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchPrices, filterByCategory, type PriceItem } from '@/lib/getPrices';

const CATEGORIES = [
  { href: '/nonmetal/dou', label: '銅', category: '銅', image: '/images/top-dou.gif', firstImage: '/images/0001goudou.gif' },
  { href: '/nonmetal/densen', label: '雑電線', category: '電線', image: '/images/top-sen.gif', firstImage: '/images/000ipponsen1.gif' },
  { href: '/nonmetal/battery', label: 'バッテリー', category: 'バッテリー', image: '/images/top-battery.gif', firstImage: '/images/000battery1.gif' },
  { href: '/nonmetal/shinchuu', label: '真鍮・砲金', category: '真鍮・砲金', image: '/images/top-shinchuu.gif', firstImage: '/images/000shinchuu1.gif' },
  { href: '/nonmetal/moter', label: 'モーター', category: 'モーター', image: '/images/top-moter.gif', firstImage: '/images/000moter1.gif' },
  { href: '/nonmetal/radieter', label: 'ラジエター', category: 'ラジエター', image: '/images/top-radieter.gif', firstImage: '/images/000radi1.gif' },
  { href: '/nonmetal/namari', label: '鉛', category: '鉛', image: '/images/top-nama.gif', firstImage: '/images/000namari1.gif' },
  { href: '/nonmetal/hoile', label: 'ホイール', category: 'ホイール', image: '/images/top-arh.gif', firstImage: '/images/000hoile1.gif' },
  { href: '/nonmetal/tokushu', label: '特殊金属', category: '特殊金属', image: '/images/top-tokushukin.gif', firstImage: '/images/000t-kin1.gif' },
  { href: '/nonmetal/other', label: 'ステンレス・その他', category: 'その他', image: '/images/top-stain.gif', firstImage: '/images/000stainless.gif' },
];

export default function NonmetalPage() {
  const [allItems, setAllItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices()
      .then(setAllItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-8">
        <Image
          src="/images/nonmetal001.png"
          alt="非鉄金属買取"
          width={800}
          height={300}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((cat) => {
          const firstItem = filterByCategory(allItems, cat.category)[0];
          const priceNum = firstItem && !isNaN(Number(firstItem.price))
            ? Number(firstItem.price).toLocaleString()
            : null;
          const unitStr = firstItem?.unit ? firstItem.unit.replace('円/', '') : 'kg';

          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="grid grid-cols-[3fr_2fr] gap-0 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
            >
              {/* 左: カテゴリ画像 */}
              <div className="relative">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={500}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 右: 1つ目の商品写真 + 名前 + 価格 */}
              <div className="bg-white flex flex-col items-center justify-center p-2">
                <Image
                  src={cat.firstImage}
                  alt={firstItem?.subcategory ?? cat.label}
                  width={300}
                  height={200}
                  className="w-full h-auto max-h-[140px] object-contain mb-2"
                />
                {firstItem && (
                  <p className="text-sm font-bold text-gray-800 mb-1">{firstItem.subcategory}</p>
                )}
                <div>
                  {!firstItem || loading ? (
                    <span className="text-xl text-gray-400">...</span>
                  ) : firstItem.price === '要問合せ' ? (
                    <span className="text-lg font-bold text-orange-500">要問合せ</span>
                  ) : priceNum ? (
                    <>
                      <span className="text-2xl md:text-3xl font-bold text-red-600">{priceNum}</span>
                      <span className="text-xs text-gray-600 ml-1">円/{unitStr}（税込）</span>
                    </>
                  ) : (
                    <span className="text-lg text-gray-500">{firstItem.price}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">詳細を見る →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
