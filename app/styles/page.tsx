import type { Metadata } from 'next';
import { StylesClient } from './StylesClient';

export const metadata: Metadata = {
  title: '选择笔法 · 侨批生成器 — 南洋商旅体、闺阁守望体、少年游子体、暮年回望体',
  description:
    '侨批生成器四种笔法：南洋商旅体写给父亲爷爷、闺阁守望体写给阿嬷母亲妻子、少年游子体写给故友同窗、暮年回望体写给已故亲人。致敬《给阿嬷的情书》。',
  openGraph: {
    title: '选择笔法 · 侨批生成器',
    description:
      '南洋商旅体、闺阁守望体、少年游子体、暮年回望体——选一种笔法，让先生替你写一封侨批。',
  },
};

export default function StylesPage() {
  return <StylesClient />;
}
