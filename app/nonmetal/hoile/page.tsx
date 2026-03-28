'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { CategoryNav } from '@/components/CategoryNav';

const ITEMS = [
  { name: 'ホイール線（フル）', image: '/images/000hoile1.gif', desc: '自動車のアルミホイールです。アルミ以外の付物があるもの。空気弁やバランスウェイト等、付属品が残っている状態のもの。2ピース構造のものは減額になります。' },
  { name: 'ホイールPP（フル含）', image: '/images/000hoile2.gif', desc: '自動車のアルミホイールです。リム部とディスク部が一体となった、ワンピース構造のもの。全ての付属物を取り除き、アルミだけにしたもの。メッキ加工品は付物有りとしての取り扱いになります。' },
];

export default function HoilePage() {
  const { items, loading } = usePricesByCategory('ホイール線');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-700 pb-3">
        ホイールの買取
      </h1>

      <CategoryNav current="ホイール" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {ITEMS.map((item) => {
          const priceItem = items.find((p) => p.subcategory === item.name);
          return (
            <div key={item.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src={item.image} alt={item.name} width={400} height={300} className="w-full h-auto" />
              <div className="p-5 text-center">
                <h3 className="font-bold text-gray-800 text-xl mb-2">{item.name}</h3>
                <p className="text-green-700 font-bold text-2xl mb-3">
                    {loading ? '...' : priceItem?.price === '要問合せ' ? (
                      <a href="tel:048-483-6687" className="text-orange-600">要問合せ</a>
                    ) : priceItem ? (
                      `${Number(priceItem.price).toLocaleString()}円/kg`
                    ) : '-'}
                  </p>
                <p className="text-sm text-gray-600 text-left">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
