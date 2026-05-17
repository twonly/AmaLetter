'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LetterPaper } from '@/components/LetterPaper';
import { PaperBackground } from '@/components/PaperBackground';
import { isStyleKey, STYLES, type StyleKey } from '@/lib/styles';

interface Stored {
  style: StyleKey;
  body: string;
  signature: string;
  ts: number;
}

export function LetterClient({ id }: { id: string }) {
  const router = useRouter();
  const paperRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Stored | null>(null);
  const [missing, setMissing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [stampDown, setStampDown] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`qiaopi:letter:${id}`);
    if (!raw) {
      setMissing(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Stored;
      if (!isStyleKey(parsed.style) || !parsed.body) {
        setMissing(true);
        return;
      }
      setData(parsed);
    } catch {
      setMissing(true);
    }
  }, [id]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setVertical(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!data) return;
    const t1 = setTimeout(() => setRevealed(true), 1300);
    const paragraphCount = data.body.split(/\n+/).filter(Boolean).length;
    const stampDelay = 1300 + 400 + paragraphCount * 550 + 900 + 600;
    const t2 = setTimeout(() => setStampDown(true), stampDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  if (missing) {
    return (
      <PaperBackground color="#f4ecd8" className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-ink">
        <p className="font-master text-2xl tracking-widest">这封信先生没有留底。</p>
        <p className="text-sm tracking-widest opacity-60">每一封侨批写完即散,只此一份。</p>
        <Link href="/styles" className="ink-button mt-4">
          再 请 先 生 写 一 封
        </Link>
      </PaperBackground>
    );
  }

  if (!data) {
    return <PaperBackground color="#f4ecd8" className="min-h-screen w-full" />;
  }

  const def = STYLES[data.style];

  const handleDownload = async () => {
    if (!def.allowDownload) {
      showToast('这一封不下载,留在心里就好。');
      return;
    }
    const node = paperRef.current;
    if (!node) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, {
        quality: 0.95,
        pixelRatio: 3,
        backgroundColor: def.paperColor,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `侨批-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('已装进信封。');
    } catch (err) {
      showToast('导出失败,先生稍后再试。');
    }
  };

  const handleShare = async () => {
    if (!def.allowDownload) {
      showToast('放进抽屉了。');
      return;
    }
    try {
      const url = typeof window !== 'undefined' ? window.location.origin : '';
      const text = `我请先生替我写了一封侨批 · ${url}`;
      if (navigator.share) {
        await navigator.share({ title: '先生在等你', text, url });
        return;
      }
      await navigator.clipboard.writeText(text);
      showToast('链接已复制,可贴去小红书。');
    } catch (err) {
      showToast('分享失败,先生原谅你。');
    }
  };

  return (
    <PaperBackground color="#f4ecd8" className="relative min-h-screen w-full px-4 pb-24 pt-12 text-ink sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/styles" className="text-xs tracking-[0.3em] opacity-50 hover:opacity-100">
            ← 再 写 一 封
          </Link>
          <span className="text-[11px] tracking-[0.3em] opacity-50">
            由 QClaw 代写 · qclaw.tencent.com
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -200, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <LetterPaper
            ref={paperRef}
            styleKey={data.style}
            body={data.body}
            signature={data.signature}
            revealed={revealed}
            stampDown={stampDown}
            vertical={vertical}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: stampDown ? 1 : 0, y: stampDown ? 0 : 8 }}
          transition={{ duration: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button type="button" onClick={handleDownload} className="ink-button">
            {def.downloadLabel}
          </button>
          <Link href="/styles" className="ink-button ghost">
            再 写 一 封
          </Link>
          <button type="button" onClick={handleShare} className="ink-button ghost">
            {def.shareLabel}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none fixed inset-x-0 bottom-10 flex justify-center"
          >
            <div className="border border-ink/30 bg-paper px-5 py-2 text-sm tracking-widest text-ink/80 shadow-sm">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaperBackground>
  );
}
