import type { Metadata } from 'next';
import { LettersClient } from './LettersClient';

export const metadata: Metadata = {
  title: '我写过的侨批 · 侨批生成器',
  description: '查看你在侨批生成器「先生」中写过的侨批历史。每一封侨批都留在本地，致敬《给阿嬷的情书》。',
  robots: { index: false, follow: true },
};

export default function LettersPage() {
  return <LettersClient />;
}
