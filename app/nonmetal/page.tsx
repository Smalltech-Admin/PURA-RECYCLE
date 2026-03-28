import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '非鉄金属買取',
  description: '銅・電線・バッテリー・真鍮・モーター・ラジエター・鉛・ホイール・特殊金属等の非鉄金属を高価買取。',
};

const CATEGORIES = [
  { href: '/nonmetal/dou', label: '銅', image: '/images/top-dou.gif', desc: '1号銅(ピカ銅)・2号銅・並銅・込銅 等' },
  { href: '/nonmetal/densen', label: '電線', image: '/images/top-sen.gif', desc: '1本線・3本線・VA線・家電線・ハーネス' },
  { href: '/nonmetal/battery', label: 'バッテリー', image: '/images/top-battery.gif', desc: '車用・工業用・フォークリフト用 等' },
  { href: '/nonmetal/shinchuu', label: '真鍮・砲金', image: '/images/top-shinchuu.gif', desc: '真鍮・混真鍮・砲金・バルブ砲金 等' },
  { href: '/nonmetal/moter', label: 'モーター', image: '/images/top-moter.gif', desc: 'MIX・セルモーター・コンプレッサー・ダイナモ' },
  { href: '/nonmetal/radieter', label: 'ラジエター', image: '/images/top-radieter.gif', desc: 'エアコン・アルミ・真鍮or半銅' },
  { href: '/nonmetal/namari', label: '鉛', image: '/images/top-nama.gif', desc: '鉛・鉛板・鉛管・バランスウエイト' },
  { href: '/nonmetal/hoile', label: 'ホイール', image: '/images/top-arh.gif', desc: 'ホイール(付物有)・ホイール1P(付物無)' },
  { href: '/nonmetal/tokushu', label: '特殊金属', image: '/images/top-tokushukin.gif', desc: 'ニッケル・ニクロム・チタン・洋銀 等' },
  { href: '/nonmetal/other', label: 'その他', image: '/images/top-stain.gif', desc: 'ステンレス・給湯器・エアコン・基板 等' },
];

export default function NonmetalPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-green-700 pb-3">
        非鉄金属買取
      </h1>

      <div className="mb-8">
        <Image
          src="/images/nonmetal001.png"
          alt="非鉄金属買取"
          width={800}
          height={300}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden group"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              width={400}
              height={300}
              className="w-full h-auto"
            />
            <div className="p-5 text-center">
              <h2 className="font-bold text-gray-800 text-2xl mb-2">{cat.label}</h2>
              <p className="text-sm text-gray-600 mb-3">{cat.desc}</p>
              <p className="text-green-700 text-sm font-medium group-hover:underline">
                詳細・買取価格を見る →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
