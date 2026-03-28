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

const SPREADSHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1EG3IdHz6IAUb7Qb75Dn0SspXoLAEWpOSqc_XqGf_IPk/export?format=csv';

export async function fetchPrices(): Promise<PriceItem[]> {
  try {
    const res = await fetch(SPREADSHEET_CSV_URL);
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
    return [];
  }
}

export function filterByCategory(items: PriceItem[], category: string): PriceItem[] {
  return items.filter((item) => item.category === category);
}
