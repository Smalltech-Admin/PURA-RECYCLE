import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'アクセスマップ',
  description: 'プラリサイクル株式会社へのアクセス方法。埼玉県新座市野火止2-1-29。JR武蔵野線新座駅より車3分。',
};

export default function AccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-green-700 pb-3">
        アクセスマップ
      </h1>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="text-gray-700 font-medium">
          ※当社は2020年5月25日に以下住所へ移転致しました。
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-green-700 mb-4">所在地</h2>
        <p className="text-lg text-gray-700 mb-2">
          〒352-0004 埼玉県新座市野火止2-1-29
        </p>
        <p className="text-gray-600">
          <strong>最寄駅:</strong> JR武蔵野線「新座駅」より 車…3分 / 徒歩…10分
        </p>
      </section>

      <section className="mb-8">
        <div className="aspect-video w-full">
          <iframe
            src="https://www.google.com/maps?q=埼玉県新座市野火止2-1-29&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
            className="rounded-lg border border-gray-200"
            title="プラリサイクル所在地"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-green-700 mb-3 border-l-4 border-green-700 pl-3">
            国道254号線（川越街道）池袋方面よりお越しの方
          </h2>
          <p className="text-gray-700 leading-relaxed">
            川越方面へ向かい、左手に「株式会社モビメント」様が見えましたら手前の道を左折します。
            直進して100mほどで「新座メモリアルガーデン」様が見えますので、その手前の道を右折します。
            20mほど直進した左手に当社がございます。不明な場合はお電話にてご案内致します。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-green-700 mb-3 border-l-4 border-green-700 pl-3">
            国道254号線（川越街道）川越方面よりお越しの方
          </h2>
          <p className="text-gray-700 leading-relaxed">
            池袋方面へ向かい、「大和田」交差点を右折します。
            直進して一個目の信号「三本木」を左折し、200mほど直進した所で右手に案内看板がございます。
            不明な場合はお電話にてご案内致します。
          </p>
        </div>
      </section>

      <div className="mt-8 bg-green-50 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-2">道がわからない場合はお気軽にお電話ください</p>
        <a
          href="tel:048-483-6687"
          className="inline-flex items-center gap-2 text-green-700 font-bold text-2xl hover:underline"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          TEL: 048-483-6687
        </a>
        <p className="text-gray-600 font-bold mt-2">FAX: 048-483-6688（24時間OK）</p>
      </div>
    </div>
  );
}
