'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { CategoryNav } from '@/components/CategoryNav';

const ITEMS = [
  { name: 'ユニッケル線', image: '/images/000t-kin1.gif', desc: 'モノにより成分が異なり、価格も変わります。要お問合せ下さい。' },
  { name: 'ニクロム線', image: '/images/000t-kin2.gif', desc: 'ニッケル（Ni）とクロム（Cr）の合金です。電気抵抗が高くヒーターの伝熱線等に利用されているものです。' },
  { name: 'ニッタン線', image: '/images/000t-kin3.gif', desc: 'モノにより成分が異なり、価格も変わります。要お問合せ下さい。' },
  { name: 'ノズル', image: '/images/000t-kin4.gif', desc: 'モノにより成分が異なり、価格も変わります。要お問合せ下さい。' },
  { name: '合金(スズ)', image: '/images/000t-kin5.gif', desc: 'モノにより成分が異なり、価格も変わります。要お問合せ下さい。' },
  { name: '炉材', image: '/images/000t-kin6.gif', desc: 'モノにより成分が異なり、価格も変わります。要お問合せ下さい。' },
  { name: 'ハニーブデン', image: '/images/000t-kin7.gif', desc: 'モノにより成分が異なり、価格も変わります。要お問合せ下さい。' },
  { name: '重電', image: '/images/000t-kin8.gif', desc: '切削工具に使用されるチップです。タングステンとコバルトからなる合金。' },
];

export default function TokushuPage() {
  const { items, loading } = usePricesByCategory('特殊金属');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-700 pb-3">
        特殊金属の買取
      </h1>

      <CategoryNav current="特殊金属" />

      <p className="text-sm text-gray-500 mt-6">
        ※特殊金属は成分により価格が大きく変わります。まずはお電話（<a href="tel:048-483-6687" className="text-green-700 hover:underline">048-483-6687</a>）にてお問い合わせください。
      </p>

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
