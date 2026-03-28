'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { CategoryNav } from '@/components/CategoryNav';

const ITEMS = [
  { name: '鉛', image: '/images/000namari1.gif', desc: '99%鉛のものが該当します。水道やガスの供給に使われる鉛管も該当します。付物や泥、コンクリート等がある場合は減額になります。' },
  { name: '鉛板', image: '/images/000namari2.gif', desc: '鉛板として使用されていたもの。付物がある場合は減額になります。' },
  { name: '鉛管', image: '/images/000namari3.gif', desc: '水道やガスの供給に使われる鉛管。付物や泥等がある場合は減額になります。' },
  { name: 'バランスウエイト（車）', image: '/images/000namari4.gif', desc: '自動車のホイールに付いている鉛製の「おもり」です。鉛のみのもの。鉄や亜鉛製のものがありますので注意して下さい。' },
  { name: 'バランスウエイト（二輪）', image: '/images/000namari5.gif', desc: '自動車のホイールに付いている鉛製の「おもり」です。鉛と鉄の組み合わせになっているものです。' },
];

export default function NamariPage() {
  const { items, loading } = usePricesByCategory('鉛');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-700 pb-3">
        鉛の買取
      </h1>

      <CategoryNav current="鉛" />

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
