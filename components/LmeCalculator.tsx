'use client';

import { useState, useEffect } from 'react';

export function LmeCalculator() {
  const [lme, setLme] = useState('');
  const [forex, setForex] = useState('');
  const [nowStr, setNowStr] = useState('');
  const result =
    lme && forex ? ((Number(lme) * Number(forex)) / 10000).toFixed(1) : null;

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const h = now.getHours();
    const min = String(now.getMinutes()).padStart(2, '0');
    const ampm = h < 12 ? '午前' : '午後';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    setNowStr(`${y}年${m}月${d}日 ${ampm}${h12}時${min}分現在`);
  }, []);

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-2 md:p-3">
        <h3 className="font-bold mb-1 md:mb-2 text-xs md:text-sm text-gray-700">仮定銅建値計算ツール</h3>
        <div className="flex md:flex-row flex-col gap-1 md:gap-2 md:items-center md:flex-wrap text-xs md:text-sm">
          <label className="text-gray-600 text-[11px] md:text-sm">LME（$/t）</label>
          <input
            type="number"
            value={lme}
            onChange={(e) => setLme(e.target.value)}
            className="border rounded px-2 py-1 w-full md:w-28 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="例: 9500"
          />
          <label className="text-gray-600 text-[11px] md:text-sm">為替(TTS)</label>
          <input
            type="number"
            value={forex}
            onChange={(e) => setForex(e.target.value)}
            className="border rounded px-2 py-1 w-full md:w-24 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="例: 150"
          />
          <span className="text-gray-500 hidden md:inline">円/ドル</span>
        </div>
        {result && (
          <p className="mt-2 text-sm md:text-lg font-bold text-brand-dark">
            → 建値：{result}万円/t
          </p>
        )}
      </div>
      {/* Kitco 24hr Copper Chart - PCのみ表示 */}
      <div className="hidden md:block px-3 pb-3">
        <a
          href="https://www.kitco.com/charts/livecopper.html"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.kitconet.com/charts/metals/base/copper-d.gif"
            alt="24hr Copper Chart - Kitco"
            className="w-full h-auto rounded border border-gray-200"
          />
        </a>
        <p className="text-[9px] text-gray-400 mt-1 text-center">
          <a
            href="https://www.kitco.com/charts/livecopper.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Chart: www.kitco.com
          </a>
        </p>
        {nowStr && (
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            為替(TTS):{nowStr}
          </p>
        )}
      </div>
    </div>
  );
}
