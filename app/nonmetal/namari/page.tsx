'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-brand pb-3">
        鉛の買取
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 mt-6"><aside><NonmetalSidebar current="鉛" /></aside><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
