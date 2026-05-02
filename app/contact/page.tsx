import type { Metadata } from 'next';
import { AppImage as Image } from '@/components/AppImage';

export const metadata: Metadata = {
  title: 'お問合せ',
  description: 'プラリサイクル株式会社へのお問い合わせ。TEL: 048-483-6687 / FAX: 048-483-6688（24時間OK）',
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 border-b-2 border-brand pb-3 text-center">
        お問合せ
      </h1>

      <div className="mb-6">
        <Image
          src="/images/contact001.png"
          alt="お問合せ"
          width={800}
          height={225}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* フリーダイヤル */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-xs font-bold text-gray-700 tracking-wider">フリーダイヤル</p>
          <a
            href="tel:0120-472-872"
            className="block font-black text-3xl md:text-5xl hover:underline tracking-tight leading-none mt-1"
            style={{ color: '#5a8a30', WebkitTextStroke: '2px #000' }}
          >
            0120-472-872
          </a>
          <p className="text-base font-bold text-gray-700 tracking-wider mt-3">
            営業時間: AM8:30〜PM7:00 / 年中無休
          </p>
        </section>

        {/* TEL/FAX */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <a
            href="tel:048-483-6687"
            className="block font-black text-2xl md:text-4xl hover:underline leading-tight"
            style={{ color: '#5a8a30', WebkitTextStroke: '1.5px #000' }}
          >
            TEL: 048-483-6687
          </a>
          <p
            className="font-black text-2xl md:text-4xl leading-tight mt-2"
            style={{ color: '#5a8a30', WebkitTextStroke: '1.5px #000' }}
          >
            FAX: 048-483-6688
          </p>
          <p className="text-base font-bold text-gray-700 tracking-wider mt-3">FAX 24時間OK</p>
        </section>
      </div>
    </div>
  );
}
