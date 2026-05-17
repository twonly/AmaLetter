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
  compact?: boolean;
}

export const LetterPaper = forwardRef<HTMLDivElement, LetterPaperProps>(function LetterPaper(
  { styleKey, body, signature, revealed, stampDown, compact = false },
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

  const padX = compact ? 22 : 48;
  const padY = compact ? 26 : 56;
  const fontPx = compact ? 14 : 17;
  const maxBodyH = compact ? 240 : 440;
  const sealSize = compact ? 48 : styleKey === 'remembrance' ? 92 : 72;
  const sigGap = compact ? 6 : 12;

  return (
    <div className="flex w-full justify-center">
      <div
        ref={ref}
        id="letter-paper"
        className="relative shadow-[0_10px_40px_-20px_rgba(60,40,20,0.45)]"
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
          padding: `${padY}px ${padX}px`,
          width: 'max-content',
          maxWidth: 'min(820px, calc(100vw - 24px))',
          minWidth: compact ? 260 : 340,
          minHeight: compact ? 340 : 500,
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

        <div className="relative flex justify-end" style={{ paddingBottom: sealSize + sigGap }}>
          <article
            className="font-serif"
            style={{
              writingMode: 'vertical-rl',
              letterSpacing: '0.18em',
              lineHeight: 2.2,
              fontSize: fontPx,
              maxHeight: maxBodyH,
            }}
          >
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={revealed ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.28, ease: 'easeOut' }}
                className="whitespace-pre-wrap"
                style={{
                  marginInlineEnd: compact ? '1em' : '1.4em',
                }}
              >
                {p}
              </motion.p>
            ))}
          </article>
        </div>

        {signature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + paragraphs.length * 0.28, ease: 'easeOut' }}
            className="absolute font-serif"
            style={{
              left: padX,
              bottom: padY,
              writingMode: 'vertical-rl',
              letterSpacing: '0.18em',
              lineHeight: 2.2,
              fontSize: fontPx - 1,
            }}
          >
            <p className="whitespace-pre-wrap">{signature}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 1.6, rotate: 8 }}
          animate={
            stampDown
              ? { opacity: showRedSeal ? 0.92 : 0.7, scale: 1, rotate: showRedSeal ? -8 : 0 }
              : { opacity: 0, scale: 1.6, rotate: 8 }
          }
          transition={{ duration: 0.32, type: 'spring', stiffness: 260, damping: 16 }}
          className="absolute"
          style={{
            right: padX,
            bottom: padY,
            mixBlendMode: showRedSeal ? 'multiply' : 'normal',
          }}
        >
          <Seal style={styleKey} size={sealSize} />
        </motion.div>

        <div
          className="pointer-events-none absolute left-3 top-3 text-[10px] tracking-[0.3em] opacity-50"
          style={{ color: def.inkColor }}
        >
          QIAOPI · 侨批
        </div>
      </div>
    </div>
  );
});
