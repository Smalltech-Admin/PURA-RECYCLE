'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Point = { ym: string; value: number };
type History = { series: Record<string, Point[]> };

const METALS = ['銅', '鉛', '亜鉛'] as const;

// 表示する期間（月）。3金属のうち亜鉛が2023年からなので、揃う範囲に合わせている。
const WINDOW_MONTHS = 36;

// 単系列なので色は3図とも同じ。識別のための色分けは不要で、
// 図ごとに色を変えると意味の無い色数が増える。
// #5a8a30 はサイトの既存トークン（--c-card-border）。
const LINE_COLOR = '#5a8a30';

// SVG内部の座標系。幅は100%に伸ばす。
const W = 320;
const H = 140;
const PAD = { top: 12, right: 12, bottom: 22, left: 46 };

function toMan(value: number): string {
  return `${(value / 10000).toFixed(0)}万`;
}

function labelYm(ym: string): string {
  const [y, m] = ym.split('-');
  return `${y}年${Number(m)}月`;
}

function Chart({ metal, points }: { metal: string; points: Point[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const geom = useMemo(() => {
    const values = points.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // 上下に少し余白を取る。min==max でも潰れないようにする。
    const span = max - min || Math.max(max * 0.1, 1);
    const lo = min - span * 0.12;
    const hi = max + span * 0.12;

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const x = (i: number) =>
      PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = (v: number) => PAD.top + innerH - ((v - lo) / (hi - lo)) * innerH;

    return { min, max, lo, hi, x, y, innerW, innerH };
  }, [points]);

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${geom.x(i)} ${geom.y(p.value)}`).join(' ');
  const last = points[points.length - 1];

  // 年が変わる位置に目盛りを置く
  const yearTicks = points
    .map((p, i) => ({ i, year: p.ym.slice(0, 4), month: p.ym.slice(5) }))
    .filter((t) => t.month === '01');

  const onMove = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * W;
    const ratio = (svgX - PAD.left) / geom.innerW;
    const i = Math.round(ratio * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, i)));
  };

  const active = hover !== null ? points[hover] : null;

  return (
    <div className="bg-white border border-gray-200 p-3">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="text-sm font-bold text-gray-700">{metal}</h3>
        <p className="text-xs text-gray-500">
          <span className="text-base font-bold text-gray-800">{toMan(last.value)}</span>
          <span className="ml-1">円/トン（{labelYm(last.ym)}平均）</span>
        </p>
      </div>

      <div className="relative">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto touch-none"
          role="img"
          aria-label={`${metal}の月間平均建値の推移。${labelYm(points[0].ym)}から${labelYm(last.ym)}まで。最安 ${toMan(geom.min)}円、最高 ${toMan(geom.max)}円、直近 ${toMan(last.value)}円。`}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => onMove(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={() => setHover(null)}
        >
          {/* 目盛り線は実線のヘアライン。破線にすると閾値や予測に見える */}
          {[geom.hi, (geom.hi + geom.lo) / 2, geom.lo].map((v, i) => (
            <line
              key={i}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={geom.y(v)}
              y2={geom.y(v)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          ))}

          {/* 縦軸は最高と最安だけ。全点に数値を振らない */}
          <text x={PAD.left - 6} y={geom.y(geom.max) + 3} textAnchor="end" fontSize={9} fill="#6b7280">
            {toMan(geom.max)}
          </text>
          <text x={PAD.left - 6} y={geom.y(geom.min) + 3} textAnchor="end" fontSize={9} fill="#6b7280">
            {toMan(geom.min)}
          </text>

          {yearTicks.map((t) => (
            <text key={t.i} x={geom.x(t.i)} y={H - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">
              {t.year}
            </text>
          ))}

          <path d={path} fill="none" stroke={LINE_COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* 直近の点だけ印を付ける */}
          <circle cx={geom.x(points.length - 1)} cy={geom.y(last.value)} r={4} fill={LINE_COLOR} stroke="#ffffff" strokeWidth={2} />

          {active && hover !== null && (
            <>
              <line
                x1={geom.x(hover)}
                x2={geom.x(hover)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <circle cx={geom.x(hover)} cy={geom.y(active.value)} r={4} fill={LINE_COLOR} stroke="#ffffff" strokeWidth={2} />
            </>
          )}
        </svg>

        {active && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 flex justify-center">
            <span className="bg-gray-800 text-white text-xs px-2 py-1 whitespace-nowrap">
              {labelYm(active.ym)}　{active.value.toLocaleString()}円/トン
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TateneHistory() {
  const [history, setHistory] = useState<History | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'unavailable'>('loading');

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/data/tatene-history.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('not ok'))))
      .then((data) => {
        if (data?.series && Object.keys(data.series).length > 0) {
          setHistory(data);
          setState('ok');
        } else {
          setState('unavailable');
        }
      })
      .catch(() => setState('unavailable'));
  }, []);

  if (state !== 'ok' || !history) return null;

  const charts = METALS.map((metal) => {
    const all = history.series[metal] ?? [];
    return { metal, points: all.slice(-WINDOW_MONTHS) };
  }).filter((c) => c.points.length >= 2);

  if (charts.length === 0) return null;

  // 数値でも読めるようにする。ツールチップだけが値への経路にならないようにするため。
  const tableMonths = charts[0].points.slice(-12).map((p) => p.ym);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-3">
      <h2 className="text-sm font-bold text-gray-700 mb-2 border-b-2 border-brand pb-1">
        建値の推移（月間平均・円/トン）
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {charts.map((c) => (
          <Chart key={c.metal} metal={c.metal} points={c.points} />
        ))}
      </div>

      <details className="mt-2">
        <summary className="text-xs text-gray-600 cursor-pointer hover:underline">
          数値で見る（直近12ヶ月）
        </summary>
        <div className="overflow-x-auto mt-2">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-200 px-2 py-1 text-left font-bold">年月</th>
                {charts.map((c) => (
                  <th key={c.metal} className="border border-gray-200 px-2 py-1 text-right font-bold">
                    {c.metal}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableMonths.map((ym) => (
                <tr key={ym}>
                  <td className="border border-gray-200 px-2 py-1 whitespace-nowrap">{labelYm(ym)}</td>
                  {charts.map((c) => {
                    const p = c.points.find((x) => x.ym === ym);
                    return (
                      <td key={c.metal} className="border border-gray-200 px-2 py-1 text-right tabular-nums">
                        {p ? p.value.toLocaleString() : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="text-[10px] text-gray-400 mt-1">
        出典: 銅 JX金属 / 鉛 三菱マテリアル / 亜鉛 三井金属（各社が公表する月間平均）
      </p>
    </section>
  );
}
