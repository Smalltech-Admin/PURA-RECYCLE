export type TateneItem = {
  metal: string;
  price: string;
  direction: string;
  source: string;
  url: string;
  date: string;
};

// 「取得できていない」と「値が無い」を混同しない。
// 以前は取得に失敗すると半年前の固定値を返しており、それを画面が
// 「◯◯ 現在」と表示していた。確認できていないものを確認できたように書かない。
export type TateneResult =
  | { status: 'ok'; items: TateneItem[]; checkedAt: string | null }
  | { status: 'unavailable' };

// 取得元の確認が何日止まったら画面で知らせるか。
// 建値は改定が無い日もあるため「改定日が古い＝異常」ではない。
// 異常なのは「確認そのものができていない」こと。両者を混同しない。
const STALE_CHECK_DAYS = 3;

export function isCheckStale(checkedAt: string | null): boolean {
  if (!checkedAt) return false;
  const t = Date.parse(checkedAt);
  if (Number.isNaN(t)) return false;
  return (Date.now() - t) / 86400000 > STALE_CHECK_DAYS;
}

export function formatCheckedAt(checkedAt: string): string {
  const d = new Date(checkedAt);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

// 最後に取得元を確認できた日時。取れなくても建値の表示は妨げない。
async function fetchCheckedAt(basePath: string): Promise<string | null> {
  try {
    const res = await fetch(`${basePath}/data/tatene-status.json?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const status = await res.json();
    return typeof status?.checkedAt === 'string' ? status.checkedAt : null;
  } catch {
    return null;
  }
}

export async function fetchTatene(): Promise<TateneResult> {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    // 毎回その時点の建値を取りに行く。間にキャッシュが挟まって
    // 古い建値が表示されることを避けるため、問い合わせ毎にURLを変える。
    const res = await fetch(`${basePath}/data/tatene.json?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { status: 'unavailable' };

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return { status: 'unavailable' };

    return { status: 'ok', items: data as TateneItem[], checkedAt: await fetchCheckedAt(basePath) };
  } catch {
    return { status: 'unavailable' };
  }
}
