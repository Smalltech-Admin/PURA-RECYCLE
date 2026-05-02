'use client';

import { useEffect, useState } from 'react';
import { fetchTatene, type TateneItem } from '@/lib/getTatene';

export function TateneBar() {
  const [items, setItems] = useState<TateneItem[]>([]);

  useEffect(() => {
    fetchTatene().then(setItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 h-full">
      <h3 className="font-bold text-sm text-gray-700 mb-2 border-b border-yellow-300 pb-1">
        相場建値情報（円/トン）
      </h3>
      <ul className="text-base space-y-2">
        {items.map((item) => (
          <li key={item.metal}>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-bold text-base">{item.metal}</span>
              <span className="flex items-center gap-1">
                <span
                  className={
                    item.direction === '⇧'
                      ? 'text-red-600 font-bold text-lg'
                      : item.direction === '⇩'
                        ? 'text-blue-600 font-bold text-lg'
                        : 'text-gray-500 text-lg'
                  }
                >
                  {item.direction}
                </span>
                <strong className="text-gray-800 text-lg">
                  {(Number(item.price) / 10000).toFixed(1)}万
                </strong>
              </span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {item.date && <span>{item.date} 現在</span>}
              {item.date && item.source && <span> / </span>}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {item.source}
                </a>
              ) : (
                <span>{item.source}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
