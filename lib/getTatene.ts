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
  | { status: 'ok'; items: TateneItem[] }
  | { status: 'unavailable' };

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

    return { status: 'ok', items: data as TateneItem[] };
  } catch {
    return { status: 'unavailable' };
  }
}
