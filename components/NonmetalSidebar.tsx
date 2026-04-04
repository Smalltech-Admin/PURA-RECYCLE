import Link from 'next/link';

const SIDEBAR_ITEMS = [
  { href: '/nonmetal', label: '全て', key: '' },
  { href: '/nonmetal/dou', label: '銅', key: '銅' },
  { href: '/nonmetal/densen', label: '雑電線', key: '電線' },
  { href: '/nonmetal/battery', label: 'バッテリー', key: 'バッテリー' },
  { href: '/nonmetal/shinchuu', label: '真鍮・砲金', key: '真鍮・砲金' },
  { href: '/nonmetal/moter', label: 'モーター', key: 'モーター' },
  { href: '/nonmetal/radieter', label: 'ラジエター', key: 'ラジエター' },
  { href: '/nonmetal/namari', label: '鉛', key: '鉛' },
  { href: '/nonmetal/hoile', label: 'ホイール', key: 'ホイール' },
  { href: '/nonmetal/tokushu', label: '特殊金属', key: '特殊金属' },
  { href: '/nonmetal/other', label: 'ステンレス・その他', key: 'その他' },
];

export function NonmetalSidebar({ current }: { current: string }) {
  return (
    <div className="border rounded-lg bg-white overflow-hidden sticky top-28">
      <h3 className="bg-brand text-gray-800 text-sm font-bold px-3 py-2">取扱い品目</h3>
      <ul className="text-sm divide-y">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = current === item.key;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-brand text-gray-800 font-bold'
                    : 'text-gray-700 hover:bg-green-50 hover:text-brand-dark'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
