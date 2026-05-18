import type { Metadata } from 'next';
import { readLetter } from '@/lib/db';
import { isStyleKey, STYLES } from '@/lib/styles';
import { LetterClient } from './LetterClient';

export const dynamic = 'force-dynamic';

function siteBase(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://amaletter.com';
}

const FALLBACK: Metadata = {
  title: '先生 · 为现代人代写一封侨批',
  description: '百年前他坐在祠堂门口替不识字的乡亲写信。让先生替你写一封,致敬《给阿嬷的情书》。',
  openGraph: {
    title: '先生 · 一封侨批',
    description: '百年前他坐在祠堂门口替不识字的乡亲写信。让先生替你写一封,致敬《给阿嬷的情书》。',
    images: ['/poster.jpg'],
    type: 'article',
    siteName: '先生 · 侨批',
  },
  twitter: {
    card: 'summary_large_image',
    title: '先生 · 一封侨批',
    description: '百年前他坐在祠堂门口替不识字的乡亲写信。让先生替你写一封。',
    images: ['/poster.jpg'],
  },
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  const base = siteBase();
  const canonicalUrl = `${base}/letter/${id}`;
  // canonical 单独存放,fallback / 命中 都要单独指向当前 letter 链接,
  // 避免被 layout 的 alternates.canonical = siteUrl 拖去首页
  const fallbackWithCanonical: Metadata = {
    ...FALLBACK,
    alternates: { canonical: canonicalUrl },
    // 单封信不允许被搜索引擎收录(每封信是一次性私域内容),但仍允许跟踪外链
    robots: { index: false, follow: true },
  };
  try {
    const letter = await readLetter(id);
    if (!letter || !isStyleKey(letter.style)) return fallbackWithCanonical;
    const def = STYLES[letter.style];

    const headline =
      letter.body.split(/[\n。,，;；]/).map((s) => s.trim()).filter(Boolean)[0]?.slice(0, 26) ||
      '一封侨批';
    const preview = letter.body.replace(/\s+/g, ' ').slice(0, 70);
    const description = preview + (letter.body.length > 70 ? '…' : '');
    const title = `${headline} · 先生代写的一封侨批`;
    const imageUrl = `${base}/poster.jpg`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      // 单封信内容因人而异 + 是分享私域链接,不进 Google 索引,但允许 follow 链接
      robots: { index: false, follow: true },
      openGraph: {
        title,
        description: `${description}\n\n— ${def.name} · 致敬《给阿嬷的情书》`,
        images: [{ url: imageUrl, width: 1017, height: 572, alt: title }],
        type: 'article',
        siteName: '先生 · 侨批',
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      other: {
        // 微信小程序/朋友圈分享时部分客户端会读 itemprop
        'itemprop:name': title,
        'itemprop:description': description,
        'itemprop:image': imageUrl,
      },
    };
  } catch {
    return fallbackWithCanonical;
  }
}

export default function LetterPage({ params }: { params: { id: string } }) {
  return <LetterClient id={params.id} />;
}
