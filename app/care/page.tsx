'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PaperBackground } from '@/components/PaperBackground';
import { SELF_HARM_REPLY } from '@/lib/prompts';

export default function CarePage() {
  const [message, setMessage] = useState(SELF_HARM_REPLY);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('qiaopi:self-harm');
      if (raw) {
        const parsed = JSON.parse(raw) as { message?: string };
        if (parsed.message) setMessage(parsed.message);
      }
    } catch {}
  }, []);

  return (
    <PaperBackground color="#f4ecd8" className="min-h-screen w-full px-6 py-20 text-ink">
      <div className="mx-auto flex max-w-xl flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="flex flex-col gap-3"
        >
          <span className="text-[11px] tracking-[0.4em] opacity-50">先 生 放 下 了 笔</span>
          <h1 className="font-master text-2xl tracking-[0.2em]">这一封,先生不写。</h1>
        </motion.div>

        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4 }}
          className="whitespace-pre-wrap font-serif text-base leading-loose tracking-wider"
        >
          {message}
        </motion.pre>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.1 }}
          className="flex flex-col gap-3"
        >
          <Link href="/styles" className="ink-button ghost self-start">
            等 缓 一 缓 再 来
          </Link>
        </motion.div>
      </div>
    </PaperBackground>
  );
}
