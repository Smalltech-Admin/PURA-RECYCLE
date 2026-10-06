'use client';

import { useEffect, useState } from 'react';
import { filterByCategory, subscribePrices, type PriceItem } from './getPrices';

/**
 * 価格を購読する。取得はページ全体で1回だけで、結果は全部品で共有される。
 * 部品ごとに取りに行くと同じURLへ要求が重なり、かえって遅くなる。
 */
export function usePrices() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribePrices((items) => {
      setPrices(items);
      setLoading(false);
    });
  }, []);

  return { prices, loading };
}

export function usePricesByCategory(category: string) {
  const { prices, loading } = usePrices();
  return { items: filterByCategory(prices, category), loading };
}
