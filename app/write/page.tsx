import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WriteClient } from './WriteClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '写一封侨批 · 侨批生成器 — AI 替你代写百年前的信',
  description:
    '告诉先生你想写给谁、想说些什么，AI 侨批生成器为你代写一封百年前的侨批。给阿嬷、给爸、给故友、给已经离开的人。',
  openGraph: {
    title: '写一封侨批 · 侨批生成器',
    description: '告诉先生你想说的话，为你代写一封侨批。致敬《给阿嬷的情书》。',
  },
};

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <WriteClient />
    </Suspense>
  );
}
