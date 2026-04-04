import type { PriceItem } from '@/lib/getPrices';

type Props = {
  items: PriceItem[];
  showUpdatedAt?: boolean;
};

export function PriceTable({ items, showUpdatedAt = false }: Props) {
  const lastUpdated = '';

  return (
    <div className="w-full overflow-x-auto">
      {showUpdatedAt && lastUpdated && (
        <p className="text-sm text-gray-500 mb-2">
          最終更新: {lastUpdated}
        </p>
      )}
      <table className="w-full border-collapse text-sm md:text-base">
        <thead>
          <tr className="bg-brand text-gray-800">
            <th className="p-3 text-left">品目</th>
            <th className="p-3 text-right">買取価格（税込）</th>
            <th className="p-3 text-left hidden md:table-cell">備考</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="p-3 font-medium">{item.subcategory}</td>
              <td className="p-3 text-right font-bold text-brand-dark">
                {item.price === '要問合せ' ? (
                  <a href="tel:048-483-6687" className="text-orange-600 hover:underline">
                    要問合せ
                  </a>
                ) : (
                  `${Number(item.price).toLocaleString()}円/kg`
                )}
              </td>
              <td className="p-3 text-gray-500 hidden md:table-cell">
                {item.note !== '-' ? item.note : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
