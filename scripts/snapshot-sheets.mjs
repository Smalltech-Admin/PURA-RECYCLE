/**
 * 買取価格のスナップショット
 *
 * スプレッドシートの内容を public/data/prices.json に写す。
 * 画面は普段スプレッドシートを直接読む（最新が出る）が、応答が遅い日や
 * 届かない日に、この控えを出して空白を避ける。
 *
 * 経緯（2026-10-06）: 画面の部品ごとに同じCSVを取りに行っており、
 * トップページでは同一URLへの要求が5本同時に飛んで、遅いもので12.5秒かかっていた。
 * 取得を1回にまとめたうえで、保険としてこの控えを用意した。
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHEET = '1EG3IdHz6IAUb7Qb75Dn0SspXoLAEWpOSqc_XqGf_IPk';
const PRICES_PATH = resolve(__dirname, '../public/data/prices.json');
const NEWS_PATH = resolve(__dirname, '../public/data/news.json');

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET}/export?format=csv`;
const NEWS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET}/export?format=csv&gid=1149519436`;

function parseCSVLine(line) {
  const result = [];
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

async function main() {
  const res = await fetch(CSV_URL);
  if (!res.ok) {
    console.error(`スプレッドシートの取得に失敗しました (HTTP ${res.status})`);
    process.exit(1);
  }

  const lines = (await res.text()).trim().split('\n');
  if (lines.length < 2) {
    console.error('スプレッドシートに行がありません。既存の控えを残します。');
    process.exit(1);
  }

  const header = parseCSVLine(lines[0]).map((h) => h.trim());
  const iCat = header.indexOf('category');
  const iSub = header.indexOf('subcategory');
  const iPrice = header.indexOf('price');
  const iUnit = header.indexOf('unit');
  const iNote = header.indexOf('note');
  const iDir = header.indexOf('direction');
  const iHidden = header.findIndex((h) => h.includes('非表示'));
  const iTop = header.findIndex((h) => h.includes('トップ'));
  const get = (cols, i) => (i >= 0 ? cols[i] || '' : '');

  const items = lines.slice(1).map((line) => {
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

  if (items.length === 0) {
    console.error('品目が0件でした。既存の控えを残します。');
    process.exit(1);
  }

  writeFileSync(
    PRICES_PATH,
    JSON.stringify({ fetchedAt: new Date().toISOString(), items }, null, 2),
    'utf-8'
  );
  console.log(`prices.json を更新しました (${items.length}件)`);

  await snapshotNews();
}

// お知らせ。取得できなくても買取価格の控えは残す。
async function snapshotNews() {
  const res = await fetch(NEWS_CSV_URL);
  if (!res.ok) {
    console.error(`お知らせの取得に失敗しました (HTTP ${res.status})`);
    return;
  }
  const lines = (await res.text()).trim().split('\n').slice(1);
  const items = lines
    .map((line) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      return { date: cols[0] || '', title: cols[1] || '', category: cols[2] || '' };
    })
    .filter((item) => item.date && item.title);

  if (items.length === 0) {
    console.error('お知らせが0件でした。既存の控えを残します。');
    return;
  }

  writeFileSync(
    NEWS_PATH,
    JSON.stringify({ fetchedAt: new Date().toISOString(), items }, null, 2),
    'utf-8'
  );
  console.log(`news.json を更新しました (${items.length}件)`);
}

main().catch((e) => {
  console.error('致命的エラー:', e);
  process.exit(1);
});
