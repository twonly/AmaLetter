'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PaperBackground } from '@/components/PaperBackground';
import { Seal } from '@/components/Seal';
import {
  clearHistory,
  formatRelativeTime,
  readHistory,
  removeHistory,
  type HistoryEntry,
} from '@/lib/history';
import { STYLES } from '@/lib/styles';

export function LettersClient() {
  const [list, setList] = useState<HistoryEntry[] | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setList(readHistory());
    setNow(Date.now());
  }, []);

  const handleRemove = (id: string) => {
    removeHistory(id);
    setList((prev) => (prev ? prev.filter((e) => e.id !== id) : prev));
  };

  const handleClearAll = () => {
    clearHistory();
    setList([]);
    setConfirmClear(false);
  };

  return (
    <PaperBackground color="#f4ecd8" className="min-h-screen w-full px-6 py-16 text-ink">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex flex-col gap-3"
        >
          <Link href="/" className="text-xs tracking-[0.3em] opacity-50 hover:opacity-100">
            ← 回 首 页
          </Link>
          <h1 className="font-master text-3xl tracking-[0.3em] sm:text-4xl">
            这 些 年 你 写 过 的 信
          </h1>
          <p className="text-sm tracking-widest opacity-60">
            只 留 在 这 台 设 备 上。换 一 台 就 没 了。
          </p>
        </motion.div>

        {list === null && (
          <div className="py-12 text-center text-sm tracking-widest opacity-40">先生在翻账册…</div>
        )}

        {list && list.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-6 py-16 text-center"
          >
            <p className="font-master text-xl tracking-widest opacity-70">还 没 有 留 下 一 封。</p>
            <p className="text-sm tracking-widest opacity-50">先生在等你说话。</p>
            <Link href="/styles" className="ink-button mt-2">
              请 先 生 写 第 一 封
            </Link>
          </motion.div>
        )}

        {list && list.length > 0 && (
          <div className="flex flex-col gap-4">
            {list.map((entry, i) => {
              const def = STYLES[entry.style];
              const target =
                [entry.recipientName, entry.recipient].filter(Boolean).join(' · ') || '某人';
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.5) }}
                  className="group relative border border-ink/15 transition-all hover:border-ink/40 hover:shadow-[0_10px_30px_-18px_rgba(40,20,10,0.5)]"
                  style={{ backgroundColor: def.paperColor, color: def.inkColor }}
                >
                  <Link
                    href={`/letter/${entry.id}`}
                    className="block px-5 py-4 sm:px-6 sm:py-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-master text-base tracking-widest">
                            {def.name}
                          </span>
                          <span className="text-[11px] tracking-[0.3em] opacity-55">
                            给 {target}
                          </span>
                        </div>
                        <p
                          className="mt-2 font-serif text-sm leading-relaxed tracking-wide opacity-85"
                          style={{ wordBreak: 'break-word' }}
                        >
                          {entry.preview}
                          {entry.preview.length >= 40 ? '…' : ''}
                        </p>
                        <div className="mt-2 text-[10px] tracking-widest opacity-45">
                          {formatRelativeTime(entry.ts, now)} · {entry.id}
                        </div>
                      </div>
                      <div className="opacity-60 transition-transform duration-500 group-hover:rotate-[-4deg]">
                        <Seal style={entry.style} size={42} />
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(entry.id);
                    }}
                    className="absolute right-3 top-3 px-2 py-1 text-[10px] tracking-widest opacity-0 transition-opacity hover:bg-paper hover:opacity-100 group-hover:opacity-60"
                    aria-label="从历史中移除"
                  >
                    移 除
                  </button>
                </motion.div>
              );
            })}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6 text-[11px] tracking-widest">
              <span className="opacity-50">共 {list.length} 封 · 仅本设备可见</span>
              <AnimatePresence mode="wait">
                {!confirmClear ? (
                  <motion.button
                    key="ask"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setConfirmClear(true)}
                    className="opacity-50 transition-opacity hover:opacity-100"
                  >
                    清 空 历 史 →
                  </motion.button>
                ) : (
                  <motion.span
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-seal-red">确认清空?</span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-seal-red underline underline-offset-4"
                    >
                      是
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="opacity-60 hover:opacity-100"
                    >
                      取消
                    </button>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </PaperBackground>
  );
}
