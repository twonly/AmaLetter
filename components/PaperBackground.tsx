import type { CSSProperties, ReactNode } from 'react';

interface PaperBackgroundProps {
  color?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PaperBackground({
  color = '#f4ecd8',
  children,
  className,
  style,
}: PaperBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: color,
        backgroundImage: `
          radial-gradient(rgba(120, 90, 50, 0.08) 1px, transparent 1.5px),
          radial-gradient(rgba(60, 40, 20, 0.06) 1px, transparent 1.5px),
          linear-gradient(120deg, rgba(120, 90, 50, 0.04), transparent 40%, rgba(60, 40, 20, 0.05))
        `,
        backgroundSize: '6px 6px, 11px 11px, 100% 100%',
        backgroundPosition: '0 0, 3px 5px, 0 0',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
