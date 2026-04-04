'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TateneBar } from '@/components/TateneBar';
import { LmeCalculator } from '@/components/LmeCalculator';
import { NewsSection } from '@/components/NewsSection';
import { TodayCalendar } from '@/components/TodayCalendar';
import { LineButton } from '@/components/LineButton';
import { PriceListHome } from '@/components/PriceListHome';

const CATEGORY_NAV = [
  { href: '/nonmetal/dou', label: '銅' },
  { href: '/nonmetal/densen', label: '雑電線' },
  { href: '/nonmetal/battery', label: 'バッテリー' },
  { href: '/nonmetal/shinchuu', label: '真鍮・砲金' },
  { href: '/nonmetal/moter', label: 'モーター' },
  { href: '/nonmetal/radieter', label: 'ラジエター' },
  { href: '/nonmetal/namari', label: '鉛' },
  { href: '/nonmetal/hoile', label: 'ホイール' },
  { href: '/nonmetal/tokushu', label: '特殊金属' },
  { href: '/nonmetal/other', label: 'ステンレス・その他' },
  { href: '/machine', label: '建設重機' },
  { href: '/motercar', label: '自動車' },
  { href: '/businessinfo', label: '買取の案内' },
];

export default function HomePage() {
  return (
    <>
      {/* ===== 第1行: 建値 | 新着情報 | カレンダー+LINE ===== */}
      <section className="max-w-7xl mx-auto px-4 pt-3">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-3">
          {/* 左: 相場建値情報 */}
          <div>
            <TateneBar />
          </div>
          {/* 中央: 新着情報 */}
          <div className="min-w-0">
            <NewsSection />
          </div>
          {/* 右: カレンダー + LINE */}
          <div className="flex flex-col gap-3">
            <TodayCalendar />
            <LineButton />
          </div>
        </div>
      </section>

      {/* ===== メイン3カラム: 左サイド | 中央コンテンツ | 右サイド ===== */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-4">

          {/* ===== 左サイドバー: 品目ナビゲーション ===== */}
          <aside className="hidden md:block">
            <div className="border rounded-lg bg-white overflow-hidden">
              <h3 className="bg-brand text-gray-800 text-sm font-bold px-3 py-2">取扱い品目</h3>
              <ul className="text-sm divide-y">
                {CATEGORY_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* アクセスリンク */}
            <div className="border rounded-lg bg-white mt-3 p-3">
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
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div
                  key={n}
                  className="w-full h-[100px] bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300"
                >
                  <span className="text-gray-500 font-bold text-lg">画像 {n}（バナー差し替え用）</span>
                </div>
              ))}
            </div>

            {/* 新着買取価格カルーセル */}
            <PriceListHome />
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

            {/* 買取価格表リンク */}
            <div className="border rounded-lg bg-white overflow-hidden">
              <h3 className="bg-brand text-gray-800 text-xs font-bold px-3 py-2">コンテンツ</h3>
              <ul className="text-xs divide-y">
                <li>
                  <Link href="/nonmetal" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark">
                    買取価格表
                  </Link>
                </li>
                <li>
                  <Link href="/businessinfo" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark">
                    買取の流れ
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
        {/* 品目ナビ */}
        <div className="border rounded-lg bg-white overflow-hidden">
          <h3 className="bg-brand text-gray-800 text-sm font-bold px-3 py-2">取扱い品目</h3>
          <div className="grid grid-cols-3 text-sm">
            {CATEGORY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-brand-dark border-b border-r border-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* LME計算ツール */}
        <LmeCalculator />

        {/* Facebook */}
        <a
          href="https://ja-jp.facebook.com/pages/%E3%83%97%E3%83%A9%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB/491338754236880"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <Image src="/images/facebook.gif" alt="Facebook" width={345} height={105} className="w-full h-auto rounded-lg" />
        </a>
      </section>

    </>
  );
}
