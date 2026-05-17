'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PaperBackground } from '@/components/PaperBackground';

export default function HomePage() {
  return (
    <PaperBackground color="#f4ecd8" className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-10 text-[10px] tracking-[0.6em] opacity-50">
        QIAOPI · 侨批
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.4, delay: 1.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8 text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="font-master text-[2.6rem] tracking-[0.4em] sm:text-[3.4rem]"
        >
          先生,在等你。
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 3 }}
          className="font-serif text-sm tracking-[0.5em] opacity-70 sm:text-base"
        >
          为现代人代写一封侨批
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 4.2 }}
          className="vertical-divider"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 4.8 }}
        >
          <Link href="/styles" className="ink-button">
            开 始
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, delay: 6 }}
        className="absolute bottom-8 text-[11px] tracking-[0.35em] opacity-50"
      >
        百年前 他替不识字的乡亲写信  ·  百年后 让先生替你写一封
      </motion.div>
    </PaperBackground>
  );
}
