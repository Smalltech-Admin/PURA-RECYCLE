'use client';

import { useState, useEffect } from 'react';
import { fetchPrices, filterByCategory, type PriceItem } from './getPrices';

export function usePricesByCategory(category: string) {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices()
      .then((all) => setItems(filterByCategory(all, category)))
      .finally(() => setLoading(false));
  }, [category]);

  return { items, loading };
}
