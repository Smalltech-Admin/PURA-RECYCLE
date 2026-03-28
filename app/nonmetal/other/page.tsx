'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { CategoryNav } from '@/components/CategoryNav';

const ITEMS = [
  { name: 'ステンレス', image: '/images/000stainless.gif', desc: '基本的に磁石に着かないもの。ステンレス以外のダストが多い場合は減額になります。' },
  { name: '給湯器', image: '/images/000kyuutouki.gif', desc: '一般家庭にあるガス給湯器で、動作しなくても買取ります。内部の銅製の釜が存在すれば、破砕品でも買取りします。' },
  { name: 'エアコン', image: '/images/000aircon.gif', desc: '動作しなくても買取ります。基本は室外機とセットでの買取となります。' },
  { name: '家庭用ガラ', image: '/images/000zappin1.gif', desc: '家電製品やOA機器等です。乾電池・バッテリー、コピー機のトナー等は取り除いて下さい。' },
  { name: '工業用ガラ', image: '/images/000zappin2.gif', desc: '工業用の機械、工作機、エンジン、トランスミッション等です。' },
  { name: '安定器', image: '/images/000anteiki.gif', desc: '蛍光灯に使用される安定器で、通電しなくても買取します。' },
  { name: '基板', image: '/images/000kiban.gif', desc: 'パソコンをはじめ、各種電化製品等に搭載されている基板です。' },
];

export default function OtherPage() {
  const { items, loading } = usePricesByCategory('その他');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-700 pb-3">
        その他非金属の買取
      </h1>

      <CategoryNav current="その他" />

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
