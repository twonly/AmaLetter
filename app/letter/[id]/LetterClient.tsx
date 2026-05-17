'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { EnvelopeOpen } from '@/components/EnvelopeOpen';
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
  const [loading, setLoading] = useState(true);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [stampDown, setStampDown] = useState(false);
  const [compact, setCompact] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const raw = sessionStorage.getItem(`qiaopi:letter:${id}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Stored;
        if (isStyleKey(parsed.style) && parsed.body) {
          setData(parsed);
          setLoading(false);
          return () => {
            cancelled = true;
          };
        }
      } catch {
        // fall through to API fetch
      }
    }
    // No sessionStorage match → assume this is a shared link, fetch from server
    (async () => {
      try {
        const res = await fetch(`/api/letter/${encodeURIComponent(id)}`, { cache: 'no-store' });
        if (cancelled) return;
        if (!res.ok) {
          setMissing(true);
          setLoading(false);
          return;
        }
        const json = (await res.json()) as {
          success?: boolean;
          style?: string;
          body?: string;
          signature?: string;
        };
        if (cancelled) return;
        if (!json.success || !isStyleKey(json.style ?? '') || !json.body) {
          setMissing(true);
          setLoading(false);
          return;
        }
        setData({
          style: json.style as StyleKey,
          body: json.body,
          signature: json.signature ?? '',
          ts: Date.now(),
        });
        setEnvelopeOpen(true);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setMissing(true);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!data || envelopeOpen) return;
    const t1 = setTimeout(() => setRevealed(true), 1300);
    const paragraphCount = data.body.split(/\n+/).filter(Boolean).length;
    const stampDelay = 1300 + 400 + paragraphCount * 550 + 900 + 600;
    const t2 = setTimeout(() => setStampDown(true), stampDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [data, envelopeOpen]);

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
      showToast('已保存为图片到下载文件夹。');
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
      const url = typeof window !== 'undefined' ? window.location.href : '';
      if (navigator.share) {
        try {
          await navigator.share({ title: '先生在等你', text: '我请先生替你写了一封侨批', url });
          return;
        } catch {
          // fall through to clipboard
        }
      }
      await navigator.clipboard.writeText(url);
      showToast('链接已复制,寄给亲人即可打开。');
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
          <a
            href="https://qclaw.qq.com?channel=6070&share_type=invite-share&invite_code=HnjykQYlfxAZkR92"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-baseline gap-1 text-[12px] tracking-[0.25em] text-seal-red transition-all hover:tracking-[0.35em]"
          >
            <span className="font-master">由 </span>
            <span className="font-master text-[15px] font-semibold underline decoration-seal-red/30 decoration-from-font underline-offset-4 transition-colors group-hover:decoration-seal-red">QClaw</span>
            <span className="font-master"> 支持</span>
            <span className="ml-1 text-[10px] tracking-widest opacity-70">qclaw.qq.com →</span>
          </a>
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
            compact={compact}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: stampDown ? 1 : 0, y: stampDown ? 0 : 8 }}
          transition={{ duration: 0.9 }}
          className="flex flex-wrap items-start justify-center gap-x-8 gap-y-4 pt-2"
        >
          <div className="flex flex-col items-center gap-2">
            <button type="button" onClick={handleDownload} className="ink-button">
              {def.downloadLabel}
            </button>
            <span className="text-[10px] tracking-[0.3em] opacity-50">
              {def.allowDownload ? '保 存 为 图 片 到 本 地' : '不 下 载,只 留 在 心 里'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link href="/styles" className="ink-button ghost">
              再 写 一 封
            </Link>
            <Link
              href="/letters"
              className="text-[10px] tracking-[0.3em] opacity-50 transition-opacity hover:opacity-90"
            >
              换 种 笔 法 再 写 · 或 看 过 往 →
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button type="button" onClick={handleShare} className="ink-button ghost">
              {def.shareLabel}
            </button>
            <span className="text-[10px] tracking-[0.3em] opacity-50">
              {def.allowDownload ? '复 制 链 接 寄 给 亲 人' : '放 进 抽 屉,不 寄 出'}
            </span>
          </div>
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

      <EnvelopeOpen open={envelopeOpen} onDone={() => setEnvelopeOpen(false)} />
    </PaperBackground>
  );
}
