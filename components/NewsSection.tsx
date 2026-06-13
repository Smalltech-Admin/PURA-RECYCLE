'use client';

import { useEffect, useState } from 'react';
import { fetchNews, type NewsItem } from '@/lib/getNews';

export function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchNews().then((data) => {
      const sorted = data.sort((a, b) => b.date.localeCompare(a.date));
      setItems(sorted.slice(0, 4));
    });
  }, []);

  return (
    <div className="border rounded-none p-4 bg-white">
      <h3 className="font-bold mb-3 text-sm text-gray-700 border-b border-brand pb-2">
        新着情報
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 animate-pulse">読み込み中...</p>
      ) : (
        <ul className="text-sm space-y-2">
          {items.map((n, i) => (
            <li key={i} className="flex gap-3 items-center">
              <span className="text-gray-400 whitespace-nowrap">{n.date}</span>
              {n.category && (
                <span className="text-xs bg-brand text-[color:var(--c-on-brand)] px-2 py-0.5 rounded-none whitespace-nowrap self-center">
                  {n.category}
                </span>
              )}
              <span className="text-gray-700">{n.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
