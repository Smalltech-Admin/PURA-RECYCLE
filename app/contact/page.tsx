import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'お問合せ',
  description: 'プラリサイクル株式会社へのお問い合わせ。TEL: 048-483-6687 / FAX: 048-483-6688（24時間OK）',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-green-700 pb-3 text-center">
        お問合せ
      </h1>

      <div className="mb-6">
        <Image
          src="/images/contact001.png"
          alt="お問合せ"
          width={800}
          height={200}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className="mb-4">
        <Image
          src="/images/freetel.gif"
          alt="フリーダイヤル 0120-472-872"
          width={400}
          height={50}
          className="h-10 w-auto mx-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 電話 */}
        <section className="bg-green-50 rounded-lg p-6">
          <h2 className="text-lg font-bold text-green-700 mb-3 border-l-4 border-green-700 pl-3">
            お電話でのお問い合わせ
          </h2>
          <a
            href="tel:048-483-6687"
            className="block text-green-700 font-bold text-2xl hover:underline"
          >
            TEL: 048-483-6687
          </a>
          <p className="text-sm text-gray-500 text-right mt-2">
            AM8:30〜PM7:00 / 年中無休
          </p>
        </section>

        {/* FAX */}
        <section className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-lg font-bold text-orange-700 mb-3 border-l-4 border-orange-500 pl-3">
            FAXでのお問い合わせ
          </h2>
          <p className="text-orange-700 font-bold text-2xl">
            FAX: 048-483-6688
          </p>
          <p className="text-sm text-gray-500 text-right mt-2">
            24時間OK
          </p>
        </section>
      </div>
    </div>
  );
}
