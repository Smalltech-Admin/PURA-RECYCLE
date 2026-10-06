/**
 * スプレッドシートを読む共通の仕組み。
 *
 * 踏んだ問題（2026-10-06 実測）
 *  1. 画面の部品ごとに同じURLを取りに行っていた。トップページでは買取価格が3本、
 *     お知らせが2本、同時に飛んでいた。同じ相手に重ねて投げるぶん遅くなり、
 *     遅いものは12.5秒かかっていた。
 *  2. 取得を1回にまとめようとモジュール変数で状態を持ったが、
 *     このファイルはビルド時に複数のチャンクへ複製されるため共有されなかった。
 *     置き場所を globalThis に固定して、複製が何個あっても同じ状態を見るようにしている。
 *
 * 普段はスプレッドシートを直接読む（最新が出る）。
 * 返りが遅いときだけ、日次で取った自サイトの控えを出して空白を避ける。
 */

type Listener<T> = (items: T[]) => void;

type Store<T> = {
  cached: T[] | null;
  liveArrived: boolean;
  started: boolean;
  listeners: Set<Listener<T>>;
};

// 控えを出し始めるまでの待ち時間。スプレッドシートが通常どおり返る限り控えは使わない。
// 待たずに出すと、値が変わった直後に古い値が一瞬見えてから新しい値に入れ替わる。
const SNAPSHOT_DELAY_MS = 1200;

function getStore<T>(key: string): Store<T> {
  const g = globalThis as typeof globalThis & Record<string, Store<T> | undefined>;
  if (!g[key]) {
    g[key] = { cached: null, liveArrived: false, started: false, listeners: new Set() };
  }
  return g[key] as Store<T>;
}

export function createSheetSource<T>(options: {
  /** globalThis 上の置き場所。取得元ごとに別の名前にする */
  storeKey: string;
  /** スプレッドシートのCSV書き出しURL */
  liveUrl: string;
  /** 自サイトに置いた控えのパス（/data/... ） */
  snapshotPath: string;
  /** CSVを項目の配列にする */
  parse: (csv: string) => T[];
}): (cb: Listener<T>) => () => void {
  const { storeKey, liveUrl, snapshotPath, parse } = options;

  async function loadLive(): Promise<T[] | null> {
    try {
      const res = await fetch(liveUrl);
      if (!res.ok) return null;
      const items = parse(await res.text());
      return items.length > 0 ? items : null;
    } catch {
      return null;
    }
  }

  async function loadSnapshot(): Promise<T[] | null> {
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const res = await fetch(`${basePath}${snapshotPath}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data?.items) && data.items.length > 0 ? (data.items as T[]) : null;
    } catch {
      return null;
    }
  }

  function publish(items: T[]) {
    const store = getStore<T>(storeKey);
    store.cached = items;
    for (const cb of store.listeners) cb(items);
  }

  function start() {
    const store = getStore<T>(storeKey);

    loadLive().then((items) => {
      if (!items) return;
      store.liveArrived = true;
      publish(items);
    });

    setTimeout(() => {
      if (store.liveArrived) return;
      loadSnapshot().then((items) => {
        if (!items || store.liveArrived) return;
        publish(items);
      });
    }, SNAPSHOT_DELAY_MS);
  }

  return function subscribe(cb: Listener<T>): () => void {
    const store = getStore<T>(storeKey);
    store.listeners.add(cb);
    if (store.cached) cb(store.cached);
    if (!store.started) {
      store.started = true;
      start();
    }
    return () => {
      store.listeners.delete(cb);
    };
  };
}
