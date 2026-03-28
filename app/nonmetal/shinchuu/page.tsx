'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { CategoryNav } from '@/components/CategoryNav';

const ITEMS = [
  { name: 'タカウイ', image: '/images/000shinchuu1.gif', desc: '銅と亜鉛の化合物で、真鍮100％で不純物がないもの。真鍮以外の異物が付いているものやメッキ品等は混真鍮として扱います。' },
  { name: '混タカウイ', image: '/images/000shinchuu2.gif', desc: '鋳物真鍮、メッキ真鍮等の混ざりもので、蛇口やバルブ等が相当します。プラスチック、鉄、アルミ、丹入等のダストが多い場合減額になります。真鍮製の仏具や置物なども買取りできます。' },
  { name: 'タカウイダライ', image: '/images/000shinchuu3.gif', desc: 'ダライ粉については、要お問合せ下さい。金額の査定が行えない場合があります。' },
  { name: '砲金（付物なし）', image: '/images/000houkin1.gif', desc: '銅とスズと鉛の合金です。水道メーターの容器、バルブ、ナット等が相当します。100％砲金で不純物の無いものに限ります。' },
  { name: 'バルブ砲金', image: '/images/000houkin2.gif', desc: 'バルブ(弁)等で、外側の本体が砲金で、芯棒は真鍮のものです。砲金にメッキ加工されているものも含みます。' },
  { name: '砲金ダライ', image: '/images/000houkin3.gif', desc: 'ダライ粉については、要お問合せ下さい。金額の査定が行えない場合があります。' },
];

export default function ShinchuuPage() {
  const { items, loading } = usePricesByCategory('タカウイ・真鍮');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-700 pb-3">
        タカウイ・真鍮の買取
      </h1>

      <CategoryNav current="真鍮・砲金" />

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
