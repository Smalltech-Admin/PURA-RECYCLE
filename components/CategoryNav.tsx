import Link from 'next/link';

const CATEGORIES = [
  { href: '/nonmetal/dou', label: '銅' },
  { href: '/nonmetal/densen', label: '電線' },
  { href: '/nonmetal/battery', label: 'バッテリー' },
  { href: '/nonmetal/shinchuu', label: '真鍮・砲金' },
  { href: '/nonmetal/moter', label: 'モーター' },
  { href: '/nonmetal/radieter', label: 'ラジエター' },
  { href: '/nonmetal/namari', label: '鉛' },
  { href: '/nonmetal/hoile', label: 'ホイール' },
  { href: '/nonmetal/tokushu', label: '特殊金属' },
  { href: '/nonmetal/other', label: 'その他' },
];

export function CategoryNav({ current }: { current?: string }) {
  return (
    <nav className="mb-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              current === cat.label
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
