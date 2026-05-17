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
      <header className="flex items-center justify-center px-6 pt-8 text-[10px] tracking-[0.6em] opacity-50 sm:pt-10">
        QIAOPI · 侨批
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8 sm:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: -0.8 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[560px] sm:max-w-[620px]"
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
          transition={{ duration: 1.4, delay: 1.0, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.3 }}
            className="font-master text-[1.8rem] tracking-[0.4em] sm:text-[2.4rem]"
          >
            先生,在等你。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.8 }}
            className="font-serif text-sm tracking-[0.5em] opacity-70"
          >
            为现代人代写一封侨批
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.3 }}
            className="vertical-divider"
            style={{ height: 40 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.6 }}
            className="flex flex-col items-center gap-2"
          >
            <Link href="/styles" className="ink-button">
              开 始
            </Link>
            <Link
              href="/letters"
              className="text-[11px] tracking-[0.35em] opacity-50 transition-opacity hover:opacity-90"
            >
              · 看 你 这 些 年 写 过 的 信 ·
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 3.2 }}
          className="mt-2 flex flex-col items-center gap-1.5 text-center"
        >
          <span className="text-[11px] tracking-[0.3em] opacity-55 sm:tracking-[0.35em]">
            百 年 前 他 替 不 识 字 的 乡 亲 写 信
          </span>
          <span className="text-[11px] tracking-[0.3em] opacity-55 sm:tracking-[0.35em]">
            百 年 后 让 先 生 替 你 写 一 封
          </span>
          <span className="mt-1 text-[10px] tracking-[0.4em] opacity-40">
            致 敬 电 影《给 阿 嬷 的 情 书》
          </span>
          <a
            href="https://www.xiaohongshu.com/user/profile/6467b1210000000010027a51"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-[10px] tracking-[0.3em] opacity-50 underline decoration-ink/20 underline-offset-4 transition-opacity hover:opacity-90"
          >
            意 见 反 馈 · by AI拯救打工人·一个潮汕人
          </a>
        </motion.div>
      </main>
    </PaperBackground>
  );
}
