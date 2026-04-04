/**
 * 建値スクレイピングスクリプト
 * GitHub Actionsで毎日実行し、public/data/tatene.json を更新する
 *
 * ソース:
 * - 銅: JX金属 https://www.jx-nmm.com/cuprice/
 * - 鉛: 三菱マテリアル JSファイルから変数抽出
 * - 亜鉛: 三井金属 https://www.mitsui-kinzoku.com/aen/
 */

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../public/data/tatene.json');

const SOURCE_URLS = {
  '銅': 'https://www.jx-nmm.com/cuprice/',
  '鉛': 'https://www.mmc.co.jp/corporate/ja/product/metalprice/lead-price.html',
  '亜鉛': 'https://www.mitsui-kinzoku.com/aen/',
};

// 前回データを読み込み（方向の比較用）
function loadPrevious() {
  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function getDirection(current, previous) {
  if (!previous) return '→';
  const c = Number(current);
  const p = Number(previous);
  if (c > p) return '⇧';
  if (c < p) return '⇩';
  return '→';
}

// 銅建値: JX金属
async function scrapeCopperPrice() {
  try {
    const res = await fetch('https://www.jx-nmm.com/cuprice/');
    const html = await res.text();

    // 年と月日が分離: accordion_label に年、cell-style2 に月日
    let priceDate = null;
    const yearMatch = html.match(/is-default-open[\s\S]*?accordion_label[^>]*>(\d{4})年/);
    if (yearMatch) {
      const section = html.match(/is-default-open[\s\S]*?<!--\/accordion-layout-->/);
      if (section) {
        const dates = [...section[0].matchAll(/cell-style2[^>]*>\s*(\d{1,2})月(\d{1,2})日/g)];
        if (dates.length > 0) {
          const last = dates[dates.length - 1];
          priceDate = `${yearMatch[1]}/${last[1].padStart(2, '0')}/${last[2].padStart(2, '0')}`;
        }
      }
    }

    const priceMatches = html.match(/[\d,]+,000/g);
    if (priceMatches && priceMatches.length > 0) {
      const prices = priceMatches
        .map(p => Number(p.replace(/,/g, '')))
        .filter(p => p >= 100000);

      if (prices.length > 0) {
        return { price: String(prices[0]), source: 'JX金属', date: priceDate };
      }
    }
    console.error('銅: 価格パターンが見つかりません');
    return null;
  } catch (e) {
    console.error('銅スクレイピングエラー:', e.message);
    return null;
  }
}

// 鉛建値: 三菱マテリアル（JSファイルから変数抽出）
async function scrapeLeadPrice() {
  try {
    const res = await fetch('https://www.mmc.co.jp/corporate/ja/js/metalprice_lead.js');
    const js = await res.text();

    const priceMatch = js.match(/f_pricelValue\s*=\s*(\d+)/);
    // 日付: const f_pricelDate = '2026-04-01';
    const dateMatch = js.match(/f_pricelDate\s*=\s*'(\d{4})-(\d{2})-(\d{2})'/);
    const priceDate = dateMatch
      ? `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`
      : null;

    if (priceMatch) {
      return { price: priceMatch[1], source: '三菱マテリアル', date: priceDate };
    }
    console.error('鉛: 価格パターンが見つかりません');
    return null;
  } catch (e) {
    console.error('鉛スクレイピングエラー:', e.message);
    return null;
  }
}

// 亜鉛建値: 三井金属
async function scrapeZincPrice() {
  try {
    const res = await fetch('https://www.mitsui-kinzoku.com/aen/');
    const html = await res.text();

    // 年と月日が分離: th rowspan に年、td に月日
    // 全ての年を取得し、最新（最大）の年を使用
    let priceDate = null;
    const yearMatches = [...html.matchAll(/(\d{4})年\s*<\/th>/g)];
    if (yearMatches.length > 0) {
      const years = yearMatches.map(m => Number(m[1]));
      const latestYear = Math.max(...years);
      // 最新年の直後にある最初の月日を取得
      const pattern = new RegExp(latestYear + '年[\\s\\S]*?(\\d{1,2})月(\\d{1,2})日');
      const dateMatch = html.match(pattern);
      if (dateMatch) {
        priceDate = `${latestYear}/${dateMatch[1].padStart(2, '0')}/${dateMatch[2].padStart(2, '0')}`;
      }
    }

    const priceMatches = html.match(/[\d,]+,\d{3}/g);
    if (priceMatches && priceMatches.length > 0) {
      const prices = priceMatches
        .map(p => Number(p.replace(/,/g, '')))
        .filter(p => p >= 100000 && p < 10000000);

      if (prices.length > 0) {
        return { price: String(prices[0]), source: '三井金属', date: priceDate };
      }
    }
    console.error('亜鉛: 価格パターンが見つかりません');
    return null;
  } catch (e) {
    console.error('亜鉛スクレイピングエラー:', e.message);
    return null;
  }
}

async function main() {
  console.log('建値スクレイピング開始...');

  const prev = loadPrevious();
  const prevMap = {};
  for (const item of prev) {
    prevMap[item.metal] = item.price;
  }

  const [copper, lead, zinc] = await Promise.all([
    scrapeCopperPrice(),
    scrapeLeadPrice(),
    scrapeZincPrice(),
  ]);

  const result = [];

  if (copper) {
    result.push({
      metal: '銅',
      price: copper.price,
      direction: getDirection(copper.price, prevMap['銅']),
      source: copper.source,
      url: SOURCE_URLS['銅'],
      date: copper.date || '',
    });
    console.log(`銅: ${Number(copper.price).toLocaleString()}円/t (${copper.date})`);
  }

  if (lead) {
    result.push({
      metal: '鉛',
      price: lead.price,
      direction: getDirection(lead.price, prevMap['鉛']),
      source: lead.source,
      url: SOURCE_URLS['鉛'],
      date: lead.date || '',
    });
    console.log(`鉛: ${Number(lead.price).toLocaleString()}円/t (${lead.date})`);
  }

  if (zinc) {
    result.push({
      metal: '亜鉛',
      price: zinc.price,
      direction: getDirection(zinc.price, prevMap['亜鉛']),
      source: zinc.source,
      url: SOURCE_URLS['亜鉛'],
      date: zinc.date || '',
    });
    console.log(`亜鉛: ${Number(zinc.price).toLocaleString()}円/t (${zinc.date})`);
  }

  if (result.length === 0) {
    console.error('全てのスクレイピングに失敗。既存データを維持します。');
    process.exit(1);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`tatene.json を更新しました (${result.length}件)`);
}

main().catch((e) => {
  console.error('致命的エラー:', e);
  process.exit(1);
});
