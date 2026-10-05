'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTatene, type TateneItem } from '@/lib/getTatene';

/**
 * variant='pc'（既定）: 各項目に日付＋参照元を表示（従来表示）
 * variant='mobile': 日付をタイトル下に1つだけ・参照元なし・文字大
 */
export function TateneBar({ variant = 'pc' }: { variant?: 'pc' | 'mobile' }) {
  const [items, setItems] = useState<TateneItem[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'unavailable'>('loading');

  useEffect(() => {
    fetchTatene().then((result) => {
      if (result.status === 'ok') {
        setItems(result.items);
        setState('ok');
      } else {
        setState('unavailable');
      }
    });
  }, []);

  const isMobile = variant === 'mobile';

  // 取得中は何も出さない（一瞬だけ枠が出て消えるのを避ける）
  if (state === 'loading') return null;

  // 取得できなかったとき。価格も日付も出さない。
  // 古い値を「現在」として出すと、利用者はそれを根拠に判断してしまう。
  if (state === 'unavailable') {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-none p-3 h-full flex flex-col">
        <h3
          className={`font-bold text-gray-700 border-b border-yellow-300 pb-1 shrink-0 ${
            isMobile ? 'text-base' : 'text-sm'
          }`}
        >
          相場建値情報（円/トン）
        </h3>
        <div className="flex-1 flex flex-col justify-center gap-2 py-2">
          <p className={`text-gray-700 ${isMobile ? 'text-base' : 'text-sm'}`}>
            只今、建値を取得できません。
            <br />
            お手数ですが直接お問い合わせください。
          </p>
          <Link
            href="/contact"
            className={`text-blue-600 hover:underline font-bold ${
              isMobile ? 'text-base' : 'text-sm'
            }`}
          >
            お問い合わせはこちら
          </Link>
        </div>
      </div>
    );
  }

  const tateneDate = items.find((i) => i.date)?.date;

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-none p-3 h-full flex flex-col">
      <h3
        className={`font-bold text-gray-700 border-b border-yellow-300 pb-1 shrink-0 ${
          isMobile ? 'text-base' : 'text-sm'
        }`}
      >
        相場建値情報（円/トン）
      </h3>
      {/* モバイル: 日付をタイトル下に1つだけ表示 */}
      {isMobile && tateneDate && (
        <p className="text-xs text-gray-500 mt-1 mb-1 shrink-0">{tateneDate} 現在</p>
      )}
      <ul className="flex-1 flex flex-col justify-around gap-2">
        {items.map((item) => (
          <li key={item.metal}>
            <div className="flex justify-between items-center">
              <span className={`text-gray-700 font-bold ${isMobile ? 'text-lg' : 'text-base'}`}>
                {item.metal}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className={
                    (item.direction === '⇧'
                      ? 'text-red-600 font-bold '
                      : item.direction === '⇩'
                        ? 'text-blue-600 font-bold '
                        : 'text-gray-500 ') + (isMobile ? 'text-xl' : 'text-lg')
                  }
                >
                  {item.direction}
                </span>
                <strong className={`text-gray-800 ${isMobile ? 'text-xl' : 'text-lg'}`}>
                  {(Number(item.price) / 10000).toFixed(1)}万
                </strong>
              </span>
            </div>
            {/* PC: 各項目に日付＋参照元を表示 */}
            {!isMobile && (
              <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
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
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
