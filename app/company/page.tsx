import type { Metadata } from 'next';
import { AppImage as Image } from '@/components/AppImage';

export const metadata: Metadata = {
  title: '会社概要',
  description: '株式会社プラ・リサイクルの会社概要。埼玉県新座市で非鉄金属・建設重機・自動車の買取を行っています。',
};

export default function CompanyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 border-b-2 border-brand pb-3 text-center">
        会社概要
      </h1>

      <div className="mb-8">
        <Image
          src="/images/company-exterior.jpg"
          alt="株式会社プラ・リサイクル"
          width={800}
          height={225}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <table className="w-full text-sm md:text-base mb-16">
        <tbody>
          {[
            ['社名', '株式会社プラ・リサイクル'],
            ['代表者', 'クシャーン・プラサンガ (Kushan Prasanga)'],
            ['所在地', '〒352-0004 埼玉県新座市大和田2-1-29'],
            ['TEL', '0120-472-872 / 048-483-6687'],
            ['FAX', '048-483-6688（24時間OK）'],
            ['営業時間', 'AM8:30〜PM7:00 / 年中無休'],
            ['資本金', '3,000万円'],
            ['従業員数', '5名'],
            ['敷地面積', '140坪'],
            ['事業内容', '非金属類の買取・販売 / 産廃重機の買取・販売 / 自動車の買取・販売'],
            ['古物商許可番号', '431360021467（埼玉県公安委員会許可）'],
          ].map(([label, value], i) => (
            <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <th className="p-4 text-left text-brand-dark font-bold w-1/3 border-b border-gray-200 align-top">
                {label}
              </th>
              <td className="p-4 border-b border-gray-200">
                {label === 'TEL' ? (
                  <div className="space-y-1">
                    <a href="tel:0120-472-872" className="block text-brand-dark hover:underline font-bold">
                      フリーダイヤル: 0120-472-872
                    </a>
                    <a href="tel:048-483-6687" className="block text-brand-dark hover:underline font-bold">
                      TEL: 048-483-6687
                    </a>
                  </div>
                ) : (
                  value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 代表挨拶 */}
      <section>
        <h2 className="text-2xl font-bold text-brand-dark mb-6 border-l-4 border-brand pl-3">
          代表挨拶
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-6 max-w-lg mx-auto">
            <div className="text-left shrink-0">
              <p className="text-xl font-bold text-gray-700">株式会社 プラ・リサイクル</p>
              <p className="text-base text-gray-500 mt-1">代表取締役社長</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">クシャーン プラサンガ</p>
              <p className="text-base text-gray-500 mt-1">Kushan Prasanga</p>
            </div>
            <Image
              src="/images/soluprof2.gif"
              alt="代表取締役社長 クシャーン プラサンガ"
              width={160}
              height={200}
              className="rounded-lg w-[160px] h-auto shrink-0"
            />
          </div>
          <div>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                当社は非鉄金属リサイクル、自動車リサイクル、トラック・重機等の事業活動を行っています。培われたリサイクル技術及び物流管理を活し、視点・視野を広げ、事業活動による産業連携の和を活かし静脈産業として企業化を目指します。
              </p>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                私達環境産業の役割は、再生技術の向上とその活動により排出されるCO2の削減、低炭素社会への発展と貢献を重要視しなくてはなりません。
              </p>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                非鉄金属を使用し製品化することによりCO2の削減につながり環境産業化への促進・廃棄物の削減、循環型社会形へ向けて大いに貢献するものと考えています。
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                今後私達は、再生資源の高品質化、製品化、ブランド化へ向けて製造意識を持って選別・保管・処理・加工・販売・輸出における取組を精査し、そのリサイクル活動における環境保全や法令遵守の徹底、地域社会への貢献を目標に企業育成や事業進捗への取組を目指します。限りある地球資源のために、そして地球環境のために、総合資源リサイクル、自動車リサイクルにて貢献します。
              </p>
          </div>
        </div>
      </section>
    </div>
  );
}
