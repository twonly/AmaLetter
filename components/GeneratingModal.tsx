'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PaperBackground } from './PaperBackground';

interface GeneratingModalProps {
  open: boolean;
}

const PHASES = [
  '先生正在研墨…',
  '先生正在斟酌起首…',
  '先生正在落笔…',
  '先生写到一半,停下来想了想…',
  '先生在念给自己听…',
  '先生又添了一笔…',
];

export function GeneratingModal({ open }: GeneratingModalProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!open) {
      setPhase(0);
      return;
    }
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50"
        >
          <PaperBackground color="#f4ecd8" className="absolute inset-0" />
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-12 px-6">
            <Brush />
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-lg tracking-[0.3em] text-ink"
              >
                {PHASES[phase]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Brush() {
  return (
    <motion.svg
      width={120}
      height={220}
      viewBox="0 0 120 220"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: -4, y: -6 }}
      animate={{ rotate: [-4, 6, -4], y: [-6, 4, -6] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <rect x="54" y="10" width="12" height="120" rx="3" fill="#3a2a1a" />
      <rect x="50" y="125" width="20" height="14" rx="2" fill="#c9a86a" />
      <rect x="50" y="125" width="20" height="14" rx="2" fill="none" stroke="#8a6a3a" strokeWidth="1" />
      <path
        d="M50 138 L60 210 L70 138 Z"
        fill="#1a1a1a"
      />
      <path
        d="M58 200 Q 60 215 62 200"
        fill="#1a1a1a"
      />
      <motion.circle
        cx="60"
        cy="212"
        r="2.5"
        fill="#1a1a1a"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 0.6, 0], y: [0, 6, 12] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
      />
    </motion.svg>
  );
}
