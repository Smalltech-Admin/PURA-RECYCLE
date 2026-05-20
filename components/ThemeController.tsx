'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** /page2 のときだけ body に theme-blue を付与し、サイト全体を青テーマにする */
export function ThemeController() {
  const pathname = usePathname();

  useEffect(() => {
    const blue = pathname.startsWith('/page2');
    document.body.classList.toggle('theme-blue', blue);
  }, [pathname]);

  return null;
}
