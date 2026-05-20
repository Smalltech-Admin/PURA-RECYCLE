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
    <div className="border-4 border-black bg-white h-full grid grid-cols-2 md:grid-cols-1">
      {/* 左(スマホ)/上(PC): 営業時間 */}
      <div className="flex flex-col items-center justify-center text-center p-2 border-r-4 border-black md:border-r-0 md:border-b-4">
        <p className="text-xs md:text-sm font-bold text-gray-700 leading-tight">営業時間</p>
        <p className="text-sm md:text-base font-bold text-gray-800 leading-tight mt-1">AM8:30〜PM7:00</p>
      </div>
      {/* 右(スマホ)/下(PC): 日にち + 営業中 */}
      <div className="flex flex-col items-center justify-center text-center p-2">
        <p className="text-base md:text-xl font-bold text-gray-800 leading-tight">{dateStr}</p>
        <p className={`text-lg md:text-2xl font-bold leading-tight mt-1 ${statusColor}`}>{status}</p>
      </div>
    </div>
  );
}
