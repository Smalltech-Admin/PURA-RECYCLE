'use client';

import { useEffect, useState } from 'react';
import { AppImage as Image } from '@/components/AppImage';
import Link from 'next/link';
import { TateneBar } from '@/components/TateneBar';
import { LmeCalculator } from '@/components/LmeCalculator';
import { NewsSection } from '@/components/NewsSection';
import { TodayCalendar } from '@/components/TodayCalendar';
import { LineButton } from '@/components/LineButton';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';
import { withBasePath } from '@/lib/basePath';
// import { ShineEffect } from '@/components/ShineEffect';

const FIXED_PRODUCTS = [
  { name: 'ピカ線', image: '/images/0001goudou.gif' },
  { name: '並銅', image: '/images/0002goudou.gif' },
  { name: '2号銅（込銅）', image: '/images/000namidou.gif' },
];

export default function Page2() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices()
      .then(setPrices)
      .finally(() => setLoading(false));
  }, []);

  function findPrice(name: string) {
    return prices.find((p) => p.subcategory === name);
  }

  return (
    <div className="min-h-screen holographic-bg relative">
      {/* ===== 第1行: 建値 | 固定3商品 + 買取一覧ボタン | カレンダー+LINE ===== */}
      <section className="max-w-7xl mx-auto px-4 pt-3">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-3 md:items-stretch">
          {/* 中央: 固定3商品（モバイルでは2番目） */}
          <div className="min-w-0 order-2 md:order-none">
            <div className="grid grid-cols-3 gap-3">
              {FIXED_PRODUCTS.map((product) => {
                const price = findPrice(product.name);
                return (
                  <Link key={product.name} href="/nonmetal" className="flex flex-col bg-white/90 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="relative overflow-hidden h-[120px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={withBasePath(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {price?.direction === 'UP' && <UpBadge />}
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-bold text-gray-800 text-sm mb-1">{product.name}</p>
                      <div>
                        {loading ? (
                          <span className="text-gray-400">...</span>
                        ) : price ? (
                          <>
                            <span className="text-xl md:text-2xl font-bold text-red-600">{Number(price.price).toLocaleString()}</span>
                            <span className="text-xs text-gray-600 ml-1">円/{price.unit?.replace('円/', '') || 'kg'}（税込）</span>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          {/* 左: 相場建値情報 + 買取一覧ボタン（モバイルでは3番目） */}
          <div className="flex flex-col order-3 md:order-first">
            <div className="md:flex-1 grid grid-cols-[2fr_1fr] md:grid-cols-1 gap-3">
              <TateneBar />
              <Link
                href="/nonmetal"
                className="md:hidden bg-brand text-gray-800 font-black text-center rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center text-xl leading-tight"
              >
                買取一覧は<br />こちら！
              </Link>
            </div>
          </div>
          {/* 右: カレンダー + LINE（モバイルでは最上部） */}
          <div className="flex flex-col gap-3 order-1 md:order-none">
            <div className="flex-1">
              <TodayCalendar />
            </div>
            <LineButton />
          </div>
        </div>
      </section>

      {/* ===== 新着情報 + LME計算ツール（モバイル用：建値の直後） ===== */}
      <section className="md:hidden max-w-7xl mx-auto px-4 pt-3 space-y-3">
        <NewsSection />
        <LmeCalculator />
      </section>

      {/* ===== メイン3カラム: 左サイド | 中央コンテンツ | 右サイド ===== */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-4">

          {/* ===== 左サイドバー: 取扱い品目20商品 ===== */}
          <aside className="hidden md:block">
            <NonmetalSidebar current="" />

            {/* アクセスリンク */}
            <div className="border rounded-lg bg-white/90 mt-3 p-3">
              <h3 className="text-sm font-bold text-gray-700 mb-2">アクセス</h3>
              <p className="text-xs text-gray-600 mb-1">埼玉県新座市野火止2-1-29</p>
              <Link href="/access" className="text-xs text-brand-dark hover:underline">
                地図を見る →
              </Link>
            </div>
          </aside>

          {/* ===== 中央メインコンテンツ ===== */}
          <div className="space-y-4 min-w-0 overflow-hidden">
            {/* バナー画像エリア */}
            <div className="space-y-2">
              {/* 買取一覧バナーリンク */}
              <Link
                href="/nonmetal"
                className="hidden md:flex w-full h-[200px] bg-brand rounded-lg items-center justify-center hover:bg-brand-dark transition-colors"
              >
                <span className="text-gray-800 font-black text-3xl md:text-4xl">買取一覧はこちらから！</span>
              </Link>
              {/* 新着情報（PC用） */}
              <div className="hidden md:block">
                <NewsSection />
              </div>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-full h-[200px] bg-white/50 rounded-lg flex items-center justify-center border border-white/70"
                >
                  <span className="text-gray-500 font-bold text-lg">画像 {n}（バナー差し替え用）</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 右サイドバー ===== */}
          <aside className="hidden md:flex flex-col gap-3">
            {/* LME計算ツール */}
            <LmeCalculator />

            {/* TEL/FAX カード */}
            <div className="border rounded-lg p-3 bg-brand text-center text-gray-800">
              <p className="text-xs mb-1">お問い合わせ</p>
              <a href="tel:048-483-6687" className="block font-bold text-lg hover:underline">
                048-483-6687
              </a>
              <p className="font-bold text-sm mt-1">FAX: 048-483-6688</p>
              <p className="text-gray-600 text-[10px] mt-1">年中無休 / FAX 24時間OK</p>
            </div>

            {/* コンテンツリンク */}
            <div className="border rounded-lg bg-white/90 overflow-hidden">
              <h3 className="bg-brand text-gray-800 text-xs font-bold px-3 py-2">コンテンツ</h3>
              <ul className="text-xs divide-y">
                <li>
                  <Link href="/nonmetal" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark">
                    買取価格表
                  </Link>
                </li>
                <li>
                  <Link href="/businessinfo" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark">
                    買取の案内
                  </Link>
                </li>
                <li>
                  <Link href="/company" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark">
                    会社概要
                  </Link>
                </li>
                <li>
                  <Link href="/access" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark">
                    アクセス
                  </Link>
                </li>
              </ul>
            </div>

            {/* Facebook */}
            <a
              href="https://ja-jp.facebook.com/pages/%E3%83%97%E3%83%A9%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB/491338754236880"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/facebook.gif"
                alt="Facebook"
                width={220}
                height={70}
                className="w-full h-auto rounded-lg"
              />
            </a>
          </aside>
        </div>
      </section>

      {/* ===== モバイル用: サイドバーの内容を下に表示 ===== */}
      <section className="md:hidden max-w-7xl mx-auto px-4 pb-6 space-y-4">
        <NonmetalSidebar current="" />
        {/* TEL/FAX */}
        <div className="border rounded-lg p-3 bg-brand text-center text-gray-800">
          <p className="text-xs mb-1">お問い合わせ</p>
          <a href="tel:048-483-6687" className="block font-bold text-lg hover:underline">048-483-6687</a>
          <p className="font-bold text-sm mt-1">FAX: 048-483-6688</p>
          <p className="text-gray-600 text-[10px] mt-1">年中無休 / FAX 24時間OK</p>
        </div>
        <a
          href="https://ja-jp.facebook.com/pages/%E3%83%97%E3%83%A9%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB/491338754236880"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <Image src="/images/facebook.gif" alt="Facebook" width={345} height={105} className="w-full h-auto rounded-lg" />
        </a>
      </section>
    </div>
  );
}
