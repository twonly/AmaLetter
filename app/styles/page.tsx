'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PaperBackground } from '@/components/PaperBackground';
import { StyleCard } from '@/components/StyleCard';
import { STYLES, STYLE_ORDER } from '@/lib/styles';

export default function StylesPage() {
  return (
    <PaperBackground color="#f4ecd8" className="min-h-screen w-full px-6 py-16 text-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          <Link href="/" className="text-xs tracking-[0.3em] opacity-50 hover:opacity-100">
            ← 回 首 页
          </Link>
          <h1 className="font-master text-3xl tracking-[0.3em] sm:text-4xl">
            先生,请问这封信是写给谁的?
          </h1>
          <p className="text-sm tracking-widest opacity-60">
            选一种笔法。先生会按这个口气替你落笔。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {STYLE_ORDER.map((key, i) => (
            <StyleCard key={key} def={STYLES[key]} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8 }}
          className="mt-8 text-center text-[11px] tracking-[0.35em] opacity-45"
        >
          四种笔法 · 一种心事
        </motion.div>
      </div>
    </PaperBackground>
  );
}
