'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { PaperBackground } from '@/components/PaperBackground';

export default function HomePage() {
  return (
    <PaperBackground
      color="#f4ecd8"
      className="relative flex min-h-screen w-full flex-col overflow-hidden text-ink"
    >
      <header className="flex items-center justify-center px-6 pt-10 text-[10px] tracking-[0.6em] opacity-50">
        QIAOPI · 侨批
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: -0.8 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[640px]"
        >
          <div className="relative shadow-[0_18px_60px_-30px_rgba(60,40,20,0.55)]">
            <Image
              src="/poster.jpg"
              alt="致敬电影《给阿嬷的情书》"
              width={1017}
              height={572}
              priority
              className="block h-auto w-full"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 80px rgba(80, 50, 20, 0.25)',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.2, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.6 }}
            className="font-master text-[2rem] tracking-[0.4em] sm:text-[2.6rem]"
          >
            先生,在等你。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 2.2 }}
            className="font-serif text-sm tracking-[0.5em] opacity-70"
          >
            为现代人代写一封侨批
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 3 }}
            className="vertical-divider"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 3.4 }}
          >
            <Link href="/styles" className="ink-button">
              开 始
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 4.4 }}
        className="flex flex-col items-center gap-2 px-6 pb-8 pt-4 text-center"
      >
        <span className="text-[11px] tracking-[0.35em] opacity-50">
          百年前 他替不识字的乡亲写信  ·  百年后 让先生替你写一封
        </span>
        <span className="text-[10px] tracking-[0.4em] opacity-40">
          致 敬 电 影《给 阿 嬷 的 情 书》
        </span>
        <a
          href="https://www.xiaohongshu.com/user/profile/6467b1210000000010027a51"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-[10px] tracking-[0.3em] opacity-40 transition-opacity hover:opacity-80"
        >
          意 见 反 馈 · by AI拯救打工人·一个潮汕人
        </a>
      </motion.footer>
    </PaperBackground>
  );
}
