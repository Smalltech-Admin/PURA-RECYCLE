import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '建設重機買取',
  description: 'ダンプ車両・トラック車両・作業重機・発電機等を高価買取。お気軽にご相談ください。',
};

const ITEMS = [
  {
    name: 'ダンプ・トラック車両',
    image: '/images/000machine1.gif',
    desc: 'リア / サイド / Lゲート / ファーム / スラグ / バレット / 軽トラ / 平ボディ / バンボディ / Wボディ。その他車両も買取致します。お気軽にご相談下さい。',
  },
  {
    name: '作業重機',
    image: '/images/000machine2.gif',
    desc: '油圧ショベル / ホイールローダー / ブルドーザー / フォークリフト。その他重機も買取致します。お気軽にご相談下さい。',
  },
  {
    name: '発電機',
    image: '/images/000machine3.gif',
    desc: 'サイクロンコンバーター発電機 / インバーター発電機 / 三相発電機。その他発電機も買取致します。お気軽にご相談下さい。',
  },
];

export default function MachinePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Image
          src="/images/machine001.png"
          alt="建設重機買取"
          width={800}
          height={200}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {ITEMS.map((item) => (
          <div key={item.name} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex">
              <Image src={item.image} alt={item.name} width={200} height={150} className="object-cover w-[200px] h-[150px]" />
              <div className="p-4 flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                <p className="text-brand-dark font-bold text-xl mb-2">
                  <a href="tel:048-483-6687" className="text-orange-600 hover:underline">要問合せ</a>
                </p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-green-50 rounded-lg p-6 text-center">
        <p className="text-lg font-bold text-gray-800 mb-3">
          建設重機の買取についてはお気軽にお問い合わせください
        </p>
        <a
          href="tel:048-483-6687"
          className="text-brand-dark font-bold text-2xl hover:underline"
        >
          TEL: 048-483-6687
        </a>
        <p className="text-brand-dark font-bold text-2xl mt-1">FAX: 048-483-6688（24時間OK）</p>
        <p className="text-sm text-gray-500 mt-2">営業時間: AM8:30〜PM7:00 / 年中無休</p>
        <a
          href="/contact"
          className="inline-block mt-4 bg-brand text-gray-800 font-bold px-8 py-3 rounded-lg hover:bg-brand-dark transition-colors text-lg"
        >
          お問い合わせフォームへ →
        </a>
      </div>
    </div>
  );
}
