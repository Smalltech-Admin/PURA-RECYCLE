'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';

const ITEMS = [
  { name: '1号銅（ピカ銅）', image: '/images/0001goudou.gif', desc: '線材直径1.3mm以上の純銅で、錫メッキ・エナメル塗装・表面劣化等のないもの。針金・紙・テープが付いた場合はピカ銅になりません。' },
  { name: '2号銅（並銅）', image: '/images/0002goudou.gif', desc: '線材直径1.3mm以上の純銅で、表面に酸化があるもの。針金・紙・テープの付いていないもの。' },
  { name: '並銅', image: '/images/000namidou.gif', desc: '銅パイプ（タケノコ式ジョイント箇所）や自動車パイプで径5mm以上の銅平板が含まれるもの。' },
  { name: '込銅', image: '/images/000kondou.gif', desc: '銅パイプに真鍮や溶接箇所のあるもの。' },
  { name: '錫(スズ)銅線', image: '/images/000suzu.gif', desc: '線材直径1.3mm以上の純銅で、錫(スズ)メッキのもの。メッキのため茶色になっている。通常の銅より価格が低い。' },
  { name: '赤釜', image: '/images/000akagama.gif', desc: '給湯器の銅製部品。全体にダストが付いている場合は減額になります。' },
  { name: '白釜', image: '/images/000shirogama.gif', desc: '給湯器の銅製部品。全体にダストが付いている場合は減額になります。' },
  { name: '皮付線（エアコンホース）', image: '/images/000kawatsuki.gif', desc: '被覆に分けられたエアコンホース。' },
  { name: 'ダライ・切粉', image: '/images/000darainagetto.gif', desc: 'お問い合わせください。一部品種の買取りが出来ない場合があります。' },
];

export default function DouPage() {
  const { items, loading } = usePricesByCategory('銅');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-brand pb-3">
        銅の買取
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <aside>
          <NonmetalSidebar current="銅" />
        </aside>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
