'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { GeneratingModal } from '@/components/GeneratingModal';
import { PaperBackground } from '@/components/PaperBackground';
import { isStyleKey, STYLES } from '@/lib/styles';

const PLACEHOLDER =
  '先生,你说,我写。\n\n你最近想跟 ta 说什么?家里、工作、想念、愧疚、还是只是想说一声你过得还好。请像聊天一样告诉我,不用润色。';

const HINT = '提示:越具体越好。一只小时候的猫、一道吃过的菜、一句没说出口的话,都可以告诉先生。';

export function WriteClient() {
  const router = useRouter();
  const params = useSearchParams();
  const styleParam = params.get('style');
  const [text, setText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [withMoney, setWithMoney] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isStyleKey(styleParam)) {
      router.replace('/styles');
    }
  }, [styleParam, router]);

  const def = useMemo(() => (isStyleKey(styleParam) ? STYLES[styleParam] : null), [styleParam]);

  if (!def) return null;

  const handleSubmit = async () => {
    if (text.trim().length < 4) {
      setError('再多说几句吧,先生才好下笔。');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          style: def.key,
          userInput: text,
          withMoney: def.key === 'remembrance' ? false : withMoney,
          recipient,
        }),
      });
      const data = await res.json();
      if (data.blocked && data.blockReason === 'self-harm') {
        setLoading(false);
        sessionStorage.setItem(
          'qiaopi:self-harm',
          JSON.stringify({ message: data.letter as string, ts: Date.now() })
        );
        router.push('/care');
        return;
      }
      if (!data.success) {
        setLoading(false);
        setError(data.blockReason || '先生没能落笔,稍后再试。');
        return;
      }
      const id = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(
        `qiaopi:letter:${id}`,
        JSON.stringify({
          style: def.key,
          body: data.letter as string,
          signature: data.signature as string,
          ts: Date.now(),
        })
      );
      setText('');
      router.push(`/letter/${id}`);
    } catch (err) {
      setLoading(false);
      setError('线路不通,稍后再试。');
    }
  };

  return (
    <PaperBackground color="#f4ecd8" className="min-h-screen w-full px-6 py-16 text-ink">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex items-center justify-between"
        >
          <Link href="/styles" className="text-xs tracking-[0.3em] opacity-50 hover:opacity-100">
            ← 换 一 种 笔 法
          </Link>
          <span className="border border-ink/30 px-3 py-1 text-[11px] tracking-[0.3em] opacity-70">
            {def.name}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="flex flex-col gap-6"
        >
          <div>
            <label className="mb-2 block text-xs tracking-[0.3em] opacity-60">写 给 谁</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="妈 / 阿公 / 老李 / 我那只走了的狸花"
              maxLength={20}
              className="w-full border border-ink/30 bg-transparent px-4 py-3 text-sm tracking-widest outline-none transition-colors focus:border-ink"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs tracking-[0.3em] opacity-60">你 想 说 的 话</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              maxLength={2000}
              rows={10}
              className="scrollbar-paper w-full resize-none border border-ink/30 bg-transparent p-5 text-[15px] leading-loose tracking-wide outline-none transition-colors focus:border-ink"
            />
            <p className="mt-2 text-[11px] tracking-widest opacity-55">{HINT}</p>
          </div>

          {def.key !== 'remembrance' && (
            <label className="flex items-center justify-between border border-ink/20 px-5 py-4 text-sm">
              <span className="flex flex-col gap-1">
                <span className="tracking-widest">是 否 寄「银 两」</span>
                <span className="text-[11px] tracking-wider opacity-55">
                  开启后,先生会在信中附一段寄钱的话,沿用旧时银信合一的传统。
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={withMoney}
                onClick={() => setWithMoney((v) => !v)}
                className="relative h-6 w-12 border border-ink/40 transition-colors"
                style={{ backgroundColor: withMoney ? '#1a1a1a' : 'transparent' }}
              >
                <span
                  className="absolute top-0.5 h-4 w-4 transition-all"
                  style={{
                    left: withMoney ? 26 : 2,
                    backgroundColor: withMoney ? '#f4ecd8' : '#1a1a1a',
                  }}
                />
              </button>
            </label>
          )}

          {error && (
            <div className="border-l-2 border-seal-red bg-seal-red/5 px-4 py-3 text-sm tracking-wider text-seal-red">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] tracking-widest opacity-50">{text.length} / 2000</span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="ink-button"
            >
              {loading ? '先 生 在 写' : '请 先 生 写'}
            </button>
          </div>
        </motion.div>
      </div>

      <GeneratingModal open={loading} />
    </PaperBackground>
  );
}
