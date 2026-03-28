'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'トップページ' },
  { href: '/nonmetal', label: '非鉄金属買取' },
  { href: '/machine', label: '建設重機買取' },
  { href: '/motercar', label: '自動車買取' },
  { href: '/businessinfo', label: '買取の案内' },
  { href: '/company', label: '会社概要' },
  { href: '/access', label: 'アクセス' },
  { href: '/contact', label: 'お問合せ' },
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
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/Logo.jpg"
              alt="PRロゴ"
              width={50}
              height={50}
              className="h-10 md:h-12 w-auto rounded-full"
              priority
            />
            <div className="leading-tight">
              <p className="text-[10px] md:text-xs font-bold text-gray-600 tracking-wider">金属・自動車・建設重機買取</p>
              <p className="text-lg md:text-2xl font-black tracking-wide text-black">株式会社プラ・リサイクル</p>
              <p className="text-[10px] md:text-xs font-bold tracking-widest" style={{ color: '#000', WebkitTextStroke: '0.3px #fff', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}>PURA RECYCLE CO.,LTD</p>
            </div>
          </Link>

          <div className="hidden md:block text-right">
            <div className="flex items-center gap-6 justify-end">
              <a href="tel:048-483-6687" className="text-green-700 font-bold text-2xl hover:underline">
                TEL: 048-483-6687
              </a>
              <span className="text-green-700 font-bold text-2xl">
                FAX: 048-483-6688
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 text-right">
              営業時間: AM8:30〜PM7:00 / 年中無休 / FAX 24時間OK
            </p>
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
                    className={`block px-5 py-3 font-medium transition-colors border-b-3 ${
                      active
                        ? 'text-white bg-green-700 border-green-700'
                        : 'text-gray-700 border-transparent hover:text-green-700 hover:bg-green-50 hover:border-green-400'
                    } ${isContact ? 'text-base font-bold' : 'text-sm'}`}
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
          <div className="px-4 py-3 border-b border-gray-100 text-center">
            <a href="tel:048-483-6687" className="block text-green-700 font-bold text-xl">
              TEL: 048-483-6687
            </a>
            <p className="text-green-700 font-bold text-xl mt-1">
              FAX: 048-483-6688
            </p>
            <p className="text-xs text-gray-500 mt-1">年中無休 AM8:30〜PM7:00 / FAX 24時間OK</p>
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
                        ? 'text-white bg-green-700 font-bold'
                        : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
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
