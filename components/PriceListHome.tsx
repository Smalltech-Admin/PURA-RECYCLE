'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';
import { UpBadge } from '@/components/UpBadge';
import { withBasePath } from '@/lib/basePath';

const CATEGORY_SLUG: Record<string, string> = {
  '銅': '/nonmetal/dou',
  '電線': '/nonmetal/densen',
  'バッテリー': '/nonmetal/battery',
  '真鍮': '/nonmetal/shinchuu',
  '真鍮・砲金': '/nonmetal/shinchuu',
  'モーター': '/nonmetal/moter',
  'ラジエター': '/nonmetal/radieter',
  '鉛': '/nonmetal/namari',
  'ホイール': '/nonmetal/hoile',
  '特殊金属': '/nonmetal/tokushu',
  'その他': '/nonmetal/other',
};

const SUBCATEGORY_IMAGE: Record<string, string> = {
  '1号銅（ピカ銅）': '/images/0001goudou.gif',
  '2号銅（並銅）': '/images/0002goudou.gif',
  '並銅': '/images/000namidou.gif',
  '込銅': '/images/000kondou.gif',
  '錫(スズ)銅線': '/images/000suzu.gif',
  '赤釜': '/images/000akagama.gif',
  '白釜': '/images/000shirogama.gif',
  '皮付線（エアコンホース）': '/images/000kawatsuki.gif',
  'ダライ・切粉': '/images/000darainagetto.gif',
  '1本線（高）': '/images/000ipponsen1.gif',
  '1本線（中）': '/images/000ipponsen2.gif',
  '1本線（低）': '/images/000ipponsen3.gif',
  '3本線（高）': '/images/000sanbonsen1.gif',
  '3本線（中）': '/images/000sanbonsen2.gif',
  '3本線（低）': '/images/000sanbonsen3.gif',
  'VA線（VVFケーブル）': '/images/000vasen.gif',
  '家電線': '/images/000kadensen.gif',
  'ハーネス': '/images/000hanes.gif',
  '車用': '/images/000battery1.gif',
  '工業用': '/images/000battery2.gif',
  'フォークリフト用': '/images/000battery3.gif',
  'シールドバッテリー': '/images/000battery4.gif',
  'バイク用': '/images/000battery5.gif',
  'タカウイ': '/images/000shinchuu1.gif',
  '混タカウイ': '/images/000shinchuu2.gif',
  'タカウイダライ': '/images/000shinchuu3.gif',
  '砲金（付物なし）': '/images/000houkin1.gif',
  'バルブ砲金': '/images/000houkin2.gif',
  '砲金ダライ': '/images/000houkin3.gif',
  'MIX': '/images/000moter1.gif',
  'セルモーター': '/images/000moter2.gif',
  'コンプレッサー': '/images/000moter3.gif',
  'ダイナモ': '/images/000moter4.gif',
  'エアコン（ゴルフ）': '/images/000radi1.gif',
  'エアコン（ゴム）': '/images/000radi2.gif',
  'アルミ（トン）': '/images/000radi3.gif',
  'アルミ（トラック）': '/images/000radi4.gif',
  'タカウイorアルミ': '/images/000radi5.gif',
  '鉛': '/images/000namari1.gif',
  '鉛板': '/images/000namari2.gif',
  '鉛管': '/images/000namari3.gif',
  'バランスウエイト（車）': '/images/000namari4.gif',
  'バランスウエイト（二輪）': '/images/000namari5.gif',
  'ホイール線（フル）': '/images/000hoile1.gif',
  'ホイールPP（フル含）': '/images/000hoile2.gif',
  'ユニッケル線': '/images/000t-kin1.gif',
  'ニクロム線': '/images/000t-kin2.gif',
  'ニッタン線': '/images/000t-kin3.gif',
  'ノズル': '/images/000t-kin4.gif',
  '合金(スズ)': '/images/000t-kin5.gif',
  '炉材': '/images/000t-kin6.gif',
  'ハニーブデン': '/images/000t-kin7.gif',
  '重電': '/images/000t-kin8.gif',
  'ステンレス': '/images/000stainless.gif',
  '給湯器': '/images/000kyuutouki.gif',
  'エアコン': '/images/000aircon.gif',
  '家庭用ガラ': '/images/000zappin1.gif',
  '工業用ガラ': '/images/000zappin2.gif',
  '安定器': '/images/000anteiki.gif',
  '基板': '/images/000kiban.gif',
};

export function PriceListHome() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const lastUpdated = '';

  if (loading) {
    return (
      <div className="border rounded-none p-4 bg-white h-[200px] flex items-center justify-center">
        <p className="text-sm text-gray-400 animate-pulse">買取価格を読み込み中...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-none p-4 bg-white">
        <p className="text-sm text-gray-500">価格データがありません。</p>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex justify-between items-center mb-3 border-b-2 border-green-600 pb-2">
        <h2 className="font-bold text-lg text-gray-700">買取価格（税込）</h2>
        {lastUpdated && (
          <span className="text-sm text-gray-400">{lastUpdated} 現在</span>
        )}
      </div>
      <div className="h-[300px]">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          slidesPerGroup={3}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={false}
          breakpoints={{
            640: { slidesPerView: 3, slidesPerGroup: 3 },
            900: { slidesPerView: 3, slidesPerGroup: 3 },
          }}
          style={{ height: '100%' }}
          className="price-carousel"
        >
          {items.map((item, i) => {
            const img = SUBCATEGORY_IMAGE[item.subcategory];
            const href = CATEGORY_SLUG[item.category] ?? '/nonmetal';
            const priceNum = !isNaN(Number(item.price)) ? Number(item.price).toLocaleString() : null;
            const unitStr = item.unit ? item.unit.replace('円/', '') : 'kg';

            return (
              <SwiperSlide key={i}>
                <Link href={href} className="block text-center group h-full">
                  <div className="relative">
                    {img ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={withBasePath(img)}
                        alt={item.subcategory}
                        style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                        className="rounded-none group-hover:shadow-lg transition-shadow bg-white"
                      />
                    ) : (
                      <div
                        className="bg-gray-100 rounded-none flex items-center justify-center"
                        style={{ width: '100%', height: '200px' }}
                      >
                        <span className="text-sm text-gray-400">{item.subcategory}</span>
                      </div>
                    )}
                    {item.direction === 'UP' && <UpBadge />}
                  </div>
                  <p className="text-base font-bold text-gray-700 mt-2 truncate">{item.subcategory}</p>
                  <div className="mt-1">
                    {item.price === '要問合せ' ? (
                      <span className="text-base font-bold text-orange-500">要問合せ</span>
                    ) : priceNum ? (
                      <>
                        <span className="text-2xl font-bold text-red-600">{priceNum}</span>
                        <span className="text-xs text-gray-600 ml-1">円/{unitStr}（税込）</span>
                      </>
                    ) : (
                      <span className="text-base text-gray-500">{item.price}</span>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
