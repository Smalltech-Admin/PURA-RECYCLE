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
  const status = isOpen ? '営業中' : '営業時間外';
  const statusColor = isOpen ? 'text-green-600' : 'text-gray-400';

  return (
    <div className="border rounded-lg p-3 bg-white text-center h-full flex flex-col justify-center gap-2">
      <p className="text-lg md:text-xl font-bold text-gray-800 leading-tight">{dateStr}</p>
      <p className="text-xs md:text-sm font-bold text-gray-700 leading-tight">
        営業時間: AM8:30〜PM7:00
      </p>
      <p className={`font-bold text-xl md:text-2xl leading-tight ${statusColor}`}>{status}</p>
    </div>
  );
}
