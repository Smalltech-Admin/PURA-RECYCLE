'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PriceListHome } from '@/components/PriceListHome';
import { TateneBar } from '@/components/TateneBar';
import { LmeCalculator } from '@/components/LmeCalculator';
import { NewsSection } from '@/components/NewsSection';

const NONMETAL_CARDS = [
  { href: '/nonmetal/dou', image: '/images/top-dou.gif', alt: '銅買取' },
  { href: '/nonmetal/densen', image: '/images/top-sen.gif', alt: '雑電線買取' },
  { href: '/nonmetal/battery', image: '/images/top-battery.gif', alt: 'バッテリー買取' },
  { href: '/nonmetal/shinchuu', image: '/images/top-shinchuu.gif', alt: '真鍮・砲金買取' },
  { href: '/nonmetal/moter', image: '/images/top-moter.gif', alt: 'モーター買取' },
  { href: '/nonmetal/radieter', image: '/images/top-radieter.gif', alt: 'ラジエター買取' },
  { href: '/nonmetal/namari', image: '/images/top-nama.gif', alt: '鉛買取' },
  { href: '/nonmetal/hoile', image: '/images/top-arh.gif', alt: 'アルミホイール買取' },
  { href: '/nonmetal/tokushu', image: '/images/top-tokushukin.gif', alt: '特殊金属買取' },
  { href: '/nonmetal/other', image: '/images/top-stain.gif', alt: 'ステンレス買取' },
  { href: '/nonmetal/other', image: '/images/top-kyuutou.gif', alt: '給湯器買取' },
  { href: '/nonmetal/other', image: '/images/top-eacon.gif', alt: 'エアコン買取' },
  { href: '/nonmetal/other', image: '/images/top-zappin1.gif', alt: '家庭用雑品買取' },
  { href: '/nonmetal/other', image: '/images/top-zappin2.gif', alt: '工業用雑品買取' },
  { href: '/nonmetal/other', image: '/images/top-antei.gif', alt: '安定器買取' },
  { href: '/nonmetal/other', image: '/images/top-kiban.gif', alt: '基盤買取' },
];

const OTHER_CARDS = [
  { href: '/businessinfo', image: '/images/top-kaiok.gif', alt: 'その他買取可商材' },
  { href: '/businessinfo', image: '/images/top-kaino.gif', alt: '買取不可商材' },
];

const VEHICLE_CARDS = [
  { href: '/machine', image: '/images/top-machine.gif', alt: '建設重機' },
  { href: '/motercar', image: '/images/top-car.gif', alt: '自動車' },
];

export default function Page2() {
  return (
    <>
      {/* 新着情報 */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <NewsSection />
      </section>

      {/* ヒーローバナー + 建値・LME */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
          {/* 左: 建値 + LME */}
          <div className="flex flex-col gap-3">
            <TateneBar />
            <LmeCalculator />
          </div>
          {/* 右: バナー画像 */}
          <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 min-h-[300px]">
            <span className="text-gray-500 font-bold text-lg">画像 1（バナー差し替え用）</span>
          </div>
        </div>
      </section>

      {/* 新着買取価格カルーセル */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <PriceListHome />
      </section>

      {/* Nonmetal Image Cards */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-brand-dark mb-2 text-center">
          【非鉄金属】<span className="text-red-500 text-lg ml-2">&lt;&lt; 高価買取中</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {NONMETAL_CARDS.map((card) => (
            <Link key={card.image} href={card.href} className="block rounded shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
              <Image
                src={card.image}
                alt={card.alt}
                width={350}
                height={150}
                className="w-full h-auto rounded shadow-sm"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Other Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-6">
        <h2 className="text-2xl font-bold text-brand-dark mb-4 text-center">【その他取扱い商材】</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OTHER_CARDS.map((card) => (
            <Link key={card.image} href={card.href} className="block rounded shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
              <Image
                src={card.image}
                alt={card.alt}
                width={350}
                height={150}
                className="w-full h-auto rounded shadow-sm"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Vehicle Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-bold text-brand-dark mb-2 text-center">
          【建設重機】【自動車】<span className="text-red-500 text-lg ml-2">&lt;&lt; お売り下さい</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {VEHICLE_CARDS.map((card) => (
            <Link key={card.image} href={card.href} className="block rounded shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
              <Image
                src={card.image}
                alt={card.alt}
                width={350}
                height={150}
                className="w-full h-auto rounded shadow-sm"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Banner */}
      <section className="bg-green-50 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            お気軽にお問い合わせください
          </h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
            <a
              href="tel:048-483-6687"
              className="text-brand-dark font-bold text-3xl md:text-4xl hover:underline"
            >
              TEL: 048-483-6687
            </a>
            <p className="text-brand-dark font-bold text-3xl md:text-4xl">
              FAX: 048-483-6688
            </p>
          </div>
          <p className="text-lg text-gray-600 mt-4">FAX 24時間OK / 営業時間: AM8:30〜PM7:00 / 年中無休</p>
        </div>
      </section>

      {/* Access Section */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">アクセス</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-center">
            <p className="text-lg text-gray-700 mb-4">
              <strong>所在地:</strong> 〒352-0004 埼玉県新座市野火止2-1-29<br />
              <strong>最寄駅:</strong> JR武蔵野線「新座駅」より 車で3分 / 徒歩で10分
            </p>
            <Link
              href="/access"
              className="text-brand-dark hover:underline font-medium text-lg"
            >
              詳しいアクセス方法はこちら →
            </Link>
          </div>
          <div className="aspect-video">
            <iframe
              src="https://www.google.com/maps?q=埼玉県新座市野火止2-1-29&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              className="rounded-lg border border-gray-200"
              title="プラリサイクル所在地"
            />
          </div>
        </div>
      </section>
    </>
  );
}
