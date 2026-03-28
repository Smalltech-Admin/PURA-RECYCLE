import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '自動車買取',
  description: 'ミニバン・ワンボックス・ハイブリッド・軽自動車等を買取。お気軽にご相談ください。',
};

const ITEMS = [
  {
    name: '自動車',
    image: '/images/000motercar.gif',
    desc: 'ミニバン / ワンボックス / ハイブリッド / 軽自動車。その他車両も買取致します。お気軽にご相談下さい。',
  },
];

export default function MotercarPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-green-700 pb-3 text-center">
        自動車買取
      </h1>

      <div className="mb-8">
        <Image
          src="/images/motercar001.png"
          alt="自動車買取"
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
                <p className="text-green-700 font-bold text-xl mb-2">
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
          自動車の買取についてはお気軽にお問い合わせください
        </p>
        <a
          href="tel:048-483-6687"
          className="text-green-700 font-bold text-2xl hover:underline"
        >
          TEL: 048-483-6687
        </a>
        <p className="text-green-700 font-bold text-2xl mt-1">FAX: 048-483-6688（24時間OK）</p>
        <p className="text-sm text-gray-500 mt-2">営業時間: AM8:30〜PM7:00 / 年中無休</p>
      </div>
    </div>
  );
}
