'use client';

import { useState } from 'react';
import Link from 'next/link';

const SIDEBAR_ITEMS = [
  { href: '/nonmetal', label: '全て', key: '' },
  { href: '/nonmetal/dou', label: '銅', key: '銅' },
  { href: '/nonmetal/densen', label: '雑電線', key: '電線' },
  { href: '/nonmetal/battery', label: 'バッテリー', key: 'バッテリー' },
  { href: '/nonmetal/shinchuu', label: '真鍮・砲金', key: '真鍮・砲金' },
  { href: '/nonmetal/moter', label: 'モーター', key: 'モーター' },
  { href: '/nonmetal/radieter', label: 'ラジエター', key: 'ラジエター' },
  { href: '/nonmetal/namari', label: '鉛', key: '鉛' },
  { href: '/nonmetal/hoile', label: 'ホイール', key: 'ホイール' },
  { href: '/nonmetal/tokushu', label: '特殊金属', key: '特殊金属' },
  { href: '/nonmetal/other', label: 'ステンレス・その他', key: 'その他' },
];

export function NonmetalSidebar({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const currentLabel = SIDEBAR_ITEMS.find((i) => i.key === current)?.label || '取扱い品目';

  return (
    <div className="border rounded-lg bg-white overflow-hidden sticky top-28">
      {/* PC: 常に表示 */}
      <h3
        className="bg-brand text-gray-800 text-sm font-bold px-3 py-2 md:cursor-default cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span className="md:hidden">{currentLabel}</span>
        <span className="hidden md:inline">取扱い品目</span>
        <svg
          className={`w-4 h-4 md:hidden transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </h3>
      {/* PC: 常に表示 / モバイル: 折りたたみ */}
      <ul className={`text-sm divide-y ${open ? 'block' : 'hidden'} md:block`}>
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = current === item.key;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-brand text-gray-800 font-bold'
                    : 'text-gray-700 hover:bg-green-50 hover:text-brand-dark'
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
