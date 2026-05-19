'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { EnvelopeOpen } from '@/components/EnvelopeOpen';
import { LetterPaper } from '@/components/LetterPaper';
import { PaperBackground } from '@/components/PaperBackground';
import { normalizeRemittanceAmount } from '@/lib/remittance';
import { isStyleKey, STYLES, type StyleKey } from '@/lib/styles';

interface Stored {
  style: StyleKey;
  body: string;
  signature: string;
  remittanceAmount?: number | null;
  ts: number;
}

function isWeChat() {
  return /MicroMessenger/i.test(navigator.userAgent);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  }
}

function RemittanceArrival({ amount, onClose }: { amount: number; onClose: () => void }) {
  return (
    <motion.div
      key="remittance-arrival"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 px-4 pb-6 sm:items-center sm:pb-0"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm border border-ink/25 bg-paper p-5 text-center text-ink shadow-[0_18px_60px_-30px_rgba(60,40,20,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mx-auto mb-6 h-36 w-60">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -24, rotate: i % 2 ? -18 : 18 }}
              animate={{ opacity: [0, 1, 1], y: [0, 34 + i * 3, 32 + i * 3], rotate: i % 2 ? -8 : 8 }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: 'easeOut' }}
              className="absolute top-0 z-10 h-8 w-8 rounded-full border border-seal-red/50 bg-[#d8b45f] shadow-sm"
              style={{ left: `${30 + i * 42}px` }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -4 }}
            animate={{ opacity: 1, y: 62, rotate: -2 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-8 z-20 flex h-14 w-40 -translate-x-1/2 items-center justify-center border border-ink/30 bg-[#e8dcc0] font-master text-lg tracking-[0.22em] shadow-[0_8px_24px_-16px_rgba(60,40,20,0.65)]"
          >
            港 纸 {amount}
          </motion.div>
        </div>
        <p className="font-master text-xl tracking-[0.28em]">随 批 寄 来 港 纸</p>
        <p className="mt-3 text-sm leading-7 tracking-widest opacity-70">
          这封侨批里,除了问候,还随附港纸 {amount}。旧时一封信常常也是一家人的生活费。
        </p>
        <button type="button" className="ink-button mt-5 px-5 py-2 text-xs" onClick={onClose}>
          收 下
        </button>
      </motion.div>
    </motion.div>
  );
}

function DownloadProgress() {
  return (
    <motion.div
      key="download-progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/35 px-4 pb-6 sm:items-center sm:pb-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-xs border border-ink/25 bg-paper px-6 py-7 text-center text-ink shadow-[0_18px_60px_-30px_rgba(60,40,20,0.65)]"
      >
        <div className="relative mx-auto mb-5 h-24 w-36">
          <motion.div
            initial={{ y: 8, opacity: 0.65 }}
            animate={{ y: [8, 0, 8], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-4 top-0 h-20 w-28 border border-ink/25 bg-[#e8dcc0] shadow-[0_8px_24px_-18px_rgba(60,40,20,0.75)]"
          >
            <motion.div
              initial={{ x: -52 }}
              animate={{ x: 92 }}
              transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-8 bg-white/25"
            />
            <div className="absolute left-3 top-3 h-1 w-12 bg-ink/25" />
            <div className="absolute right-3 top-3 h-10 w-1 bg-ink/20" />
            <div className="absolute bottom-3 left-4 h-8 w-8 border border-seal-red/45" />
          </motion.div>
          <motion.div
            initial={{ y: 54, opacity: 0.8 }}
            animate={{ y: [54, 50, 54], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-0 right-0 h-9 border border-ink/30 bg-[#d8c8a8]"
          >
            <div className="absolute left-0 right-0 top-0 h-px bg-ink/25" />
            <div className="absolute left-1/2 top-0 h-9 w-px rotate-[-63deg] bg-ink/20" />
            <div className="absolute left-1/2 top-0 h-9 w-px rotate-[63deg] bg-ink/20" />
          </motion.div>
        </div>
        <p className="font-master text-lg tracking-[0.3em]">正 在 装 进 信 封</p>
        <p className="mt-3 text-sm leading-7 tracking-widest opacity-70">
          正在生成图片,可能需要几秒。请不要关闭页面。
        </p>
        <div className="mt-4 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.14 }}
              className="h-1.5 w-1.5 rounded-full bg-ink/55"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function LetterClient({ id }: { id: string }) {
  const router = useRouter();
  const paperRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Stored | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [cameFromShare, setCameFromShare] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [stampDown, setStampDown] = useState(false);
  const [compact, setCompact] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [savePreview, setSavePreview] = useState<string | null>(null);
  const [wechatShareUrl, setWechatShareUrl] = useState<string | null>(null);
  const [remittanceNoticeOpen, setRemittanceNoticeOpen] = useState(false);
  const [queuedRemittanceNotice, setQueuedRemittanceNotice] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const raw = sessionStorage.getItem(`qiaopi:letter:${id}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Stored;
        if (isStyleKey(parsed.style) && parsed.body) {
          setData({
            ...parsed,
            remittanceAmount:
              typeof parsed.remittanceAmount === 'number'
                ? normalizeRemittanceAmount(parsed.remittanceAmount)
                : null,
          });
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
          remittanceAmount?: unknown;
        };
        if (cancelled) return;
        if (!json.success || !isStyleKey(json.style ?? '') || !json.body) {
          setMissing(true);
          setLoading(false);
          return;
        }
        const remittanceAmount =
          typeof json.remittanceAmount === 'number'
            ? normalizeRemittanceAmount(json.remittanceAmount)
            : null;
        setData({
          style: json.style as StyleKey,
          body: json.body,
          signature: json.signature ?? '',
          remittanceAmount,
          ts: Date.now(),
        });
        setCameFromShare(true);
        if (remittanceAmount) setQueuedRemittanceNotice(true);
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
    const t1 = setTimeout(() => setRevealed(true), 650);
    const paragraphCount = data.body.split(/\n+/).filter(Boolean).length;
    const stampDelay = 650 + 220 + paragraphCount * 300 + 450;
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
    if (downloadBusy) return;
    if (!def.allowDownload) {
      showToast('这一封不下载,留在心里就好。');
      return;
    }
    const node = paperRef.current;
    if (!node) return;
    setDownloadBusy(true);

    // 检测能否真的触发文件下载: 微信、iOS Safari 都不支持 <a download>
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const noDirectDownload = isWeChat() || isIOS;

    try {
      // 1) 字体没加载完就截图,文字会糊或丢字
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const lib = await import('html-to-image');
      const baseOpts = {
        quality: 0.95,
        // pixelRatio 3 在 iOS 上常导致 data URL 超过 6MB 直接挂掉,降到 2
        pixelRatio: 2,
        backgroundColor: def.paperColor,
        cacheBust: true,
        // 字体/图 CORS 失败时给个透明占位,不阻断整张图
        imagePlaceholder:
          'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      } as const;

      let dataUrl = '';
      try {
        dataUrl = await lib.toPng(node, baseOpts);
      } catch (pngErr) {
        // PNG 失败时降级到 JPEG (体积更小,更兼容)
        console.warn('toPng failed, falling back to toJpeg', pngErr);
        dataUrl = await lib.toJpeg(node, { ...baseOpts, quality: 0.92 });
      }

      if (!dataUrl) throw new Error('empty dataUrl');

      if (noDirectDownload) {
        // 微信 / iOS: 弹出大图,引导长按保存(浏览器/微信里唯一能成功保存的路径)
        setSavePreview(dataUrl);
      } else {
        // 桌面 / Android Chrome: 走标准下载链接
        const link = document.createElement('a');
        link.download = `侨批-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('已保存为图片到下载文件夹。');
      }
    } catch (err) {
      // 真实错误打到 console,便于在 DevTools / Vercel 日志里查
      console.error('letter export failed', err);
      showToast('导出失败,先生稍后再试。');
    } finally {
      setDownloadBusy(false);
    }
  };

  const handleShare = async () => {
    if (!def.allowDownload) {
      showToast('放进抽屉了。');
      return;
    }
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      const shareText = `先生替我写了一封侨批,给你看看。\n${url}`;
      if (isWeChat()) {
        const copied = await copyText(url);
        setWechatShareUrl(url);
        showToast(copied ? '链接已复制 · 可直接粘贴给朋友' : '请手动复制链接发给朋友');
        return;
      }
      if (navigator.share) {
        try {
          // 只传 url:同时传 text 会让 iOS 分享出去的链接被 WeChat 误拼,转发后静默关闭
          await navigator.share({ title: '一封侨批 · 先生代写', url });
          return;
        } catch {
          // fall through to clipboard
        }
      }
      await navigator.clipboard.writeText(shareText);
      showToast('链接已复制 · 微信里点开后,「...」转发会生成卡片');
    } catch (err) {
      showToast('分享失败,先生原谅你。');
    }
  };

  return (
    <PaperBackground color="#f4ecd8" className="relative min-h-screen w-full px-4 pb-16 pt-8 text-ink sm:px-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 sm:gap-10">
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
          initial={cameFromShare ? { opacity: 0 } : { opacity: 0, y: -200, rotate: -2 }}
          animate={cameFromShare ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
          transition={
            cameFromShare
              ? { duration: 0.65, delay: 0.1, ease: 'easeOut' }
              : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
          }
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

        {cameFromShare && data.remittanceAmount && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mx-auto border border-seal-red/35 bg-seal-red/5 px-4 py-2 text-center text-xs tracking-[0.2em] text-seal-red sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.25em]"
          >
            随 批 寄 来 港 纸 {data.remittanceAmount}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: stampDown ? 1 : 0, y: stampDown ? 0 : 8 }}
          transition={{ duration: 0.9 }}
          className="grid grid-cols-3 items-start gap-2 pt-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-4 sm:pt-2"
        >
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloadBusy}
              className="ink-button result-action-button"
            >
              {downloadBusy ? '装 封 中' : def.downloadLabel}
            </button>
            <span className="hidden text-[10px] tracking-[0.3em] opacity-50 sm:block">
              {def.allowDownload ? '保 存 为 图 片 到 本 地' : '不 下 载,只 留 在 心 里'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link href="/styles" className="ink-button ghost result-action-button">
              再 写 一 封
            </Link>
            <Link
              href="/letters"
              className="hidden text-[10px] tracking-[0.3em] opacity-50 transition-opacity hover:opacity-90 sm:block"
            >
              换 种 笔 法 再 写 · 或 看 过 往 →
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button type="button" onClick={handleShare} className="ink-button ghost result-action-button">
              {def.shareLabel}
            </button>
            <span className="hidden text-[10px] tracking-[0.3em] opacity-50 sm:block">
              {def.allowDownload ? '复 制 链 接 寄 给 亲 人' : '放 进 抽 屉,不 寄 出'}
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {downloadBusy && <DownloadProgress />}
        {remittanceNoticeOpen && data.remittanceAmount && (
          <RemittanceArrival
            amount={data.remittanceAmount}
            onClose={() => setRemittanceNoticeOpen(false)}
          />
        )}
        {wechatShareUrl && (
          <motion.div
            key="wechat-share-guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 px-4 pb-6 sm:items-center sm:pb-0"
            onClick={() => setWechatShareUrl(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm border border-ink/25 bg-paper p-5 text-ink shadow-[0_18px_60px_-30px_rgba(60,40,20,0.65)]"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="font-master text-lg tracking-[0.3em]">微 信 里 分 享</p>
              <p className="mt-3 text-sm leading-7 tracking-widest opacity-70">
                微信内置浏览器不能由网页按钮直接转发。点右上角「...」再选「转发给朋友」; 如果还卡住,直接把下面链接粘贴给朋友。
              </p>
              <p className="mt-4 break-all border border-ink/15 bg-white/30 px-3 py-2 text-xs leading-5 opacity-75">
                {wechatShareUrl}
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  className="ink-button ghost px-4 py-2 text-xs"
                  onClick={async () => {
                    const copied = await copyText(wechatShareUrl);
                    showToast(copied ? '链接已复制。' : '复制失败,请长按链接复制。');
                  }}
                >
                  复 制 链 接
                </button>
                <button type="button" className="ink-button px-4 py-2 text-xs" onClick={() => setWechatShareUrl(null)}>
                  知 道 了
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
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

      <EnvelopeOpen
        open={envelopeOpen}
        onDone={() => {
          setEnvelopeOpen(false);
          if (queuedRemittanceNotice) {
            setQueuedRemittanceNotice(false);
            setRemittanceNoticeOpen(true);
          }
        }}
      />

      <AnimatePresence>
        {savePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/85 px-5 py-8 backdrop-blur-sm"
            onClick={() => setSavePreview(null)}
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex max-h-full max-w-full flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center text-[12px] tracking-[0.35em] text-paper/90">
                长 按 图 片 · 保 存 到 相 册
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={savePreview}
                alt="侨批"
                className="max-h-[72vh] w-auto max-w-full select-none border border-paper/20 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
              <button
                type="button"
                onClick={() => setSavePreview(null)}
                className="mt-2 border border-paper/40 px-5 py-1.5 text-[11px] tracking-[0.35em] text-paper/90 transition-colors hover:bg-paper/10"
              >
                收 起
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaperBackground>
  );
}
