interface ScribeSilhouetteProps {
  className?: string;
}

export function ScribeSilhouette({ className }: ScribeSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 600 420"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="先生伏案写字"
    >
      <defs>
        <filter id="paper-ink">
          <feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>
        <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#8b3a3a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8b3a3a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="430" cy="160" rx="180" ry="110" fill="url(#lamp-glow)" />

      <g filter="url(#paper-ink)" fill="#1a1a1a">
        <rect x="80" y="300" width="500" height="6" />
        <path d="M120 300 L 130 410 L 138 410 L 136 300 Z" />
        <path d="M530 300 L 522 410 L 514 410 L 518 300 Z" />
        <path d="M85 300 L 78 410 L 86 410 L 92 300 Z" />
        <path d="M580 300 L 588 410 L 580 410 L 575 300 Z" />

        <rect x="220" y="290" width="280" height="14" />
        <line x1="240" y1="299" x2="490" y2="299" stroke="#4a3020" strokeWidth="0.6" />

        <g transform="translate(0, -2)">
          <ellipse cx="270" cy="180" rx="42" ry="44" />
          <path d="M236 215 Q 230 250 240 295 L 360 295 Q 372 240 354 205 Q 332 175 296 168 Q 256 168 236 215 Z" />
          <path d="M238 218 Q 215 235 200 268 Q 196 290 232 297" />
          <path d="M250 240 Q 240 265 245 290 L 305 290 Q 310 270 300 250 Z" fill="#3a2a1a" opacity="0.7" />
          <path d="M270 138 Q 232 132 226 168 Q 230 178 256 174 Q 268 152 270 138 Z" />
          <ellipse cx="265" cy="178" rx="3.4" ry="2" fill="#f4ecd8" opacity="0.9" />
        </g>

        <g transform="translate(0, 0)">
          <path d="M310 250 L 360 252 L 380 268 L 348 282 Q 325 280 310 270 Z" />
          <path d="M348 272 L 392 252" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
          <rect x="388" y="248" width="9" height="32" transform="rotate(28 392 264)" fill="#3a2a1a" />
          <ellipse cx="402" cy="276" rx="2.6" ry="6" transform="rotate(28 402 276)" fill="#1a1a1a" />
        </g>

        <g>
          <path d="M380 268 L 540 252 L 545 290 L 385 296 Z" fill="#e8dcc0" stroke="#1a1a1a" strokeWidth="0.8" />
          <line x1="420" y1="266" x2="528" y2="262" stroke="#5a4030" strokeWidth="0.4" />
          <line x1="424" y1="274" x2="530" y2="270" stroke="#5a4030" strokeWidth="0.4" />
          <line x1="426" y1="282" x2="530" y2="278" stroke="#5a4030" strokeWidth="0.4" />
          <line x1="424" y1="290" x2="490" y2="287" stroke="#5a4030" strokeWidth="0.4" />
        </g>

        <g>
          <rect x="460" y="220" width="40" height="6" fill="#3a2a1a" />
          <rect x="468" y="226" width="24" height="40" fill="#5a3a1a" />
          <ellipse cx="480" cy="266" rx="14" ry="3" fill="#3a2a1a" />
          <path d="M478 218 Q 480 200 482 218" fill="#3a2a1a" />
          <path d="M478 215 Q 480 195 482 215 Q 484 205 482 188 Q 480 198 478 215 Z" fill="#c97030" opacity="0.92" />
          <ellipse cx="480" cy="208" rx="2" ry="5" fill="#f5d080" opacity="0.85" />
        </g>

        <g opacity="0.55">
          <rect x="120" y="280" width="44" height="22" fill="#3a2a1a" />
          <rect x="124" y="284" width="36" height="14" fill="#e8dcc0" />
          <rect x="124" y="284" width="36" height="2" fill="#8b3a3a" />
          <text x="142" y="294" fontSize="6" fill="#1a1a1a" textAnchor="middle" fontFamily="serif">侨</text>
        </g>
      </g>
    </svg>
  );
}
