export type PriceItem = {
  category: string;
  subcategory: string;
  price: string;
  unit: string;
  note: string;
  updated_at: string;
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Fallback data for when spreadsheet is not configured
const FALLBACK_DATA: PriceItem[] = [
  { category: '銅', subcategory: '1号銅（ピカ銅）', price: '1200', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '銅', subcategory: '2号銅（並銅）', price: '1100', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '銅', subcategory: '並銅', price: '950', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '銅', subcategory: '込銅', price: '800', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '銅', subcategory: '錫(スズ)銅線', price: '700', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '銅', subcategory: '赤釜', price: '600', unit: '円/kg', note: 'ダスト付は減額', updated_at: '2026/03/28' },
  { category: '銅', subcategory: '白釜', price: '500', unit: '円/kg', note: 'ダスト付は減額', updated_at: '2026/03/28' },
  { category: '銅', subcategory: '皮付線（エアコンホース）', price: '400', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '銅', subcategory: 'ダライ・切粉', price: '要問合せ', unit: '-', note: 'お電話ください', updated_at: '2026/03/28' },
  { category: '電線', subcategory: '1本線（高）', price: '800', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: '1本線（中）', price: '600', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: '1本線（低）', price: '400', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: '3本線（高）', price: '750', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: '3本線（中）', price: '550', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: '3本線（低）', price: '350', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: 'VA線（VVFケーブル）', price: '300', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: '家電線', price: '200', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '電線', subcategory: 'ハーネス', price: '150', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'バッテリー', subcategory: '車用', price: '120', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'バッテリー', subcategory: '工業用', price: '100', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'バッテリー', subcategory: 'フォークリフト用', price: '90', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'バッテリー', subcategory: 'シールドバッテリー', price: '80', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'バッテリー', subcategory: 'バイク用', price: '100', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'タカウイ・真鍮', subcategory: 'タカウイ', price: '1000', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'タカウイ・真鍮', subcategory: '混タカウイ', price: '900', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'タカウイ・真鍮', subcategory: 'タカウイダライ', price: '800', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'タカウイ・真鍮', subcategory: '砲金（付物なし）', price: '1500', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'タカウイ・真鍮', subcategory: 'バルブ砲金', price: '1400', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'タカウイ・真鍮', subcategory: '砲金ダライ', price: '1300', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'モーター', subcategory: 'MIX', price: '80', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'モーター', subcategory: 'セルモーター', price: '100', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'モーター', subcategory: 'コンプレッサー', price: '120', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'モーター', subcategory: 'ダイナモ', price: '90', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'ラジエター', subcategory: 'エアコン（ゴルフ）', price: '300', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'ラジエター', subcategory: 'エアコン（ゴム）', price: '250', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'ラジエター', subcategory: 'アルミ（トン）', price: '200', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'ラジエター', subcategory: 'アルミ（トラック）', price: '180', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'ラジエター', subcategory: 'タカウイorアルミ', price: '要問合せ', unit: '-', note: 'お電話ください', updated_at: '2026/03/28' },
  { category: '鉛', subcategory: '鉛', price: '300', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '鉛', subcategory: '鉛板', price: '280', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '鉛', subcategory: '鉛管', price: '260', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '鉛', subcategory: 'バランスウエイト（車）', price: '250', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '鉛', subcategory: 'バランスウエイト（二輪）', price: '240', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'ホイール線', subcategory: 'ホイール線（フル）', price: '150', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: 'ホイール線', subcategory: 'ホイールPP（フル含）', price: '100', unit: '円/kg', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: 'ユニッケル線', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: 'ニクロム線', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: 'ニッタン線', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: 'ノズル', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: '合金(スズ)', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: '炉材', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: 'ハニーブデン', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: '特殊金属', subcategory: '重電', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: 'その他', subcategory: 'ステンレス', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: 'その他', subcategory: '給湯器', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: 'その他', subcategory: 'エアコン', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: 'その他', subcategory: '家庭用ガラ', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: 'その他', subcategory: '工業用ガラ', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: 'その他', subcategory: '安定器', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
  { category: 'その他', subcategory: '基板', price: '要問合せ', unit: '-', note: '-', updated_at: '2026/03/28' },
];

export async function getPrices(): Promise<PriceItem[]> {
  const url = process.env.SPREADSHEET_CSV_URL;

  if (!url || url.includes('PLACEHOLDER')) {
    return FALLBACK_DATA;
  }

  try {
    const res = await fetch(url, {
      next: { tags: ['prices'] },
    });
    const text = await res.text();

    const lines = text.trim().split('\n').slice(1);
    return lines.map((line) => {
      const cols = parseCSVLine(line);
      return {
        category: cols[0] || '',
        subcategory: cols[1] || '',
        price: cols[2] || '',
        unit: cols[3] || '',
        note: cols[4] || '',
        updated_at: cols[5] || '',
      };
    });
  } catch {
    return FALLBACK_DATA;
  }
}

export async function getPricesByCategory(category: string): Promise<PriceItem[]> {
  const all = await getPrices();
  return all.filter((item) => item.category === category);
}
