'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { fetchPrices, type PriceItem } from '@/lib/getPrices';

export function NonmetalSidebar({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const [prices, setPrices] = useState<PriceItem[] | null>(null);

  useEffect(() => {
    fetchPrices()
      .then(setPrices)
      .catch(() => setPrices([]));
  }, []);

  // サイドバー候補のうち、シートに該当行があり「非表示」でないものだけ（読込中は全件）
  const items = PRODUCTS.filter((p) => {
    if (!p.sidebar) return false;
    if (prices === null) return true;
    const row = prices.find((pr) => pr.subcategory === p.name);
    return row !== undefined && !row.hidden;
  });

  const currentLabel = PRODUCTS.find((i) => i.id === current)?.name || '取扱い品目';

  return (
    <div className="border rounded-none bg-white overflow-hidden sticky top-28">
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
        {items.map((item) => {
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
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
