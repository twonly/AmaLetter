'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { StyleDefinition } from '@/lib/styles';
import { Seal } from './Seal';

interface StyleCardProps {
  def: StyleDefinition;
  index: number;
}

export function StyleCard({ def, index }: StyleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 * index, ease: 'easeOut' }}
    >
      <Link
        href={`/write?style=${def.key}`}
        className="group relative block overflow-hidden border border-ink/15 transition-all duration-500 hover:-translate-y-1 hover:border-ink/40 hover:shadow-[0_18px_50px_-30px_rgba(40,20,10,0.6)]"
        style={{ backgroundColor: def.paperColor, color: def.inkColor }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(40, 20, 10, 0.12), transparent 55%)',
          }}
        />
        <div className="relative flex h-full flex-col gap-6 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.3em] opacity-60">
                NO.{String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-2 font-serif text-2xl tracking-widest">{def.name}</h3>
            </div>
            <div className="opacity-80 transition-transform duration-700 group-hover:rotate-[-4deg]">
              <Seal style={def.key} size={52} />
            </div>
          </div>

          <div className="space-y-2 text-sm leading-relaxed opacity-80">
            <p>
              <span className="opacity-60">适合写给:</span>
              <span className="ml-2">{def.recipient}</span>
            </p>
            <p className="opacity-70">{def.description}</p>
          </div>

          <blockquote
            className="mt-auto border-l border-current/30 pl-4 font-serif text-base leading-loose tracking-wider"
            style={{ opacity: 0.85 }}
          >
            「{def.sample}」
          </blockquote>
        </div>
      </Link>
    </motion.div>
  );
}
