import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductDescriptions } from '@/components/ProductDescriptions';

export const metadata: Metadata = {
  title: '買取の案内',
  description: '買取方法・買取可能商材・買取不可商材のご案内。',
};

export default function BusinessInfoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 border-b-2 border-brand pb-3 text-center">
        買取の案内
      </h1>

      {/* 買取方法 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-6 border-b-2 border-brand pb-2">
          買取方法について
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-5">
          <div className="flex gap-4 items-start">
            <span className="bg-brand text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shrink-0">1</span>
            <p className="text-lg text-gray-700">持ち込んで頂いた商材を当社スタッフが計量・査定致します。</p>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-brand text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shrink-0">2</span>
            <p className="text-lg text-gray-700">個々の単価に従って計算し、その場で買取り代金をお支払い致します。</p>
          </div>
          <div className="bg-yellow-50 p-5 rounded-lg text-base text-gray-600 space-y-2">
            <p>●基本的にご予約等は必要ありませんが、大口の持込の場合は事前にご確認下さい。</p>
            <p>●必ず仕分けを行い持って来て下さい。混載の場合、単価が異なりますのでご了承下さい。</p>
          </div>
          <div className="mt-6 text-center">
            <a
              href="#available-items"
              className="inline-block px-8 py-3 rounded-lg text-white font-bold text-lg hover:opacity-90 transition-opacity leading-tight"
              style={{ backgroundColor: '#5a8a30' }}
            >
              各買取商品詳細は<br className="md:hidden" />ここをクリック
            </a>
          </div>
        </div>
      </section>

      {/* 買取不可商材（先出し） */}
      <section className="mb-12">
        <div className="bg-red-50 rounded-lg p-6">
          <p className="text-red-700 font-bold text-lg">
            「ブラウン管モニター」「テレビ」「スピーカー」「冷蔵庫」などの家電は買取をしておりません。
          </p>
        </div>
      </section>

      {/* グレード定義 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-6 border-b-2 border-brand pb-2">
          買取グレードの定義
        </h2>
        <p className="text-base text-gray-600 mb-6">
          ピカ線であっても、汚れや部品の付着度合いによるグレード（1号銅A・Bへ）振り分けをさせて頂いており、持ち込み時に現物を見て判断させて頂きます。
        </p>

        <div className="space-y-6">
          {/* ピカ線 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2 border-b border-brand pb-2">ピカ線（特一号銅線・ピカ銅・1号銅）</h3>
            <p className="text-base text-gray-700 mb-3">断面直径が1.3mm以上の銅線で、錫(スズ)メッキ、エナメル、表面劣化等ないもの。</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>雑電線から被覆(皮)を取り除き銅線を取り出した<strong>剥き線</strong>を<strong>ピカ線(ピカ銅／特一号銅線)</strong>という。</li>
              <li>剥き線以外のものは<strong>並銅</strong>か<strong>込銅</strong>とする。</li>
              <li>油や紙、膜(まく)や塗装等の付着物がある場合はピカ線とはならない。</li>
              <li>平角線は<strong>並銅</strong>とする。</li>
              <li>結束する際は必ず「ピカ線」で結束すること。ピカ線以外で結束されている場合は「込銅」扱い。</li>
              <li>DV線を剥いた物は違う成分を添加している可能性がある為、並銅での買取りとする。</li>
            </ul>
          </div>

          {/* 並銅 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2 border-b border-brand pb-2">並銅（なみどう）</h3>
            <p className="text-base text-gray-700 mb-3">ダスト(付物)のない純銅(Cu：99.99%)</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>ダスト(付物)のあるものや他の金属が微量であっても混ざりがある銅は「込銅(こみどう)」として値下げ。</li>
              <li>ダスト(付物)の多いもの、焼いたもの、劣化の大きなものは「下銅(げどう)」として大きく値下げ。</li>
              <li>銅箔(薄い銅)は扱えないものもある。</li>
              <li><strong>金型銅</strong>は、ダスト(付物)がなくても銅の純度が低いので「込銅」とする。</li>
              <li><strong>屋根板(屋根材)の銅板</strong>は、防水材の塗布や釘等の付物があるので「込銅」または「下銅」とする。</li>
              <li>銅削粉の類は概して銅以外の混入や油付着があるので大きく減額する。</li>
              <li>給湯器の釜(赤釜や白釜)は、銅だけではない(異物付)のため並銅とはせず、個別品目として扱う。</li>
              <li>「油分の多い物」「溶接部分」「キャップ」「テープ」「半田」「アルミ箔の付着」「塗装」「被膜」があるものも「込銅」又は「下銅」として値下げ。</li>
            </ul>
          </div>

          {/* 込銅 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2 border-b border-brand pb-2">込銅（付物のある銅）</h3>
            <p className="text-base text-gray-700 mb-3">ダスト(付物)のある「並銅」は「込銅」とする。</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>ダスト(付物)の多いもの、焼いたもの、油の付着や劣化の大きなものは「下銅(げどう)」として大きく値下げ。</li>
              <li>銅箔(薄い銅)は扱えないものもある。</li>
              <li><strong>金型銅</strong>は、ダスト(付物)がなくても銅の純度が低いので「込銅」とする。</li>
              <li>空調銅配管に真鍮が付いているものも込銅として扱う。</li>
              <li>「皮」とは、空調銅配管に巻かれてある断熱材のこと。</li>
              <li>表面が劣化(黒、青、緑色等)していても構わない。</li>
              <li>スプリングやビニールテープ、キャップ、断熱材の残渣等は必ず除去すること。</li>
              <li>銅よりも真鍮の重量が多い物は「真鍮」での買取となる。</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 買取可能商材 */}
      <section id="available-items" className="mb-12 scroll-mt-32">
        <h2 className="text-2xl font-bold text-brand-dark mb-6 border-b-2 border-brand pb-2">
          買取可能取扱い商材
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Link href="/nonmetal" className="text-brand-dark font-bold text-lg hover:underline">
            → 買取価格一覧はこちら（全41品目）
          </Link>
        </div>
        <ProductDescriptions />
      </section>

      {/* その他買取可能 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-6 border-b-2 border-brand pb-2">
          その他家庭雑品（買取・引取可能な場合あり）
        </h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-base text-gray-600 leading-relaxed">
            パソコン関連機器 / ズボンプレッサー / 石油ストーブ / 浄水器 / 空気洗浄機 / ゲーム機 / ミシン /
            ガスストーブ / 炊飯器 / 消火器 / 電子レンジ / アイロン / ミキサー / ポット / 電気温水器 / 扇風機 /
            プリンター / ジューサー / コーヒーメーカー / ガスボンベ / 換気扇 / スキャナー / 電気ストーブ /
            ホットプレート / 自転車 / ラジカセ / コピー機 / 配電盤 / ラジコン / マウンテンバイク /
            CDラジカセ / オーブン / 各種ルーター / パトライト / アルミ調理器具 / 食器乾燥機 / トースター /
            キーボード / インターホン / ステンレス調理器具 / ガスコンロ / 加湿器 / 掃除機 / 電動工具 /
            草刈り機 / 冷風機 / 除湿器 / タイムレコーダー / ウォシュレット / 食器洗浄機 / コンポ / 電話器 /
            各種カメラ / トランシーバー / 製氷機 / スピーカー / FAX / ワープロ / 溶接機 / フライヤー /
            ビデオ / ドライヤー / DVDプレーヤー / 自動販売機 / レジスター / 照明器具(球無し) /
            業務用ガスレンジ / アンプ / 電飾看板 / シュレッダー / 餅つき機 / 厨房用品 / カーステレオ /
            医療機器 / 布団乾燥機 / フードカッター
          </p>
        </div>
      </section>

      {/* 買取不可 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-red-600 mb-6 border-b-2 border-red-600 pb-2">
          買取不可商材について
        </h2>

        <div className="bg-red-50 rounded-lg p-6 mb-6">
          <p className="text-red-700 font-bold text-lg">
            「ブラウン管モニター」「テレビ」「スピーカー」「冷蔵庫」などの家電は買取をしておりません。
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'リサイクルできないもの',
              items: '木、紙、ゴム、布（例：電気カーペット等）、ガラス（例：テレビ、パソコンモニター、蛍光灯等）、土、泥、コンクリート、断熱材、掃除機のホース、ビニール、大量のプラスティック',
            },
            {
              title: '液体',
              items: '水、油、燃料、あるいは液体を含むもの（例：燃料タンク、オイルホース等）',
            },
            {
              title: '不衛生なもの',
              items: '生ゴミ、ペットボトル、空き缶、食品トレー等の生活ゴミ、便器等',
            },
            {
              title: '危険物',
              items: '刃物、刀剣、針、及びそれらに似た形状で怪我の危険性があるもの、医療・生物系廃棄物',
            },
            {
              title: '有毒物',
              items: '強酸・強アルカリ（塩基）、有機水銀、PCBを含む可能性があるもの（例：キュービクル）等',
            },
            {
              title: '発火・燃焼する可能性があるもの',
              items: '電池、鉛バッテリー、UPS（無停電電源装置）、給油機等',
            },
            {
              title: 'その他',
              items: '冷蔵庫、金庫、密閉物（内容物を確認できないもの）',
            },
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-bold text-gray-800 text-base mb-1">●{section.title}</h3>
              <p className="text-base text-gray-600">{section.items}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
