'use client';

import { motion } from 'framer-motion';
import { forwardRef, useMemo } from 'react';
import { STYLES, type StyleKey } from '@/lib/styles';
import { Seal } from './Seal';

interface LetterPaperProps {
  styleKey: StyleKey;
  body: string;
  signature: string;
  revealed: boolean;
  stampDown: boolean;
  vertical: boolean;
}

export const LetterPaper = forwardRef<HTMLDivElement, LetterPaperProps>(function LetterPaper(
  { styleKey, body, signature, revealed, stampDown, vertical },
  ref
) {
  const def = STYLES[styleKey];

  const paragraphs = useMemo(() => {
    const lines = body
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.length ? lines : [body];
  }, [body]);

  const showRedSeal = styleKey !== 'remembrance';

  return (
    <div
      ref={ref}
      id="letter-paper"
      className="relative mx-auto w-full max-w-[820px] shadow-[0_10px_40px_-20px_rgba(60,40,20,0.45)]"
      style={{
        backgroundColor: def.paperColor,
        color: def.inkColor,
        backgroundImage: `
          radial-gradient(rgba(80, 50, 20, 0.07) 1px, transparent 1.5px),
          radial-gradient(rgba(60, 40, 20, 0.05) 1px, transparent 1.5px),
          linear-gradient(140deg, rgba(80, 50, 20, 0.05), transparent 35%, rgba(60, 40, 20, 0.06))
        `,
        backgroundSize: '7px 7px, 13px 13px, 100% 100%',
        backgroundPosition: '0 0, 4px 6px, 0 0',
        padding: vertical ? '64px 80px' : '56px 40px',
        minHeight: vertical ? 560 : undefined,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(80, 50, 20, 0.1), transparent 12%, transparent 88%, rgba(80, 50, 20, 0.12))',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 60px rgba(80, 50, 20, 0.18)',
        }}
      />

      <article
        className="relative font-serif"
        style={{
          writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
          letterSpacing: vertical ? '0.18em' : '0.05em',
          lineHeight: vertical ? 2.2 : 1.9,
          fontSize: vertical ? 18 : 17,
          maxHeight: vertical ? 520 : undefined,
        }}
      >
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={revealed ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 1, delay: 0.4 + i * 0.55, ease: 'easeOut' }}
            className="whitespace-pre-wrap"
            style={{
              marginInlineEnd: vertical ? '1.4em' : 0,
              marginBottom: vertical ? 0 : '0.9em',
              textIndent: vertical ? 0 : '2em',
            }}
          >
            {p}
          </motion.p>
        ))}

        {signature && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.4 + paragraphs.length * 0.55, ease: 'easeOut' }}
            className="whitespace-pre-wrap"
            style={{
              marginInlineEnd: vertical ? '2em' : 0,
              marginTop: vertical ? 0 : '1.4em',
              textAlign: vertical ? 'start' : 'right',
              opacity: 0.9,
            }}
          >
            {signature}
          </motion.p>
        )}
      </article>

      <motion.div
        initial={{ opacity: 0, scale: 1.6, rotate: 8 }}
        animate={
          stampDown
            ? { opacity: showRedSeal ? 0.92 : 0.7, scale: 1, rotate: showRedSeal ? 6 : 0 }
            : { opacity: 0, scale: 1.6, rotate: 8 }
        }
        transition={{ duration: 0.45, type: 'spring', stiffness: 220, damping: 14 }}
        className="absolute"
        style={{
          left: vertical ? 56 : 36,
          bottom: vertical ? 56 : 36,
          mixBlendMode: showRedSeal ? 'multiply' : 'normal',
        }}
      >
        <Seal style={styleKey} size={styleKey === 'remembrance' ? 110 : 88} />
      </motion.div>

      <div
        className="pointer-events-none absolute left-3 top-3 text-[10px] tracking-[0.3em] opacity-50"
        style={{ color: def.inkColor }}
      >
        QIAOPI · 侨批
      </div>
    </div>
  );
});
