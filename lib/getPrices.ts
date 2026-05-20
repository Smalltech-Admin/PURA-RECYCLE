export type PriceItem = {
  category: string;
  subcategory: string;
  price: string;
  unit: string;
  note: string;
  direction: string;
  /** G列「一覧非表示」が「非表示」のとき true（一覧・ページ・サイドバーから隠す） */
  hidden: boolean;
  /** H列「トップ3件表示」が「表示」のとき true（トップ上部に表示） */
  top: boolean;
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

const SPREADSHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1EG3IdHz6IAUb7Qb75Dn0SspXoLAEWpOSqc_XqGf_IPk/export?format=csv';

export async function fetchPrices(): Promise<PriceItem[]> {
  try {
    const res = await fetch(SPREADSHEET_CSV_URL);
    const text = await res.text();

    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    // ヘッダー名で列位置を解決（列の追加・削除・並び替えに強い）
    const header = parseCSVLine(lines[0]).map((h) => h.trim());
    const iCat = header.indexOf('category');
    const iSub = header.indexOf('subcategory');
    const iPrice = header.indexOf('price');
    const iUnit = header.indexOf('unit');
    const iNote = header.indexOf('note');
    const iDir = header.indexOf('direction');
    const iHidden = header.findIndex((h) => h.includes('非表示'));
    const iTop = header.findIndex((h) => h.includes('トップ'));
    const get = (cols: string[], i: number) => (i >= 0 ? cols[i] || '' : '');

    return lines.slice(1).map((line) => {
      const cols = parseCSVLine(line);
      return {
        category: get(cols, iCat),
        subcategory: get(cols, iSub),
        price: get(cols, iPrice),
        unit: get(cols, iUnit),
        note: get(cols, iNote),
        direction: get(cols, iDir),
        hidden: get(cols, iHidden).trim() === '非表示',
        top: get(cols, iTop).trim() === '表示',
      };
    });
  } catch {
    return [];
  }
}

export function filterByCategory(items: PriceItem[], category: string): PriceItem[] {
  return items.filter((item) => item.category === category);
}
