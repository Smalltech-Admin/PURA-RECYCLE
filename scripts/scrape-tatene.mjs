/**
 * 建値スクレイピングスクリプト
 * GitHub Actionsで毎日実行し、public/data/tatene.json を更新する
 *
 * ソース:
 * - 銅: JX金属 https://www.jx-nmm.com/cuprice/
 * - 鉛: 三菱マテリアル JSファイルから変数抽出
 * - 亜鉛: 三井金属 https://www.mitsui-kinzoku.com/aen/
 *
 * 過去の事故（2026-04〜2026-10）:
 * ページ全体から最初に見つかった金額を採っていたため、「建値改定の履歴」ではなく
 * ページ上部の「月間平均推移」表の値を拾い、銅 870,000円/t（実勢 2,370,000円/t）、
 * 亜鉛 482,600円/t（実勢 682,000円/t）を半年間公開していた。
 * 日付は改定履歴から正しく取れていたため、画面には「最新の日付＋数年前の価格」と出ていた。
 *
 * 同じ失敗を繰り返さないための原則:
 * 価格は必ず「日付と同じ行」から取る。ページ全体や表全体を対象に数値を探さない。
 */

import { writeFileSync, readFileSync, appendFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../public/data/tatene.json');

const SOURCE_URLS = {
  '銅': 'https://www.jx-nmm.com/cuprice/',
  '鉛': 'https://www.mmc.co.jp/corporate/ja/product/metalprice/lead-price.html',
  '亜鉛': 'https://www.mitsui-kinzoku.com/aen/',
};

// 価格の妥当域（円/トン）。桁違いやパース崩壊を止めるための歯止めであって、
// 「もっともらしいが古い値」は捕まえられない（上記の事故は域の内側だった）。
// 2026-10 時点の実勢: 銅 約237万 / 鉛 約36万 / 亜鉛 約68万。
// 相場が5年で2〜3倍動きうるため、2029年を目安に見直すこと。
const PRICE_RANGE = {
  '銅': [500000, 5000000],
  '鉛': [150000, 1000000],
  '亜鉛': [200000, 2000000],
};

// 改定日がこれより古ければ採用しない。古い年の表を掴んだ場合の最後の砦。
// 建値は3社とも最低でも月初に改定されるため、90日空くこと自体が異常。
const MAX_AGE_DAYS = 90;

// 前回値からこの割合を超えて動いたら報告する（値は採用する）。
// 拒否にはしない。正しい値を捨てて古い価格を掲示し続ける方が害が大きいため。
const CHANGE_WARN_RATIO = 0.2;

// 取り違え検知。取得元ページが自分で載せている「月間平均」と突き合わせ、
// これを超えて食い違うなら別の表から拾ったとみなして採用しない。
//
// 実測（2026-10-05）:
//   正しい値   銅 0.7% / 亜鉛 0.0% / 鉛 0.3%
//   過去のバグ値 銅 63.0% / 亜鉛 29.2%
// 相場が1ヶ月で20%動くのは歴史的な急変時に限られる。その場合は採用を見送り、
// 前回値を据え置いたうえでジョブを落として知らせる（黙って誤値を出さない）。
const CROSS_CHECK_RATIO = 0.2;

// 状態ファイル。建値そのものとは別に「最後に確認できた日時」を持つ。
// 改定が無い日と、取得できていない日を、画面と運用の両方で区別するため。
const STATUS_PATH = resolve(__dirname, '../public/data/tatene-status.json');

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

function inRange(metal, price) {
  const [min, max] = PRICE_RANGE[metal];
  const v = Number(price);
  return Number.isFinite(v) && v >= min && v <= max;
}

// 'YYYY/MM/DD' が MAX_AGE_DAYS 以内か
function isFresh(date) {
  const m = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(date ?? '');
  if (!m) return false;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const ageDays = (Date.now() - t) / 86400000;
  return ageDays >= -1 && ageDays <= MAX_AGE_DAYS;
}

function stripTags(s) {
  return s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// 取得元ページが載せている「月間平均推移」の表から、直近の月の平均を取る。
// 表の形は JX金属・三井金属で共通（1行目が年の見出し、以降が月ごとの行）。
// 年の列数と同じ数の数値を持つ最後の月の行が、最新年の直近の確定値。
function latestMonthlyAverage(html) {
  const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((m) => m[0]);
  for (const table of tables) {
    const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((m) => m[0]);
    if (rows.length === 0) continue;

    const years = [...stripTags(rows[0]).matchAll(/(\d{4})年/g)].map((m) => m[1]);
    // 年が3つ以上並ぶ見出しを持つ表＝月間平均推移（改定履歴の表は年が1つ）
    if (years.length < 3) continue;

    let latest = null;
    for (const row of rows.slice(1)) {
      const text = stripTags(row);
      if (!/^\d{1,2}月/.test(text)) continue;
      const values = [...text.matchAll(/(\d{1,3}(?:,\d{3})+)/g)].map((m) =>
        Number(m[1].replace(/,/g, ''))
      );
      if (values.length === years.length) latest = values[values.length - 1];
    }
    if (latest) return latest;
  }
  return null;
}

// 抽出した建値が、同じページの月間平均と大きく食い違っていないかを見る。
// 「もっともらしいが別の表から拾った値」を捕まえるのはこの検査だけ。
// 妥当域（PRICE_RANGE）では今回のバグを捕まえられなかった。
function crossCheck(metal, price, monthlyAverage) {
  if (!monthlyAverage) {
    console.log(
      `::warning::${metal}: 月間平均の表が見つからず、取り違えの照合ができませんでした。` +
        `取得元の構造が変わった可能性があります。`
    );
    return true;
  }
  const ratio = Math.abs(Number(price) - monthlyAverage) / monthlyAverage;
  if (ratio > CROSS_CHECK_RATIO) {
    console.error(
      `${metal}: 月間平均(${monthlyAverage.toLocaleString()})と` +
        `${(ratio * 100).toFixed(1)}%食い違います (${Number(price).toLocaleString()})。` +
        `別の表から拾った可能性があるため採用しません。`
    );
    return false;
  }
  return true;
}

// 取得した値が採用に足るかを一箇所で判定する
function accept(metal, price, date, source, monthlyAverage) {
  if (!inRange(metal, price)) {
    console.error(`${metal}: 価格が妥当域の外です (${price})`);
    return null;
  }
  if (!isFresh(date)) {
    console.error(`${metal}: 改定日が古すぎるか不正です (${date})`);
    return null;
  }
  if (!crossCheck(metal, price, monthlyAverage)) return null;
  return { price, source, date };
}

// 銅建値: JX金属
// 「最近の銅建値改定の履歴」の最新年（既定で開いているアコーディオン）から、
// 改定日（th）と建値（td）を同じ行で取る。表は日付の昇順なので末尾が最新。
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
    return accept('銅', price, date, 'JX金属', latestMonthlyAverage(html));
  } catch (e) {
    console.error('銅スクレイピングエラー:', e.message);
    return null;
  }
}

// 鉛建値: 三菱マテリアル（JSファイルの変数を直読）
async function scrapeLeadPrice() {
  try {
    const res = await fetch('https://www.mmc.co.jp/corporate/ja/js/metalprice_lead.js');
    const js = await res.text();

    const priceMatch = js.match(/f_pricelValue\s*=\s*(\d+)/);
    // 日付: const f_pricelDate = '2026-10-01';
    const dateMatch = js.match(/f_pricelDate\s*=\s*'(\d{4})-(\d{2})-(\d{2})'/);
    if (!priceMatch) {
      console.error('鉛: 価格の変数が見つかりません');
      return null;
    }
    const date = dateMatch ? `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}` : '';
    // 同じJSが月平均を持っているのでそれを照合に使う
    const aveMatch = js.match(/f_monthlylAve\s*=\s*(\d+)/);
    const monthlyAverage = aveMatch ? Number(aveMatch[1]) : null;
    return accept('鉛', priceMatch[1], date, '三菱マテリアル', monthlyAverage);
  } catch (e) {
    console.error('鉛スクレイピングエラー:', e.message);
    return null;
  }
}

// 亜鉛建値: 三井金属
// 改定履歴の表（改定日と建値が同じ行にある表）の先頭行が最新。
// 価格のセルに単位が無いため、改定日のセルの「次のセル」として取る。
// 行内で最初に見つかった数値を採ると、列が1つ増えた日に無言で別の値を拾う。
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

    let year = null;
    for (const row of history.matchAll(/<tr[\s\S]*?<\/tr>/g)) {
      const rowHtml = row[0];

      // 年は行の見出しセル（rowspan）にある。見つかった時点で以降の行に引き継ぐ
      const yearInRow = stripTags(rowHtml).match(/(\d{4})\s*年/);
      if (yearInRow) year = yearInRow[1];
      if (!year) continue;

      const cells = [...rowHtml.matchAll(/<td[\s\S]*?<\/td>/g)].map((c) => stripTags(c[0]));
      const dateIdx = cells.findIndex((c) => /\d{1,2}月\s*\d{1,2}日/.test(c));
      if (dateIdx === -1 || dateIdx + 1 >= cells.length) continue;

      const dateMatch = cells[dateIdx].match(/(\d{1,2})月\s*(\d{1,2})日/);
      const priceMatch = cells[dateIdx + 1].match(/(\d{1,3}(?:,\d{3})+)/);
      if (!priceMatch) continue;

      const price = priceMatch[1].replace(/,/g, '');
      const date = `${year}/${dateMatch[1].padStart(2, '0')}/${dateMatch[2].padStart(2, '0')}`;
      return accept('亜鉛', price, date, '三井金属', latestMonthlyAverage(html));
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
      const before = Number(prevMap[metal]?.price);
      if (Number.isFinite(before) && before > 0) {
        const ratio = Math.abs(Number(got.price) - before) / before;
        if (ratio > CHANGE_WARN_RATIO) {
          console.log(
            `::warning::${metal}の建値が前回から${(ratio * 100).toFixed(0)}%動きました ` +
              `(${before} → ${got.price})。採用しますが、取得元の構造変更でないか確認してください。`
          );
        }
      }

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
    // 日付も前回のまま出るので、利用者から見て「更新が止まっている」と分かる。
    failed.push(metal);
    if (prevMap[metal]) {
      result.push(prevMap[metal]);
      console.log(
        `${metal}: 取得失敗。前回値を据え置き (${prevMap[metal].price} / ${prevMap[metal].date})`
      );
    }
  }

  if (failed.length > 0) {
    console.log(
      `::error::建値の取得に失敗: ${failed.join(', ')}。取得元ページの構造が変わった可能性があります。`
    );
    // ワークフローはこの後デプロイを起動してから、最後にこの出力を見てジョブを落とす。
    // ここで exit 1 すると、取得できた金属の更新と配信まで止まってしまう。
    if (process.env.GITHUB_OUTPUT) {
      appendFileSync(process.env.GITHUB_OUTPUT, `failed=${failed.join(',')}\n`);
    }
  }

  if (result.length === 0) {
    console.error('全てのスクレイピングに失敗し、前回値もありません。');
    process.exit(1);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`tatene.json を更新しました (${result.length}件)`);

  // 「最後に確認できた日時」を建値そのものとは別に残す。
  // 改定が無い日（建値は変わらない）と、取得できていない日を区別するため。
  // 画面はこれを見て、確認が止まっているときに注意を出す。
  // 毎日必ず変わるので、リポジトリに活動が生まれ、
  // GitHub が60日間の無活動で scheduled workflow を止めることも防げる。
  writeFileSync(
    STATUS_PATH,
    JSON.stringify({ checkedAt: new Date().toISOString(), failed }, null, 2),
    'utf-8'
  );
  console.log(`tatene-status.json を更新しました (失敗 ${failed.length}件)`);
}

main().catch((e) => {
  console.error('致命的エラー:', e);
  process.exit(1);
});
