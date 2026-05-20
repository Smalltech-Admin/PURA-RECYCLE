import type { Metadata } from "next";
import { Geist, M_PLUS_Rounded_1c, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ThemeController } from "@/components/ThemeController";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mPlusRounded = M_PLUS_Rounded_1c({
  variable: "--font-mplus-rounded",
  weight: ["900"],
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["900"],
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pura-recycle.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "株式会社プラ・リサイクル | 非鉄金属・建設重機・自動車買取【埼玉県新座市】",
    template: "%s | 株式会社プラ・リサイクル",
  },
  description:
    "埼玉県新座市の非鉄金属買取専門業者。銅・電線・バッテリー・真鍮・モーター・ラジエター等を高価買取。建設重機・自動車の買取も対応。年中無休 TEL:048-483-6687",
  keywords: [
    "非鉄金属 買取", "銅 買取", "電線 買取", "バッテリー 買取",
    "真鍮 買取", "モーター 買取", "ラジエター 買取", "鉛 買取",
    "ホイール 買取", "特殊金属 買取", "建設重機 買取", "自動車 買取",
    "スクラップ 買取", "金属リサイクル",
    "埼玉", "新座市", "プラリサイクル",
  ],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE_URL,
    siteName: '株式会社プラ・リサイクル',
    title: '株式会社プラ・リサイクル | 非鉄金属・建設重機・自動車買取【埼玉県新座市】',
    description: '埼玉県新座市の非鉄金属買取専門業者。銅・電線・バッテリー・真鍮等を高価買取。建設重機・自動車の買取も対応。年中無休。',
    images: [
      {
        url: '/images/company001.png',
        width: 800,
        height: 400,
        alt: '株式会社プラ・リサイクル',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '株式会社プラ・リサイクル | 非鉄金属・建設重機・自動車買取',
    description: '埼玉県新座市の非鉄金属買取専門業者。銅・電線・バッテリー・真鍮等を高価買取。',
    images: ['/images/company001.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console の確認コードを取得後に設定
    // google: 'xxxxxxxxxx',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${geistSans.variable} ${mPlusRounded.variable} ${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pb-24 md:pb-0">
        <LocalBusinessJsonLd />
        <ThemeController />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
