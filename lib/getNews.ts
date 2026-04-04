export type NewsItem = {
  date: string;
  title: string;
  category: string;
};

const NEWS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1EG3IdHz6IAUb7Qb75Dn0SspXoLAEWpOSqc_XqGf_IPk/export?format=csv&gid=1149519436';

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(NEWS_CSV_URL);
    const text = await res.text();
    const lines = text.trim().split('\n').slice(1);

    return lines
      .map((line) => {
        const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        return {
          date: cols[0] || '',
          title: cols[1] || '',
          category: cols[2] || '',
        };
      })
      .filter((item) => item.date && item.title);
  } catch {
    return [];
  }
}
