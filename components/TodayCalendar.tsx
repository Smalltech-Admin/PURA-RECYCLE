'use client';

import { useEffect, useState } from 'react';

export function TodayCalendar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) return null;

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}(${weekdays[now.getDay()]})`;
  const totalMin = now.getHours() * 60 + now.getMinutes();
  const isOpen = totalMin >= 8 * 60 + 30 && totalMin < 19 * 60;

  return (
    <div className="border rounded-lg p-4 bg-white text-center">
      <p className="text-lg font-bold text-gray-800">{dateStr}</p>
      <p
        className={`mt-2 font-bold text-lg ${isOpen ? 'text-green-600' : 'text-gray-400'}`}
      >
        {isOpen ? '● 営業中' : '● 営業時間外'}
      </p>
    </div>
  );
}
