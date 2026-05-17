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

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6 sm:gap-8 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: -0.8 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[520px] sm:max-w-[580px]"
        >
          <div className="relative shadow-[0_18px_60px_-30px_rgba(60,40,20,0.55)]">
            <Image
              src="/poster.jpg"
              alt="侨批生成器·先生 — 致敬电影《给阿嬷的情书》"
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
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.3 }}
            className="font-master text-[1.7rem] tracking-[0.35em] sm:text-[2.2rem] sm:tracking-[0.4em]"
          >
            先 生 · 侨 批 生 成 器
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.7 }}
            className="relative flex flex-col items-center gap-1.5"
          >
            <div className="relative overflow-hidden border border-ink/15 shadow-[0_6px_24px_-16px_rgba(60,40,20,0.5)]">
              <Image
                src="/scribe-scene.jpg"
                alt="先生在祠堂门口替乡亲代写侨批"
                width={334}
                height={151}
                className="block h-auto w-[220px] sm:w-[260px]"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 60%, rgba(244, 236, 216, 0.15))',
                }}
              />
            </div>
            <span className="text-[10px] tracking-[0.4em] opacity-50">
              先 生 · 替 你 寄 封 信
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.3 }}
            className="vertical-divider"
            style={{ height: 32 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.6 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
          >
            <Link href="/styles" className="ink-button">
              开 始 写 信
            </Link>
            <Link
              href="/letters"
              className="ink-button ghost group"
              aria-label="查看我以前写过的侨批"
            >
              我 写 过 的 信
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 3.2 }}
          className="mt-1 flex flex-col items-center gap-1.5 text-center"
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

        <section aria-hidden="true" className="sr-only">
          <h2>什么是侨批生成器？</h2>
          <p>
            侨批生成器「先生」是一款 AI 代写侨批的在线工具，致敬电影《给阿嬷的情书》。侨批是海外华侨通过民间渠道寄回国内的汇款及家书，承载着游子对家乡亲人的思念。先生为你代笔，以南洋商旅体、闺阁守望体、少年游子体、暮年回望体四种笔法，写一封百年前的侨批。你可以写给爸爸、妈妈、阿公、阿嬷、故友，甚至已经离开的人。
          </p>
        </section>
      </main>
    </PaperBackground>
  );
}
