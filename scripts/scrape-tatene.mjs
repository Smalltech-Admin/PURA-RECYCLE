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

// 価格の妥当域（円/トン）。
// 月間平均推移などの別表から拾った値を公開してしまう事故を止めるための歯止め。
// 2026-10 時点の実勢: 銅 約237万 / 鉛 約36万 / 亜鉛 約68万。
const PRICE_RANGE = {
  '銅': [500000, 5000000],
  '鉛': [150000, 1000000],
  '亜鉛': [200000, 2000000],
};

function inRange(metal, price) {
  const [min, max] = PRICE_RANGE[metal];
  const v = Number(price);
  return Number.isFinite(v) && v >= min && v <= max;
}

function stripTags(s) {
  return s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
}

// 銅建値: JX金属
// 「最近の銅建値改定の履歴」の最新年（既定で開いているアコーディオン）から、
// 改定日と建値を同じ行で取る。ページ上部の「月間平均推移」表と取り違えないこと。
async function scrapeCopperPrice() {
  try {
    const res = await fetch('https://www.jx-nmm.com/cuprice/');
    const html = await res.text();

    const yearMatch = html.match(/is-default-open[\s\S]*?accordion_label[^>]*>(\d{4})年/);
    const section = html.match(/is-default-open[\s\S]*?<!--\/accordion-layout-->/);
    if (!yearMatch || !section) {
      console.error('銅: 改定履歴のセクションが見つかりません');
      return null;
    }

    // 改定日（th）と建値（td）の対を、同じ行から取る。表は日付の昇順なので末尾が最新。
    const rows = [
      ...section[0].matchAll(
        /cell-style2[^>]*>\s*(\d{1,2})月(\d{1,2})日\s*<\/th>\s*<td[^>]*>\s*([\d,]+)\s*円/g
      ),
    ];
    if (rows.length === 0) {
      console.error('銅: 改定日と建値の対が見つかりません');
      return null;
    }

    const last = rows[rows.length - 1];
    const price = last[3].replace(/,/g, '');
    const date = `${yearMatch[1]}/${last[1].padStart(2, '0')}/${last[2].padStart(2, '0')}`;

    if (!inRange('銅', price)) {
      console.error(`銅: 価格が妥当域の外です (${price})`);
      return null;
    }
    return { price, source: 'JX金属', date };
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
      if (!inRange('鉛', priceMatch[1])) {
        console.error(`鉛: 価格が妥当域の外です (${priceMatch[1]})`);
        return null;
      }
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
// 改定履歴の表（改定日と建値が同じ行にある表）の先頭行が最新。
// ページ上部の「月間平均推移」表と取り違えないこと。
async function scrapeZincPrice() {
  try {
    const res = await fetch('https://www.mitsui-kinzoku.com/aen/');
    const html = await res.text();

    const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((m) => m[0]);
    // 「◯月◯日」を含む表＝改定履歴（月間平均推移は「◯月」までで日が無い）
    const history = tables.find((t) => /\d{1,2}月\s*\d{1,2}日/.test(t));
    if (!history) {
      console.error('亜鉛: 改定履歴の表が見つかりません');
      return null;
    }

    const yearMatch = history.match(/(\d{4})年/);
    if (!yearMatch) {
      console.error('亜鉛: 年が見つかりません');
      return null;
    }

    // 行ごとに見て、改定日と建値が揃う最初の行を採る（表は日付の降順）
    for (const row of history.matchAll(/<tr[\s\S]*?<\/tr>/g)) {
      const text = stripTags(row[0]);
      const dateMatch = text.match(/(\d{1,2})月\s*(\d{1,2})日/);
      const priceMatch = text.match(/(\d{1,3}(?:,\d{3})+)/);
      if (!dateMatch || !priceMatch) continue;

      const price = priceMatch[1].replace(/,/g, '');
      const date = `${yearMatch[1]}/${dateMatch[1].padStart(2, '0')}/${dateMatch[2].padStart(2, '0')}`;

      if (!inRange('亜鉛', price)) {
        console.error(`亜鉛: 価格が妥当域の外です (${price})`);
        return null;
      }
      return { price, source: '三井金属', date };
    }

    console.error('亜鉛: 改定日と建値の対が見つかりません');
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
    prevMap[item.metal] = item;
  }

  const [copper, lead, zinc] = await Promise.all([
    scrapeCopperPrice(),
    scrapeLeadPrice(),
    scrapeZincPrice(),
  ]);

  const scraped = { '銅': copper, '鉛': lead, '亜鉛': zinc };
  const result = [];
  const failed = [];

  for (const metal of ['銅', '鉛', '亜鉛']) {
    const got = scraped[metal];

    if (got) {
      result.push({
        metal,
        price: got.price,
        direction: getDirection(got.price, prevMap[metal]?.price),
        source: got.source,
        url: SOURCE_URLS[metal],
        date: got.date || '',
      });
      console.log(`${metal}: ${Number(got.price).toLocaleString()}円/t (${got.date})`);
      continue;
    }

    // 取得できなかった金属は、前回値を残す。
    // 消すと画面からその金属が丸ごと消え、利用者には理由が分からないため。
    failed.push(metal);
    if (prevMap[metal]) {
      result.push(prevMap[metal]);
      console.log(`${metal}: 取得失敗。前回値を据え置き (${prevMap[metal].price} / ${prevMap[metal].date})`);
    }
  }

  if (failed.length > 0) {
    // GitHub Actions の注釈として出す（ジョブは落とさず、後続のデプロイは走らせる）
    console.log(`::error::建値の取得に失敗: ${failed.join(', ')}。該当ページの構造が変わった可能性があります。`);
  }

  if (result.length === 0) {
    console.error('全てのスクレイピングに失敗し、前回値もありません。');
    process.exit(1);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`tatene.json を更新しました (${result.length}件)`);
}

main().catch((e) => {
  console.error('致命的エラー:', e);
  process.exit(1);
});
