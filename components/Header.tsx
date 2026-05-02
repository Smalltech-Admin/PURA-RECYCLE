'use client';

import Link from 'next/link';
import { AppImage as Image } from '@/components/AppImage';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'トップページ1' },
  { href: '/page2', label: 'トップページ2' },
  { href: '/nonmetal', label: '非鉄金属買取' },
  { href: '/businessinfo', label: '買取の案内' },
  { href: '/company', label: '会社概要' },
  { href: '/access', label: 'アクセス' },
  { href: '/contact', label: 'お問合せ' },
  // { href: '/page2', label: 'トップページ2' },
  // { href: '/machine', label: '建設重機買取' },
  // { href: '/motercar', label: '自動車買取' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="flex items-center gap-2 md:gap-4">
            <Image
              src="/images/Logo.jpg"
              alt="PRロゴ"
              width={90}
              height={90}
              className="h-16 md:h-20 w-auto rounded-full"
              priority
            />
            <div className="leading-tight min-w-0">
              <p className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider whitespace-nowrap">
                金属・自動車・建設重機買取
                <span className="hidden md:inline"> / 第431360051697 埼玉県公安委員会</span>
              </p>
              <p
                className="text-lg md:text-4xl font-black tracking-wide leading-none whitespace-nowrap"
                style={{
                  color: '#86E24B',
                  WebkitTextStroke: '1px #000',
                  letterSpacing: '0em',
                  fontFamily: 'var(--font-mplus-rounded), "Hiragino Maru Gothic ProN", sans-serif',
                }}
              >
                PURA RECYCLE CO.,LTD
              </p>
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <span
                  className="text-[10px] md:text-xs font-black tracking-wider"
                  style={{
                    color: '#86E24B',
                    WebkitTextStroke: '0.8px #000',
                    fontFamily: 'var(--font-mplus-rounded), "Hiragino Maru Gothic ProN", sans-serif',
                  }}
                >
                  株式会社
                </span>
                <span
                  className="text-xs md:text-sm font-black tracking-wide"
                  style={{
                    color: '#86E24B',
                    WebkitTextStroke: '0.8px #000',
                    fontFamily: 'var(--font-mplus-rounded), "Hiragino Maru Gothic ProN", sans-serif',
                  }}
                >
                  プラ・リサイクル
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {/* フリーダイヤル（左・大） */}
            <div className="text-left">
              <p className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider leading-tight">フリーダイヤル</p>
              <a
                href="tel:0120-472-872"
                className="font-black text-3xl hover:underline tracking-tight leading-none"
                style={{ color: '#5a8a30', WebkitTextStroke: '1.5px #000' }}
              >
                0120-472-872
              </a>
              <p className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider mt-1">営業時間: AM8:30〜PM7:00 / 年中無休</p>
            </div>
            {/* TEL/FAX（右・二段） */}
            <div className="text-left border-l border-gray-300 pl-4">
              <a
                href="tel:048-483-6687"
                className="block font-bold text-base hover:underline leading-tight"
                style={{ color: '#5a8a30', WebkitTextStroke: '0.8px #000' }}
              >
                TEL: 048-483-6687
              </a>
              <span
                className="block font-bold text-base leading-tight mt-0.5"
                style={{ color: '#5a8a30', WebkitTextStroke: '0.8px #000' }}
              >
                FAX: 048-483-6688
              </span>
              <p className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider mt-1">FAX 24時間OK</p>
            </div>
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <nav className="hidden md:block border-t border-gray-100">
          <ul className="flex flex-wrap justify-center gap-0">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              const isContact = item.href === '/contact';
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-5 py-3 font-bold transition-colors border-b-3 ${
                      active
                        ? 'text-gray-800 bg-brand border-brand'
                        : 'text-gray-700 border-transparent hover:text-brand-dark hover:bg-green-50 hover:border-green-400'
                    } ${isContact ? 'text-base' : 'text-sm'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100 text-left">
            <p className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider">フリーダイヤル</p>
            <a
              href="tel:0120-472-872"
              className="block font-black text-2xl"
              style={{ color: '#5a8a30', WebkitTextStroke: '1.2px #000' }}
            >
              0120-472-872
            </a>
            <div className="flex gap-3 mt-2">
              <a
                href="tel:048-483-6687"
                className="font-bold text-sm"
                style={{ color: '#5a8a30', WebkitTextStroke: '0.6px #000' }}
              >
                TEL: 048-483-6687
              </a>
              <span
                className="font-bold text-sm"
                style={{ color: '#5a8a30', WebkitTextStroke: '0.6px #000' }}
              >
                FAX: 048-483-6688
              </span>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider mt-1">年中無休 AM8:30〜PM7:00 / FAX 24時間OK</p>
          </div>
          <ul>
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              const isContact = item.href === '/contact';
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-6 py-3 border-b border-gray-50 transition-colors ${
                      active
                        ? 'text-gray-800 bg-brand font-bold'
                        : 'text-gray-700 hover:text-brand-dark hover:bg-green-50'
                    } ${isContact ? 'text-lg font-bold' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
