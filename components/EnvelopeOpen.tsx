'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

interface EnvelopeOpenProps {
  open: boolean;
  onDone: () => void;
}

export function EnvelopeOpen({ open, onDone }: EnvelopeOpenProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [open, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper px-6"
          style={{
            backgroundImage: `
              radial-gradient(rgba(120, 90, 50, 0.08) 1px, transparent 1.5px),
              radial-gradient(rgba(60, 40, 20, 0.06) 1px, transparent 1.5px)
            `,
            backgroundSize: '6px 6px, 11px 11px',
          }}
        >
          <div className="relative" style={{ width: 'min(420px, 78vw)', aspectRatio: '5 / 3' }}>
            <motion.div
              initial={{ y: 60, opacity: 0, rotate: -2 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <svg
                viewBox="0 0 500 300"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 h-full w-full"
                aria-label="信封"
              >
                <defs>
                  <linearGradient id="envelope-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8dcc0" />
                    <stop offset="100%" stopColor="#d8c8a8" />
                  </linearGradient>
                  <pattern id="airmail-stripe" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(45)">
                    <rect width="12" height="24" fill="#8b3a3a" />
                    <rect x="12" width="12" height="24" fill="#1a2a4a" />
                  </pattern>
                </defs>

                <rect x="6" y="80" width="488" height="214" fill="url(#envelope-body)" stroke="#8a6a3a" strokeWidth="1.2" />

                <g opacity="0.85">
                  <rect x="6" y="80" width="488" height="10" fill="url(#airmail-stripe)" />
                  <rect x="6" y="284" width="488" height="10" fill="url(#airmail-stripe)" />
                  <rect x="6" y="80" width="10" height="214" fill="url(#airmail-stripe)" />
                  <rect x="484" y="80" width="10" height="214" fill="url(#airmail-stripe)" />
                </g>

                <g transform="translate(420, 100)">
                  <rect width="60" height="74" fill="#f4ecd8" stroke="#8a6a3a" strokeWidth="0.8" />
                  <rect x="6" y="8" width="48" height="58" fill="#c08040" opacity="0.9" />
                  <text x="44" y="18" fontSize="8" fill="#1a1a1a" fontFamily="serif">80</text>
                </g>

                <g transform="translate(330, 110) rotate(-12)" opacity="0.7">
                  <circle r="28" fill="none" stroke="#8b3a3a" strokeWidth="1.4" />
                  <text fontFamily="serif" fontSize="9" fill="#8b3a3a" textAnchor="middle">
                    <tspan x="0" y="-4">侨</tspan>
                    <tspan x="0" y="8">批</tspan>
                  </text>
                </g>
              </svg>

              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -170 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.6, 0, 0.4, 1] }}
                className="absolute"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '46%',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
              >
                <svg viewBox="0 0 500 138" preserveAspectRatio="none" className="h-full w-full">
                  <polygon
                    points="6,80 250,6 494,80 494,138 6,138"
                    fill="#e8dcc0"
                    stroke="#8a6a3a"
                    strokeWidth="1.2"
                  />
                  <polygon points="6,80 250,6 494,80" fill="rgba(80,50,20,0.08)" />
                </svg>
              </motion.div>

              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -120, opacity: 1 }}
                transition={{ duration: 0.65, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bg-paper shadow-[0_8px_30px_-12px_rgba(60,40,20,0.45)]"
                style={{
                  left: '12%',
                  right: '12%',
                  bottom: '12%',
                  height: '70%',
                }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    backgroundColor: '#f4ecd8',
                    backgroundImage: `
                      linear-gradient(transparent calc(50% - 0.5px), rgba(80,50,20,0.18) 50%, transparent calc(50% + 0.5px)),
                      linear-gradient(transparent calc(75% - 0.5px), rgba(80,50,20,0.18) 75%, transparent calc(75% + 0.5px)),
                      linear-gradient(transparent calc(25% - 0.5px), rgba(80,50,20,0.18) 25%, transparent calc(25% + 0.5px))
                    `,
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-16 text-center text-[11px] tracking-[0.4em] opacity-55"
          >
            <span>有 人 给 你 寄 了 一 封 侨 批</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
