'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { GeneratingModal } from '@/components/GeneratingModal';
import { PaperBackground } from '@/components/PaperBackground';
import { recordHistory } from '@/lib/history';
import { normalizeRemittanceAmount } from '@/lib/remittance';
import { DEFAULT_PROMPTS, isStyleKey, RECIPIENTS, STYLES, type DefaultPrompt } from '@/lib/styles';

const PLACEHOLDER =
  '先生,你说,我写。\n\n你最近想跟 ta 说什么?家里、想念、愧疚,还是只是想说一声你过得还好。\n请像聊天一样告诉我,不用润色。';

const HINT = '提示:越具体越好。一只小时候的猫、一道吃过的菜、一句没说出口的话,都可以告诉先生。';

export function WriteClient() {
  const router = useRouter();
  const params = useSearchParams();
  const styleParam = params.get('style');
  const [text, setText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [withMoney, setWithMoney] = useState(false);
  const [remittanceAmount, setRemittanceAmount] = useState('50');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDefault, setActiveDefault] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState(false);

  useEffect(() => {
    if (!isStyleKey(styleParam)) {
      router.replace('/styles');
    }
  }, [styleParam, router]);

  const def = useMemo(() => (isStyleKey(styleParam) ? STYLES[styleParam] : null), [styleParam]);
  const defaults = useMemo(
    () => (isStyleKey(styleParam) ? DEFAULT_PROMPTS[styleParam] ?? [] : []),
    [styleParam]
  );

  if (!def) return null;

  const handleDefault = (preset: DefaultPrompt) => {
    setText(preset.text);
    if (preset.recipient) setRecipient(preset.recipient);
    if (def.key !== 'remembrance') {
      setWithMoney(preset.withMoney);
      if (preset.withMoney) setRemittanceAmount('50');
    }
    setActiveDefault(preset.key);
    setError(null);
  };

  const handleSubmit = () => {
    if (text.trim().length < 4) {
      setError('再多说几句吧,先生才好下笔。');
      return;
    }
    if (!recipientName.trim() && !senderName.trim()) {
      setPendingConfirm(true);
      setError(null);
      return;
    }
    submitWith(recipient, recipientName, senderName);
  };

  const acceptDefaults = () => {
    setRecipient('妻子');
    setRecipientName('淑柔');
    setSenderName('木生');
    submitWith('妻子', '淑柔', '木生');
  };

  const submitWith = async (rec: string, rname: string, sname: string) => {
    setError(null);
    setPendingConfirm(false);
    setLoading(true);
    const normalizedRemittanceAmount =
      def.key !== 'remembrance' && withMoney ? normalizeRemittanceAmount(remittanceAmount) : null;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          style: def.key,
          userInput: text,
          withMoney: def.key === 'remembrance' ? false : withMoney,
          remittanceAmount: normalizedRemittanceAmount,
          recipient: rec,
          recipientName: rname,
          senderName: sname,
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
      const id = (typeof data.id === 'string' && data.id)
        ? data.id as string
        : Math.random().toString(36).slice(2, 10);
      const body = data.letter as string;
      const signature = data.signature as string;
      const savedRemittanceAmount =
        typeof data.remittanceAmount === 'number' ? normalizeRemittanceAmount(data.remittanceAmount) : null;
      sessionStorage.setItem(
        `qiaopi:letter:${id}`,
        JSON.stringify({
          style: def.key,
          body,
          signature,
          remittanceAmount: savedRemittanceAmount,
          ts: Date.now(),
        })
      );
      const preview = body.replace(/\s+/g, ' ').slice(0, 40);
      recordHistory({
        id,
        style: def.key,
        recipient: rec,
        recipientName: rname,
        senderName: sname,
        preview,
        ts: Date.now(),
      });
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
            <div className="mb-3 flex flex-wrap gap-2">
              {RECIPIENTS.map((r) => {
                const active = recipient === r.value;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRecipient(active ? '' : r.value)}
                    className="border px-4 py-1.5 text-sm tracking-[0.3em] transition-colors"
                    style={{
                      borderColor: active ? '#1a1a1a' : 'rgba(26,26,26,0.3)',
                      backgroundColor: active ? '#1a1a1a' : 'transparent',
                      color: active ? '#f4ecd8' : '#1a1a1a',
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.slice(0, 10))}
              placeholder="或自己写一个,如「外婆」「老朋友」「我自己」(不超过 10 字)"
              maxLength={10}
              className="w-full border border-ink/30 bg-transparent px-4 py-3 text-sm tracking-widest outline-none transition-colors focus:border-ink"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs tracking-[0.3em] opacity-60">
                TA 的 名 字 <span className="opacity-60">(可空)</span>
              </label>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value.slice(0, 10))}
                placeholder="如「淑柔」「南枝」"
                maxLength={10}
                className="w-full border border-ink/30 bg-transparent px-4 py-3 text-sm tracking-widest outline-none transition-colors focus:border-ink"
              />
              <p className="mt-2 text-[10px] tracking-wider opacity-55">
                填了会出现在抬头,如「淑柔吾妻」「南枝父亲膝下」
              </p>
            </div>
            <div>
              <label className="mb-2 block text-xs tracking-[0.3em] opacity-60">
                我 是 <span className="opacity-60">(可空)</span>
              </label>
              <input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value.slice(0, 10))}
                placeholder="如「木生」「狄功」"
                maxLength={10}
                className="w-full border border-ink/30 bg-transparent px-4 py-3 text-sm tracking-widest outline-none transition-colors focus:border-ink"
              />
              <p className="mt-2 text-[10px] tracking-wider opacity-55">
                填了会出现在落款,如「夫 木生」「儿 狄功」
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-xs tracking-[0.3em] opacity-60">你 想 说 的 话</label>
              {defaults.length > 0 && (
                <span className="text-[10px] tracking-[0.3em] opacity-45">
                  ↓ 不知道说什么?点一个填进去
                </span>
              )}
            </div>

            {defaults.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {defaults.map((p) => {
                  const active = activeDefault === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleDefault(p)}
                      className="border px-3 py-1.5 text-xs tracking-wider transition-colors"
                      style={{
                        borderColor: active ? '#1a1a1a' : 'rgba(26,26,26,0.25)',
                        backgroundColor: active ? 'rgba(26,26,26,0.06)' : 'transparent',
                        color: '#1a1a1a',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            )}

            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (activeDefault) setActiveDefault(null);
              }}
              placeholder={PLACEHOLDER}
              maxLength={2000}
              rows={10}
              className="scrollbar-paper w-full resize-none border border-ink/30 bg-transparent p-5 text-[15px] leading-loose tracking-wide outline-none transition-colors focus:border-ink"
            />
            <p className="mt-2 text-[11px] tracking-widest opacity-55">{HINT}</p>
          </div>

          {def.key !== 'remembrance' && (
            <div className="flex flex-col gap-4 border border-ink/20 px-5 py-4 text-sm">
              <div className="flex items-center justify-between gap-5">
                <span className="flex flex-col gap-1">
                  <span className="tracking-widest">是 否 寄「银 两」</span>
                  <span className="text-[11px] tracking-wider opacity-55">
                    开启后,先生会在信中附一句寄钱的话,沿用旧时银信合一的传统。
                  </span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={withMoney}
                  onClick={() => {
                    setWithMoney((v) => !v);
                    if (!withMoney && !remittanceAmount.trim()) setRemittanceAmount('50');
                  }}
                  className="relative h-6 w-12 shrink-0 border border-ink/40 transition-colors"
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
              </div>

              {withMoney && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-2 border-t border-ink/10 pt-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <label htmlFor="remittance-amount" className="text-[11px] tracking-[0.3em] opacity-60">
                    随 批 寄
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="remittance-amount"
                      type="number"
                      min={1}
                      max={9999}
                      inputMode="numeric"
                      value={remittanceAmount}
                      onChange={(e) => setRemittanceAmount(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                      onBlur={() => setRemittanceAmount(String(normalizeRemittanceAmount(remittanceAmount)))}
                      className="w-28 border border-ink/30 bg-transparent px-3 py-2 text-center text-base tracking-widest outline-none transition-colors focus:border-ink"
                    />
                    <span className="text-sm tracking-[0.3em] opacity-75">港 纸</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {error && (
            <div className="border-l-2 border-seal-red bg-seal-red/5 px-4 py-3 text-sm tracking-wider text-seal-red">
              {error}
            </div>
          )}

          {pendingConfirm && (
            <div className="flex flex-col gap-3 border border-ink/30 bg-paper-warm/40 p-5 text-sm">
              <p className="leading-relaxed tracking-wide">
                你没填名字。先生会默认按
                <span className="mx-1 border-b border-ink/50 px-1 font-master">写 给 妻 子 · 淑 柔</span>
                ,落款为
                <span className="mx-1 border-b border-ink/50 px-1 font-master">夫 · 木 生</span>
                替你写。
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={acceptDefaults}
                  disabled={loading}
                  className="ink-button"
                >
                  采 用 默 认 继 续
                </button>
                <button
                  type="button"
                  onClick={() => setPendingConfirm(false)}
                  className="ink-button ghost"
                >
                  我 自 己 填
                </button>
              </div>
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
