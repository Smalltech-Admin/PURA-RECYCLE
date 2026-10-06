import { createSheetSource } from './sheetSource';

export type NewsItem = {
  date: string;
  title: string;
  category: string;
};

const NEWS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1EG3IdHz6IAUb7Qb75Dn0SspXoLAEWpOSqc_XqGf_IPk/export?format=csv&gid=1149519436';

function parseNewsCSV(text: string): NewsItem[] {
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
}

export const subscribeNews = createSheetSource<NewsItem>({
  storeKey: '__puraRecycleNews',
  liveUrl: NEWS_CSV_URL,
  snapshotPath: '/data/news.json',
  parse: parseNewsCSV,
});
