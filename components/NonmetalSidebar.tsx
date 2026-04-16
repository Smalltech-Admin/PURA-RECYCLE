'use client';

import { useState } from 'react';
import Link from 'next/link';

const SIDEBAR_ITEMS = [
  { id: 'pika', label: 'ピカ線' },
  { id: '1gou-a', label: '1号銅（A）' },
  { id: '1gou-b', label: '1号銅（B）' },
  { id: 'namidou', label: '並銅' },
  { id: '2gou', label: '2号銅（込銅）' },
  { id: 'houkin', label: '砲金' },
  { id: 'komihoukin', label: '込砲金' },
  { id: 'komishinchuu', label: '込真鍮' },
  { id: '1ponsen-a', label: '1本線（A）100（B）60' },
  { id: '1ponsen-38', label: '1本線（38㎜）' },
  { id: '3ponsen-a', label: '3本線（A）' },
  { id: '3ponsen-b', label: '3本線（B）' },
  { id: '3ponsen-c', label: '3本線（C）' },
  { id: 'f-cable', label: 'Fケーブル' },
  { id: 'reiboukan', label: '冷房間' },
  { id: 'zassen', label: '雑線' },
  { id: 'zappinkuzu', label: '雑品くず（㎏）/セット' },
  { id: 'kyutouki', label: '給湯機' },
  { id: 'arumi-sasshi', label: 'アルミサッシ' },
  { id: 'arumi-hoile', label: 'アルミホイール' },
];

export function NonmetalSidebar({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const currentLabel = SIDEBAR_ITEMS.find((i) => i.id === current)?.label || '取扱い品目';

  return (
    <div className="border rounded-lg bg-white overflow-hidden sticky top-28">
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
      <ul className={`text-sm divide-y ${open ? 'block' : 'hidden'} md:block`}>
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = current === item.id;
          return (
            <li key={item.id}>
              <Link
                href={`/nonmetal#${item.id}`}
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
