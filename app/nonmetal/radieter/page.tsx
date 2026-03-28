import type { Metadata } from 'next';
import Image from 'next/image';
import { getPricesByCategory } from '@/lib/getPrices';
import { CategoryNav } from '@/components/CategoryNav';

export const metadata: Metadata = {
  title: 'ラジエターの買取',
  description: 'エアコン・アルミ・真鍮or半銅等のラジエターを高価買取。',
};

const ITEMS = [
  { name: 'エアコン（ゴルフ）', image: '/images/000radi1.gif', desc: 'エアコンの内部にあるラジエーターです。アルミニウムのフィン(羽)の中に銅管が通っているもの。' },
  { name: 'エアコン（ゴム）', image: '/images/000radi2.gif', desc: 'エアコンの内部にあるラジエーターです。鉄の部分を取り除き、アルミニウムのフィン(羽)と銅管だけにしたもの。' },
  { name: 'アルミ（トン）', image: '/images/000radi3.gif', desc: '自動車用のラジエーターです。フィン(羽)と管ともにアルミニウム製のもの。' },
  { name: 'アルミ（トラック）', image: '/images/000radi4.gif', desc: '自動車用のラジエーターです。外枠を取り除きアルミ製のフィン(羽)と管だけにしたもの。' },
  { name: 'タカウイorアルミ', image: '/images/000radi5.gif', desc: '自動車用のラジエーターです。羽が銅、管が真鍮、あるいは羽が真鍮、管が銅でできているもの。' },
];

export default async function RadieterPage() {
  const items = await getPricesByCategory('ラジエター');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-700 pb-3">
        ラジエターの買取
      </h1>

      <CategoryNav current="ラジエター" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {ITEMS.map((item) => {
          const priceItem = items.find((p) => p.subcategory === item.name);
          return (
            <div key={item.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src={item.image} alt={item.name} width={400} height={300} className="w-full h-auto" />
              <div className="p-5 text-center">
                <h3 className="font-bold text-gray-800 text-xl mb-2">{item.name}</h3>
                <p className="text-green-700 font-bold text-2xl mb-3">
                    {priceItem?.price === '要問合せ' ? (
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
