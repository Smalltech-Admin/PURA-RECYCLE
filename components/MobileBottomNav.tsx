'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  {
    href: '/',
    label: 'ホーム',
    icon: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
      </svg>
    ),
  },
  {
    href: '/nonmetal',
    label: '非鉄金属買取',
    icon: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 8.5l3.5 4 3.5-4M12 12.5V18M9 14h6M9 16.5h6" />
      </svg>
    ),
  },
  {
    href: '/businessinfo',
    label: '買取の案内',
    icon: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v6M12 7.5v.5" />
      </svg>
    ),
  },
  {
    href: '/access',
    label: 'アクセス',
    icon: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" strokeWidth={2} />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'お問合せ',
    icon: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-1.7.85a11 11 0 005.5 5.5l.85-1.7a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 6V5z" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.12)]"
      aria-label="モバイルナビゲーション"
    >
      {/* 相談を促すバナー */}
      <div className="bg-brand text-[color:var(--c-on-brand)] text-center font-black text-sm py-1">
        まずはお気軽にご相談ください！
      </div>
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-black ${
                  active
                    ? 'text-brand-dark border-2 border-brand bg-brand/10'
                    : 'text-gray-700 border-2 border-transparent'
                }`}
              >
                {item.icon}
                <span className="leading-tight whitespace-nowrap">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
