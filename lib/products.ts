export type Product = {
  no: number;
  id: string;
  /** 表示名 兼 スプレッドシートの subcategory 照合キー（シート側と一致させること） */
  name: string;
  /** 追加の説明文（任意） */
  desc?: string;
  image: string;
  /** サイドバー（取扱い品目）に出す候補か */
  sidebar: boolean;
};

/**
 * 全品目の登録簿（id・画像・名称の対応表）。
 * 実際にサイトへ表示するかどうかは、スプレッドシートに同名の subcategory 行が
 * 存在するかどうかで判定する（非表示にしたい品目はシートの行を削除する運用）。
 */
export const PRODUCTS: Product[] = [
  // 主力品目（サイドバー候補）
  { no: 1, id: 'pika', name: 'ピカ線', image: '/images/pika-sen.jpg', sidebar: true },
  { no: 2, id: '1gou-a', name: '並銅A', image: '/images/0001goudou.gif', sidebar: true },
  { no: 3, id: '1gou-b', name: '並銅B', image: '/images/0002goudou.gif', sidebar: true },
  { no: 4, id: 'namidou', name: '並銅', image: '/images/0002goudou.gif', sidebar: true },
  { no: 5, id: '2gou', name: '2号銅', image: '/images/000namidou.gif', sidebar: true },
  { no: 6, id: 'houkin', name: '砲金', image: '/images/000houkin1.gif', sidebar: true },
  { no: 7, id: 'komihoukin', name: '込砲金', image: '/images/000houkin2.gif', sidebar: true },
  { no: 8, id: 'komishinchuu', name: '込真鍮', image: '/images/000shinchuu2.gif', sidebar: true },
  { no: 9, id: '1ponsen-a', name: '1本線（A）100（B）60', image: '/images/000ipponsen1.gif', sidebar: true },
  { no: 10, id: '1ponsen-38', name: '1本線（38㎜）', image: '/images/000ipponsen2.gif', sidebar: true },
  { no: 11, id: '3ponsen-a', name: '3本線（A）', image: '/images/000sanbonsen1.gif', sidebar: true },
  { no: 12, id: '3ponsen-b', name: '3本線（B）', image: '/images/000sanbonsen2.gif', sidebar: true },
  { no: 13, id: '3ponsen-c', name: '3本線（C）', image: '/images/000sanbonsen3.gif', sidebar: true },
  { no: 14, id: 'f-cable', name: 'Fケーブル', image: '/images/000vasen.gif', sidebar: true },
  { no: 15, id: 'reiboukan', name: '冷媒管', image: '/images/000kawatsuki.gif', sidebar: true },
  { no: 16, id: 'zassen', name: '雑線', image: '/images/000kadensen.gif', sidebar: true },
  { no: 17, id: 'zappin-kg', name: '雑品（㎏）', image: '/images/000zappin1.gif', sidebar: true },
  { no: 42, id: 'zappin-set', name: '雑品（セット）', image: '/images/000zappin1.gif', sidebar: true },
  { no: 18, id: 'kyutouki', name: '給湯器', image: '/images/000kyuutouki.gif', sidebar: true },
  { no: 19, id: 'arumi-sasshi', name: 'アルミサッシ', image: '/images/000hoile2.gif', sidebar: true },
  { no: 20, id: 'arumi-hoile', name: 'アルミホイール', image: '/images/000hoile1.gif', sidebar: true },
  // サブ品目（サイドバー非表示）
  { no: 21, id: 'stainless-a', name: 'ステンレスA', image: '/images/000stainless.gif', sidebar: false },
  { no: 22, id: 'stainless-b', name: 'ステンレスB', image: '/images/000stainless.gif', sidebar: false },
  { no: 23, id: 'arumi-gara', name: 'アルミ ガラ', image: '/images/000zappin2.gif', sidebar: false },
  { no: 24, id: 'arumi-tire-a', name: 'アルミ タイヤA', desc: '16インチアップ　タイヤ付アルミホイール。', image: '/images/000hoile1.gif', sidebar: false },
  { no: 25, id: 'arumi-tire-b', name: 'アルミ タイヤB', desc: '12.13.14.15インチ　タイヤ付アルミホイール。', image: '/images/000hoile2.gif', sidebar: false },
  { no: 26, id: 'battery-a', name: 'バッテリーA', image: '/images/000battery1.gif', sidebar: false },
  { no: 27, id: 'battery-b', name: 'バッテリーB', image: '/images/000battery2.gif', sidebar: false },
  { no: 28, id: 'moter', name: 'モーター', image: '/images/000moter1.gif', sidebar: false },
  { no: 29, id: 'namari', name: '鉛', image: '/images/000namari1.gif', sidebar: false },
  { no: 30, id: 'gas-meter', name: 'ガスメーター', image: '/images/000houkin1.gif', sidebar: false },
  { no: 31, id: 'trans', name: 'トランス', image: '/images/000anteiki.gif', sidebar: false },
  { no: 32, id: 'breaker', name: 'ブレーカー', image: '/images/000anteiki.gif', sidebar: false },
  { no: 33, id: 'kiban-a', name: '基盤A', image: '/images/000kiban.gif', sidebar: false },
  { no: 34, id: 'kiban-b', name: '基盤B', image: '/images/000kiban.gif', sidebar: false },
  { no: 35, id: 'hdd', name: 'ハードディスク', image: '/images/000kiban.gif', sidebar: false },
  { no: 36, id: 'antenna', name: 'アンテナ線', image: '/images/000hanes.gif', sidebar: false },
  { no: 37, id: 'zappin', name: '雑品', image: '/images/000zappin2.gif', sidebar: false },
  { no: 38, id: 'jitensha-a', name: '自転車A', image: '', sidebar: false },
  { no: 39, id: 'jitensha-b', name: '自転車B', image: '', sidebar: false },
  { no: 40, id: 'tetsu', name: '鉄', image: '', sidebar: false },
  { no: 41, id: 'radiator', name: 'ラジエーター', image: '', sidebar: false },
];
