export type TateneItem = {
  metal: string;
  price: string;
  direction: string;
  source: string;
  url: string;
  date: string;
};

const FALLBACK_DATA: TateneItem[] = [
  { metal: '銅', price: '2040000', direction: '⇧', source: 'JX金属', url: 'https://www.jx-nmm.com/cuprice/', date: '2026/04/04' },
  { metal: '鉛', price: '366000', direction: '⇧', source: '三菱マテリアル', url: 'https://www.mmc.co.jp/corporate/ja/product/metalprice/lead-price.html', date: '2026/04/04' },
  { metal: '亜鉛', price: '571000', direction: '→', source: '三井金属', url: 'https://www.mitsui-kinzoku.com/aen/', date: '2026/04/04' },
];

export async function fetchTatene(): Promise<TateneItem[]> {
  try {
    const res = await fetch('/data/tatene.json', { cache: 'no-store' });
    if (!res.ok) return FALLBACK_DATA;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return FALLBACK_DATA;
  } catch {
    return FALLBACK_DATA;
  }
}
