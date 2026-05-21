'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TateneBar } from '@/components/TateneBar';
import { LmeCalculator } from '@/components/LmeCalculator';
import { NewsSection } from '@/components/NewsSection';
import { TodayCalendar } from '@/components/TodayCalendar';
import { LineButton } from '@/components/LineButton';
import { NonmetalSidebar } from '@/components/NonmetalSidebar';
import { UpBadge } from '@/components/UpBadge';
import { PriceTag } from '@/components/PriceTag';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';
import { PRODUCTS } from '@/lib/products';
import { withBasePath } from '@/lib/basePath';
// import { ShineEffect } from '@/components/ShineEffect';

// スプレッドシートのトップ表示フラグが未設定のときに使う既定の3商品
const DEFAULT_TOP_IDS = ['pika', '1gou-a', '2gou'];

export default function HomePage2() {
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

  // トップ上部の3商品：シートH列「トップ3件表示」のものを上から3つ（一覧非表示とは独立）。
  // 未設定時は既定の3商品にフォールバック。
  const flaggedTop = PRODUCTS.filter((p) => {
    const row = prices.find((pr) => pr.subcategory === p.name);
    return row !== undefined && row.top;
  }).slice(0, 3);
  const topProducts =
    flaggedTop.length > 0
      ? flaggedTop
      : DEFAULT_TOP_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
          (p): p is (typeof PRODUCTS)[number] => p !== undefined
        );

  return (
    <div className="holographic-bg relative">
      {/* ===== ヒーローセクション（モバイル専用・横長） ===== */}
      <section className="md:hidden">
        <div className="relative w-full h-[30vh] min-h-[180px] max-h-[240px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath('/images/company-exterior-hero.jpg')}
            alt="株式会社プラ・リサイクル"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* ===== 第1行: 建値 | 固定3商品 | カレンダー ===== */}
      <section className="max-w-7xl mx-auto px-4 pt-3">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-3 md:items-stretch">
          {/* PC: 左のみ表示 (モバイルでは下に再配置) */}
          <div className="hidden md:block md:col-start-1 md:row-start-1 md:h-full">
            <TateneBar />
          </div>
          {/* PC: 中央 / Mobile: 2番目 */}
          <div className="md:col-start-2 md:row-start-1 order-2 md:order-none min-w-0">
            <div className="grid grid-cols-3 gap-3">
              {topProducts.map((product) => {
                const price = findPrice(product.name);
                return (
                  <Link key={product.name} href={`/nonmetal/${product.id}`} className="flex flex-col bg-white/90 rounded-none shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2"
                    style={{ borderColor: "#2f5a8a" }}>
                    <div className="relative overflow-hidden h-[130px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={withBasePath(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {price?.direction === 'UP' && <UpBadge />}
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-bold text-gray-800 text-base md:text-lg mb-1 leading-tight">{product.name}</p>
                      <div>
                        <PriceTag price={price} loading={loading} size="sm" emptyLabel="-" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          {/* PC: 右 / Mobile: 1番目 */}
          <div className="md:col-start-3 md:row-start-1 order-1 md:order-none md:h-full">
            <TodayCalendar />
          </div>
          {/* 買取一覧ボタン（モバイルのみ・3番目） */}
          <Link
            href="/nonmetal"
            className="md:hidden order-3 bg-sky-400 text-gray-800 font-black text-center py-4 rounded-none hover:bg-sky-500 transition-colors text-2xl"
          >
            買取一覧はこちら！
          </Link>
        </div>
      </section>

      {/* ===== モバイル用: 相場（横いっぱい・文字大）→ 新着情報 ===== */}
      <section className="md:hidden max-w-7xl mx-auto px-4 pt-3 space-y-3">
        <TateneBar variant="mobile" />
        <NewsSection />
      </section>

      {/* ===== メイン3カラム: 左サイド | 中央コンテンツ | 右サイド ===== */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-4">

          {/* ===== 左サイドバー: 取扱い品目20商品 ===== */}
          <aside className="hidden md:block">
            <NonmetalSidebar current="" />

            {/* アクセスリンク */}
            <div className="border rounded-none bg-white/90 mt-3 p-3">
              <h3 className="text-sm font-bold text-gray-700 mb-2">アクセス</h3>
              <p className="text-xs text-gray-600 mb-1">埼玉県新座市大和田2-1-29</p>
              <Link href="/access" className="text-xs text-sky-600 hover:underline">
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
                className="hidden md:flex w-full h-[90px] bg-sky-400 rounded-none items-center justify-center hover:bg-sky-500 transition-colors"
              >
                <span className="text-gray-800 font-black text-xl md:text-2xl">買取一覧はこちらから！</span>
              </Link>
              {/* 新着情報（PC用） */}
              <div className="hidden md:block">
                <NewsSection />
              </div>
              {/* バナー1（スマホのみ）: LINE（細さそのまま）。PCはトラックが最上段バナーになる */}
              <div className="md:hidden">
                <LineButton />
              </div>
              {/* バナー: 2tトラックレンタル（PCでは最上段バナー）。バナー3と同じ200pxに収める */}
              <div className="w-full h-[200px] bg-white rounded-none border-2 border-sky-400 overflow-hidden flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBasePath('/images/2t-truck.jpg')}
                  alt="2tトラックレンタル"
                  className="w-full flex-1 min-h-0 object-cover"
                />
                <div className="p-2 text-center shrink-0">
                  <p className="text-gray-800 font-black text-lg md:text-xl">2tトラックレンタル</p>
                  <p className="text-gray-600 text-xs md:text-sm">詳細はお問い合わせください。</p>
                </div>
              </div>
              {/* バナー3: 差し替え用プレースホルダ */}
              <div className="w-full h-[200px] bg-white/50 rounded-none flex items-center justify-center border border-white/70">
                <span className="text-gray-500 font-bold text-lg">画像 （バナー差し替え用）</span>
              </div>
            </div>
          </div>

          {/* ===== 右サイドバー ===== */}
          <aside className="hidden md:flex flex-col gap-3">
            {/* LME計算ツール */}
            <LmeCalculator />

            {/* TEL/FAX カード */}
            <div className="border rounded-none p-4 bg-sky-400 text-center text-gray-800">
              <p className="text-sm mb-1">お問い合わせ</p>
              <p className="text-xs text-gray-700">フリーダイヤル</p>
              <a href="tel:0120-472-872" className="block font-black text-2xl hover:underline leading-tight">
                0120-472-872
              </a>
              <a href="tel:048-483-6687" className="block font-bold text-lg mt-2 hover:underline">
                TEL: 048-483-6687
              </a>
              <p className="font-bold text-lg">FAX: 048-483-6688</p>
              <p className="text-gray-700 text-xs mt-2">年中無休 / FAX 24時間OK</p>
            </div>

            {/* コンテンツリンク */}
            <div className="border rounded-none bg-white/90 overflow-hidden">
              <h3 className="bg-sky-400 text-gray-800 text-xs font-bold px-3 py-2">コンテンツ</h3>
              <ul className="text-xs divide-y">
                <li>
                  <Link href="/nonmetal" className="block px-3 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600">
                    買取価格表
                  </Link>
                </li>
                <li>
                  <Link href="/businessinfo" className="block px-3 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600">
                    買取の案内
                  </Link>
                </li>
                <li>
                  <Link href="/company" className="block px-3 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600">
                    会社概要
                  </Link>
                </li>
                <li>
                  <Link href="/access" className="block px-3 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600">
                    アクセス
                  </Link>
                </li>
              </ul>
            </div>

            {/* LINE（旧Facebookの位置） */}
            <LineButton />
            {/* Facebook（コメントアウト）
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
                className="w-full h-auto rounded-none"
              />
            </a>
            */}
          </aside>
        </div>
      </section>

      {/* ===== モバイル用: サイドバーの内容を下に表示 ===== */}
      <section className="md:hidden max-w-7xl mx-auto px-4 pb-6 space-y-4">
        <NonmetalSidebar current="" />
      </section>
    </div>
  );
}
