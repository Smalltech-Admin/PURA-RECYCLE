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
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2 md:p-3 h-full flex flex-col">
      <h3 className="font-bold text-xs md:text-sm text-gray-700 mb-1 md:mb-2 border-b border-yellow-300 pb-1 shrink-0">
        相場建値情報（円/トン）
      </h3>
      <ul className="flex-1 flex flex-col justify-around gap-1 md:gap-2">
        {items.map((item) => (
          <li key={item.metal}>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-bold text-xs md:text-base">{item.metal}</span>
              <span className="flex items-center gap-1">
                <span
                  className={
                    item.direction === '⇧'
                      ? 'text-red-600 font-bold text-sm md:text-lg'
                      : item.direction === '⇩'
                        ? 'text-blue-600 font-bold text-sm md:text-lg'
                        : 'text-gray-500 text-sm md:text-lg'
                  }
                >
                  {item.direction}
                </span>
                <strong className="text-gray-800 text-sm md:text-lg">
                  {(Number(item.price) / 10000).toFixed(1)}万
                </strong>
              </span>
            </div>
            <div className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 leading-tight">
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
