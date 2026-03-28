'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { CategoryNav } from '@/components/CategoryNav';

const ITEMS = [
  { name: 'MIX', image: '/images/000moter1.gif', desc: '工業用や家電品に使われているモーターです。エアコンや冷蔵庫に含まれている黒モーターも買取りします。水中ポンプや電動工具等もモーターとして買取りします。' },
  { name: 'セルモーター', image: '/images/000moter2.gif', desc: '自動車用のセルモーターです。リユース品として買取ります。留具、ボディが破損し、二次利用できないものは減額させていただきます。' },
  { name: 'コンプレッサー', image: '/images/000moter3.gif', desc: '自動車用のコンプレッサーです。リユース品として買取ります。留具、ボディが破損し、二次利用できないものは減額させていただきます。' },
  { name: 'ダイナモ', image: '/images/000moter4.gif', desc: '自動車の発電機です。リユース品として買取ります。留具、ボディが破損し、二次利用できないものは減額させていただきます。' },
];

export default function MoterPage() {
  const { items, loading } = usePricesByCategory('モーター');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-700 pb-3">
        モーターの買取
      </h1>

      <CategoryNav current="モーター" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {ITEMS.map((item) => {
          const priceItem = items.find((p) => p.subcategory === item.name);
          return (
            <div key={item.name} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
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
