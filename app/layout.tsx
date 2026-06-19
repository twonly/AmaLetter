import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qiaopi-xiansheng.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '侨批生成器 · 先生 — 致敬《给阿嬷的情书》，AI 代写百年侨批',
  description:
    '侨批生成器「先生」，致敬电影《给阿嬷的情书》。AI 代笔为你写一封侨批——给爸爸、妈妈、阿公、阿嬷，南洋商旅体、闺阁守望体、少年游子体、暮年回望体四种笔法。',
  keywords: [
    '侨批生成器',
    '阿嬷的情书 侨批',
    '给阿嬷的情书',
    '侨批',
    'AI代写侨批',
    '南洋侨批',
    '潮汕侨批',
    '侨批代笔',
    '写信给阿嬷',
    '先生代写侨批',
  ],
  openGraph: {
    title: '侨批生成器 · 先生 — 致敬《给阿嬷的情书》',
    description:
      '百年前他替不识字的乡亲写信。现在让先生替你写一封侨批，给阿嬷、给爸、给远方的人。',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '侨批生成器·先生' }],
    type: 'website',
    siteName: '先生 · 侨批生成器',
    locale: 'zh_CN',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: '侨批生成器 · 先生 — 致敬《给阿嬷的情书》',
    description:
      '百年前他替不识字的乡亲写信。现在让先生替你写一封侨批，给阿嬷、给爸、给远方的人。',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION || '',
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
      '360-site-verification': process.env.SO360_SITE_VERIFICATION || '',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4ecd8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: '侨批生成器 · 先生',
        description: '致敬《给阿嬷的情书》，AI 代写百年侨批',
        inLanguage: 'zh-CN',
      },
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/#webapp`,
        url: siteUrl,
        name: '侨批生成器',
        description:
          '侨批生成器「先生」，致敬电影《给阿嬷的情书》。AI 代笔为你写一封侨批，给爸爸、妈妈、阿公、阿嬷。',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        inLanguage: 'zh-CN',
      },
    ],
  };

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink">
        {children}
        <BackgroundMusic />
        <Analytics />
      </body>
    </html>
  );
}
