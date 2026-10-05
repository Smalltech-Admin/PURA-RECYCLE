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
// 実測（2026-10-05）の改定間隔は 銅 最大14日・平均3.8日、亜鉛 最大10日・平均5.4日。
// 鉛も最低で月初に改定される。45日空くこと自体が異常。
// 以前は90日にしていたが、年の境目で前年の表を掴んだ場合に3ヶ月近く
// 気づけないため縮めた。
const MAX_AGE_DAYS = 45;

// 前回値からこの割合を超えて動いたら報告する（値は採用する）。
// 拒否にはしない。正しい値を捨てて古い価格を掲示し続ける方が害が大きいため。
const CHANGE_WARN_RATIO = 0.2;

// 取り違え検知。取得元ページが自分で載せている「月間平均」と突き合わせ、
// これを超えて食い違うなら別の表から拾ったとみなして採用しない。
//
// 閾値が金属ごとに違うのは、比較対象の性質が違うため。
//   銅  : 月間平均は月が終わってから載る。比較相手は前月平均で、ラグが大きい
//   亜鉛: 当月の行が進行中の平均として載る。現値に近い
//   鉛  : 同じJSの月平均。現値に近い
//
// 根拠（実測・2026-10-05）:
//   銅 2022〜2026の改定346件を前月平均と突き合わせた最大乖離 18.1%（2024/5/21）。
//     15%超が8件、20%超は0件。20%では余裕が1.9ポイントしかなく、相場が大きく
//     動いた日に正しい値を拒否してしまう。35%なら余裕17ポイント。
//   亜鉛 2026の12件で同月平均との最大乖離 6.8%、前月平均とは 11.3%。
//   正しい値の乖離は 銅0.7% / 亜鉛0.0% / 鉛0.3%。
//   過去のバグ値は 銅63.0% / 亜鉛29.2% なので、この閾値でも両方とも捕まる。
const CROSS_CHECK_RATIO = {
  '銅': 0.35,
  '鉛': 0.15,
  '亜鉛': 0.15,
};

// 照合できない状態がこの日数続いたら、取得失敗と同じ扱いにしてジョブを落とす。
// 一時的な改装と、恒久的に照合が効かなくなった状態を区別するため。
const CROSS_CHECK_UNAVAILABLE_LIMIT_DAYS = 7;

// 状態ファイル。建値そのものとは別に「最後に確認できた日時」を持つ。
// 改定が無い日と、取得できていない日を、画面と運用の両方で区別するため。
const STATUS_PATH = resolve(__dirname, '../public/data/tatene-status.json');

// 月次の推移グラフ用。取得元が公開している「月間平均」を毎回まるごと読み直す。
// 自分で積み上げないので、取りこぼした日があっても次の実行で揃う。
const HISTORY_PATH = resolve(__dirname, '../public/data/tatene-history.json');

// 鉛は本文ではなくJSファイルに現在値と月間平均の両方が入っている
const LEAD_JS_URL = 'https://www.mmc.co.jp/corporate/ja/js/metalprice_lead.js';

// 同じページを現在値と履歴の両方で読むので、1回の実行で1度だけ取る
const pageCache = new Map();
async function fetchText(url) {
  if (!pageCache.has(url)) {
    const res = await fetch(url);
    pageCache.set(url, await res.text());
  }
  return pageCache.get(url);
}

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

    let latest = null;    // 最新年の、確定している直近の月
    let prevYear = null;  // 最新年の列がまだ空のとき用（前年の直近の月）
    for (const row of rows.slice(1)) {
      const text = stripTags(row);
      if (!/^\d{1,2}月/.test(text)) continue;
      const values = [...text.matchAll(/(\d{1,3}(?:,\d{3})+)/g)].map((m) =>
        Number(m[1].replace(/,/g, ''))
      );
      if (values.length === years.length) latest = values[values.length - 1];
      else if (values.length === years.length - 1) prevYear = values[values.length - 1];
    }
    // 年が明けた直後は最新年の列が全部空になる。そのまま null を返すと
    // 1ヶ月ほど取り違え検知が消えるので、前年12月の平均で代用する。
    if (latest) return latest;
    if (prevYear) return prevYear;
  }
  return null;
}

// 月間平均推移の表を丸ごと読み、月次の系列にして返す（古い順）。
// 表の形は3社で共通（1行目が年の見出し、以降が月ごとの行）だが、
// 年の並びは JX金属・三井金属が昇順、三菱マテリアルが降順。
// 当月など値の無い列は欠けるので、昇順なら末尾、降順なら先頭が欠ける。
// そのぶんを差し引いて年に対応づける。
function monthlyAverageSeries(html) {
  const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((m) => m[0]);
  for (const table of tables) {
    const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((m) => m[0]);
    if (rows.length === 0) continue;

    const years = [...stripTags(rows[0]).matchAll(/(\d{4})年/g)].map((m) => Number(m[1]));
    if (years.length < 3) continue;

    const descending = years[0] > years[years.length - 1];
    const points = [];
    for (const row of rows.slice(1)) {
      const text = stripTags(row);
      const monthMatch = /^(\d{1,2})月/.exec(text);
      if (!monthMatch) continue;
      const month = Number(monthMatch[1]);
      const values = [...text.matchAll(/(\d{1,3}(?:,\d{3})+)/g)].map((m) =>
        Number(m[1].replace(/,/g, ''))
      );
      if (values.length === 0 || values.length > years.length) continue;

      const offset = descending ? years.length - values.length : 0;
      values.forEach((value, i) => {
        const year = years[i + offset];
        if (year) points.push({ ym: `${year}-${String(month).padStart(2, '0')}`, value });
      });
    }
    if (points.length > 0) {
      points.sort((a, b) => (a.ym < b.ym ? -1 : a.ym > b.ym ? 1 : 0));
      return points;
    }
  }
  return [];
}

// 抽出した建値が、同じページの月間平均と大きく食い違っていないかを見る。
// 「もっともらしいが別の表から拾った値」を捕まえるのはこの検査だけ。
// 妥当域（PRICE_RANGE）では今回のバグを捕まえられなかった。
// 'ok'（照合して問題なし） / 'unavailable'（照合材料が無い） / 'mismatch'（食い違う）
function crossCheck(metal, price, monthlyAverage) {
  if (process.env.SKIP_CROSS_CHECK === 'true') {
    console.log(`::warning::${metal}: 照合を手動で省略しました（SKIP_CROSS_CHECK）。`);
    return 'unavailable';
  }
  if (!monthlyAverage) {
    console.log(
      `::warning::${metal}: 月間平均の表が見つからず、取り違えの照合ができませんでした。` +
        `取得元の構造が変わった可能性があります。`
    );
    return 'unavailable';
  }
  const ratio = Math.abs(Number(price) - monthlyAverage) / monthlyAverage;
  if (ratio > CROSS_CHECK_RATIO[metal]) {
    console.error(
      `${metal}: 月間平均(${monthlyAverage.toLocaleString()})と` +
        `${(ratio * 100).toFixed(1)}%食い違います (${Number(price).toLocaleString()})。` +
        `別の表から拾った可能性があるため採用しません。` +
        `相場の急変で正しい値が拒否された場合は、` +
        `scrape-tatene の手動実行で skip_cross_check を true にして一度だけ通せます。`
    );
    return 'mismatch';
  }
  return 'ok';
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
  const checked = crossCheck(metal, price, monthlyAverage);
  if (checked === 'mismatch') return null;
  return { price, source, date, crossCheck: checked };
}

// 銅建値: JX金属
// 「最近の銅建値改定の履歴」の最新年（既定で開いているアコーディオン）から、
// 改定日（th）と建値（td）を同じ行で取る。表は日付の昇順なので末尾が最新。
async function scrapeCopperPrice() {
  try {
    const html = await fetchText(SOURCE_URLS['銅']);

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
    const js = await fetchText(LEAD_JS_URL);

    const priceMatch = js.match(/f_pricelValue\s*=\s*(\d+)/);
    // 日付: const f_pricelDate = '2026-10-01';
    const dateMatch = js.match(/f_pricelDate\s*=\s*'(\d{4})-(\d{2})-(\d{2})'/);
    if (!priceMatch) {
      console.error('鉛: 価格の変数が見つかりません');
      return null;
    }
    const date = dateMatch ? `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}` : '';
    // 同じJSが月平均を持っているのでそれを照合に使う。
    // f_monthlylAve が「月平均」である前提。三菱が年平均に差し替えると
    // トレンドのある年に恒常的にずれ、正しい値を拒否し続ける側に倒れる。
    // 拒否が連日続いたらまずこの変数の意味を疑うこと
    // （f_pricelAve は現値と同じ値なので取り違えない）。
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
    const html = await fetchText(SOURCE_URLS['亜鉛']);

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

function loadStatus() {
  try {
    return JSON.parse(readFileSync(STATUS_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

async function main() {
  console.log('建値スクレイピング開始...');

  const prev = loadPrevious();
  const prevMap = {};
  for (const item of prev) {
    prevMap[item.metal] = item;
  }
  const prevStatus = loadStatus();

  const [copper, lead, zinc] = await Promise.all([
    scrapeCopperPrice(),
    scrapeLeadPrice(),
    scrapeZincPrice(),
  ]);

  const scraped = { '銅': copper, '鉛': lead, '亜鉛': zinc };
  const result = [];
  const failed = [];
  const checks = {};
  const now = new Date();

  for (const metal of ['銅', '鉛', '亜鉛']) {
    const got = scraped[metal];

    if (!got) {
      // 取得できなかった金属は、前回値を残す。
      // 消すと画面からその金属が丸ごと消え、利用者には理由が分からないため。
      // 日付も前回のまま出るので、利用者から見て「更新が止まっている」と分かる。
      failed.push(metal);
      checks[metal] = { crossCheck: 'failed' };
      if (prevMap[metal]) {
        result.push(prevMap[metal]);
        console.log(
          `${metal}: 取得失敗。前回値を据え置き (${prevMap[metal].price} / ${prevMap[metal].date})`
        );
      }
      continue;
    }

    // 照合できない状態が続いていないかを見る。一時的な改装なら数日で戻る。
    // 戻らないなら取り違え検知が恒久的に失われているので、取得失敗と同じ扱いにする。
    let since = null;
    if (got.crossCheck === 'unavailable') {
      since = prevStatus?.checks?.[metal]?.unavailableSince ?? now.toISOString();
      const days = (now.getTime() - Date.parse(since)) / 86400000;
      if (days > CROSS_CHECK_UNAVAILABLE_LIMIT_DAYS) {
        console.error(
          `${metal}: 取り違えの照合ができない状態が${Math.floor(days)}日続いています。` +
            `取得元の構造が変わったまま直っていない可能性が高いため、要確認として扱います。`
        );
        failed.push(metal);
      }
    }
    checks[metal] = since
      ? { crossCheck: 'unavailable', unavailableSince: since }
      : { crossCheck: 'ok' };

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
  writeFileSync(
    STATUS_PATH,
    JSON.stringify({ checkedAt: now.toISOString(), failed, checks }, null, 2),
    'utf-8'
  );
  console.log(`tatene-status.json を更新しました (失敗 ${failed.length}件)`);

  await writeHistory();
}

// 月次の推移。取得元が公開している月間平均をそのまま写す。
// 自分で日々積み上げるのではなく毎回読み直すので、
// 取りこぼした日があっても次の実行で揃い、過去に遡った値も反映される。
async function writeHistory() {
  const sources = [
    ['銅', SOURCE_URLS['銅']],
    ['鉛', LEAD_JS_URL],
    ['亜鉛', SOURCE_URLS['亜鉛']],
  ];

  const series = {};
  for (const [metal, url] of sources) {
    try {
      const points = monthlyAverageSeries(await fetchText(url));
      if (points.length === 0) {
        console.log(`::warning::${metal}: 月次の履歴を取得できませんでした。`);
        continue;
      }
      series[metal] = points;
      console.log(`${metal}: 月次の履歴 ${points.length}件 (${points[0].ym}〜${points[points.length - 1].ym})`);
    } catch (e) {
      console.log(`::warning::${metal}: 月次の履歴の取得に失敗しました (${e.message})`);
    }
  }

  if (Object.keys(series).length === 0) {
    // 既存の履歴を壊さない。現在値の表示には影響しない。
    console.log('::warning::月次の履歴をひとつも取得できなかったため、既存のファイルを残します。');
    return;
  }

  writeFileSync(HISTORY_PATH, JSON.stringify({ series }, null, 2), 'utf-8');
  console.log('tatene-history.json を更新しました');
}

main().catch((e) => {
  console.error('致命的エラー:', e);
  process.exit(1);
});
