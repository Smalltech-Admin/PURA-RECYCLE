import Link from 'next/link';
import { AppImage as Image } from '@/components/AppImage';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">株式会社プラ・リサイクル</h3>
            <p className="text-sm leading-relaxed">
              〒352-0004<br />
              埼玉県新座市大和田2-1-29<br />
              TEL: <a href="tel:048-483-6687" className="text-green-400 hover:underline">048-483-6687</a><br />
              FAX: 048-483-6688（24時間OK）
            </p>
            <p className="text-sm mt-2">
              営業時間: AM8:30〜PM7:00 / 年中無休
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">サイトマップ</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/" className="hover:text-green-400">トップページ</Link></li>
              <li><Link href="/nonmetal" className="hover:text-green-400">非鉄金属買取</Link></li>
              <li><Link href="/businessinfo" className="hover:text-green-400">買取の案内</Link></li>
              <li><Link href="/company" className="hover:text-green-400">会社概要</Link></li>
              <li><Link href="/access" className="hover:text-green-400">アクセスマップ</Link></li>
              <li><Link href="/contact" className="hover:text-green-400">お問合せ</Link></li>
              {/* <li><Link href="/machine" className="hover:text-green-400">建設重機買取</Link></li> */}
              {/* <li><Link href="/motercar" className="hover:text-green-400">自動車買取</Link></li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">許可情報</h3>
            <p className="text-sm leading-relaxed">
              古物商許可番号: 431360021467<br />
              （埼玉県公安委員会許可）
            </p>
            <div className="mt-4">
              <a
                href="https://ja-jp.facebook.com/pages/%E3%83%97%E3%83%A9%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB/491338754236880"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity max-w-full"
              >
                <Image src="/images/facebook.gif" alt="Facebook" width={345} height={120} className="h-[60px] w-auto max-w-full" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          Copyright (C) {new Date().getFullYear()} PURA RECYCLE Corporation. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
