'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';

const ITEMS = [
  { name: '車用', image: '/images/000battery1.gif', desc: '大型車両のバッテリーも買取ります。動作しなくても買取ります。鉛の含まれていないものは取り扱いできません。' },
  { name: '工業用', image: '/images/000battery2.gif', desc: '動作しなくても買取ります。鉛の含まれていないものは取扱いできません。' },
  { name: 'フォークリフト用', image: '/images/000battery3.gif', desc: '動作しなくても買取ります。鉛の含まれていないものは取り扱いできません。' },
  { name: 'シールドバッテリー', image: '/images/000battery4.gif', desc: '液の入替えをしない密閉型鉛電池です。動作しなくても買取ります。鉛の含まれていないものは取り扱いできません。' },
  { name: 'バイク用', image: '/images/000battery5.gif', desc: '動作しなくても買取ります。鉛の含まれていないものは取り扱いできません。' },
];

export default function BatteryPage() {
  const { items, loading } = usePricesByCategory('バッテリー');

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-brand pb-3">
        バッテリーの買取
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 mt-6"><aside><NonmetalSidebar current="バッテリー" /></aside><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ITEMS.map((item) => {
          const priceItem = items.find((p) => p.subcategory === item.name);
          return (
            <div key={item.name} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
              <div className="relative">
                <Image src={item.image} alt={item.name} width={400} height={300} className="w-full h-auto" />
                {priceItem?.direction === 'UP' && <UpBadge size="lg" />}
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-gray-800 text-xl mb-2">{item.name}</h3>
                <div className="mb-3">
                    {loading ? (
                      <span className="text-xl text-gray-400">...</span>
                    ) : priceItem?.price === '要問合せ' ? (
                      <a href="/contact" className="text-lg font-bold text-orange-500">要問合せ</a>
                    ) : priceItem ? (
                      <>
                        <span className="text-3xl font-bold text-red-600">{Number(priceItem.price).toLocaleString()}</span>
                        <span className="text-sm text-gray-600 ml-1">円/{priceItem.unit?.replace('円/', '') || 'kg'}（税込）</span>
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                <p className="text-sm text-gray-600 text-left">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
