import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qclaw.tencent.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '先生 · 为现代人代写一封侨批',
  description: '一个由先生代笔的侨批生成器。给爸爸、妈妈、阿公、阿嬷,写一封 100 年前的信。',
  openGraph: {
    title: '先生在等你',
    description: '为现代人代写一封侨批',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '先生在等你',
    description: '为现代人代写一封侨批',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4ecd8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-paper text-ink">{children}</body>
    </html>
  );
}
