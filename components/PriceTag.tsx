import type { PriceItem } from '@/lib/getPrices';

type Size = 'sm' | 'md' | 'lg';

// 全商品カード共通の価格表示ルール。
// - 金額＋単位は1行目（単位は whitespace-nowrap で途中改行させない／入らなければ単位ごと改行）
// - （税込）は必ず最終行
const SIZES: Record<Size, { num: string; unit: string; tax: string }> = {
  sm: { num: 'text-xl md:text-2xl', unit: 'text-xs', tax: 'text-[11px]' },
  md: { num: 'text-2xl md:text-3xl', unit: 'text-xs md:text-sm', tax: 'text-xs' },
  lg: { num: 'text-3xl md:text-4xl', unit: 'text-sm md:text-base', tax: 'text-sm' },
};

export function PriceTag({
  price,
  loading = false,
  size = 'md',
  emptyLabel = '価格未設定',
}: {
  price?: PriceItem;
  loading?: boolean;
  size?: Size;
  emptyLabel?: string;
}) {
  const s = SIZES[size];

  if (loading) return <span className="text-gray-400">...</span>;
  if (price?.price === '要問合せ') {
    return <span className={`${s.num} font-bold text-orange-500`}>要問合せ</span>;
  }
  if (!price) return <span className="text-gray-400">{emptyLabel}</span>;

  const unit = price.unit?.replace('円/', '') || 'kg';
  return (
    <div className="leading-tight">
      <p>
        <span className={`${s.num} font-bold text-red-600`}>
          {Number(price.price).toLocaleString()}
        </span>
        <span className={`${s.unit} text-gray-600 whitespace-nowrap`}>円/{unit}</span>
      </p>
      <p className={`${s.tax} text-gray-600`}>（税込）</p>
    </div>
  );
}
