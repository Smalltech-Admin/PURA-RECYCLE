'use client';

import Image from 'next/image';
import { usePricesByCategory } from '@/lib/usePrices';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';

const ITEMS = [
  { name: '1本線（高）', image: '/images/000ipponsen1.gif', desc: '1本線の上級品(60mm、100mm、150mm、200mm以上)等が相当します。被覆が容易に剥くことができないものは減額or買取りできないことがあります。' },
  { name: '1本線（中）', image: '/images/000ipponsen2.gif', desc: '1本線の中級品(22mm、38mm)等が相当します。3.5mm〜14mmの1本線は下級品として買取りします。' },
  { name: '1本線（低）', image: '/images/000ipponsen3.gif', desc: '1本線(IV、CVT等)の下級品(3.5mm〜14mm)等が相当します。2mm以下の1本線等は「家電線」として買取りします。' },
  { name: '3本線（高）', image: '/images/000sanbonsen1.gif', desc: '3本線(60mm2、100mm、150mm、200mm以上)の上級品等が相当します。被覆が容易に剥くことができないものは減額or買取りできないことがあります。' },
  { name: '3本線（中）', image: '/images/000sanbonsen2.gif', desc: '3本線(22mm、38mm)の中級品等が相当します。3.5mm〜14mmの3本線は下級品として買取りします。' },
  { name: '3本線（低）', image: '/images/000sanbonsen3.gif', desc: '3本線(SV、CV等)の下級品(3.5mm〜14mm等)が相当します。被覆が容易に剥くことができないものは減額or買取りできないことがあります。' },
  { name: 'VA線（VVFケーブル）', image: '/images/000vasen.gif', desc: 'VA線(Fケーブル、灰色の平たい線)等が相当します。内部に含まれる銅線の1本あたりの太さが1.3mm以上あるものとなります。' },
  { name: '家電線', image: '/images/000kadensen.gif', desc: '家電製品の電力供給用として広く使われている電線。銅率は30〜35%前後のもの。先端のプラグ部分は付いていても問題ありません。ACアダプタやタップ等はダスト扱いとなり減額が生じます。' },
  { name: 'ハーネス', image: '/images/000hanes.gif', desc: 'ワイヤーハーネス(ケーブルハーネス)とも呼ばれます。自動車の内部に含まれている電線で、内線が銅であるものに限ります。' },
];

export default function DensenPage() {
  const { items, loading } = usePricesByCategory('電線');

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-brand pb-3">
        電線の買取
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 mt-6"><aside><NonmetalSidebar current="電線" /></aside><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
