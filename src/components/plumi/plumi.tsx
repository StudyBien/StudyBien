'use client';

/**
 * Plumi — StudyBien's feather pen. Same quill silhouette as the logo, with a
 * face on the vane. Moods change the eyes and mouth; `talking` animates the
 * mouth while Plumi speaks.
 */
export type Mood = 'happy' | 'talking' | 'thinking' | 'cheer' | 'sad';

export function Plumi({ mood = 'happy', size = 140, className = '' }: { mood?: Mood; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 160 220" width={size} height={size * 1.375} role="img" aria-label={`Plumi, ${mood}`}
         className={`plumi plumi-${mood} ${className}`}>
      <defs>
        <linearGradient id="plumi-vane" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.62 0.17 252)" />
          <stop offset="1" stopColor="oklch(0.45 0.17 252)" />
        </linearGradient>
      </defs>
      <ellipse cx="78" cy="212" rx="34" ry="5" fill="oklch(0.2 0.03 250 / 0.12)" className="plumi-shadow" />
      <g className="plumi-body">
        {/* feather vane */}
        <path d="M128 8 C150 52 136 112 106 150 C96 162 86 172 76 178 C68 172 62 160 60 146 C54 104 72 52 128 8 Z" fill="url(#plumi-vane)" />
        {/* barb notches */}
        <path d="M70 92 L58 86 M66 116 L54 114 M118 70 L132 66 M112 98 L126 98" stroke="oklch(0.45 0.17 252)" strokeWidth="5" strokeLinecap="round" />
        {/* shaft */}
        <path d="M122 20 C98 66 82 118 74 186" stroke="oklch(0.93 0.04 250)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* nib */}
        <path d="M66 176 L82 180 L72 206 Z" fill="oklch(0.28 0.03 250)" />
        <circle cx="72" cy="204" r="3" fill="oklch(0.28 0.03 250)" className="plumi-ink" />
        {/* cheeks */}
        <circle cx="79" cy="104" r="6" fill="oklch(0.78 0.11 20 / 0.55)" />
        <circle cx="117" cy="98" r="6" fill="oklch(0.78 0.11 20 / 0.55)" />
        {/* eyes */}
        {mood === 'cheer' ? (
          <g stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M80 86 Q87 78 94 86" /><path d="M104 82 Q111 74 118 82" />
          </g>
        ) : mood === 'sad' ? (
          <g>
            <ellipse cx="87" cy="88" rx="7" ry="8" fill="#fff" /><ellipse cx="111" cy="84" rx="7" ry="8" fill="#fff" />
            <circle cx="87" cy="91" r="3.6" fill="oklch(0.2 0.03 250)" /><circle cx="111" cy="87" r="3.6" fill="oklch(0.2 0.03 250)" />
            <path d="M78 76 L94 80 M120 72 L104 78" stroke="oklch(0.2 0.03 250)" strokeWidth="3" strokeLinecap="round" />
          </g>
        ) : (
          <g className="plumi-eyes">
            <ellipse cx="87" cy="86" rx="8" ry="9.5" fill="#fff" /><ellipse cx="111" cy="82" rx="8" ry="9.5" fill="#fff" />
            <circle cx={mood === 'thinking' ? 90 : 88} cy={mood === 'thinking' ? 82 : 87} r="4.2" fill="oklch(0.2 0.03 250)" />
            <circle cx={mood === 'thinking' ? 114 : 112} cy={mood === 'thinking' ? 78 : 83} r="4.2" fill="oklch(0.2 0.03 250)" />
            <circle cx="89.5" cy="84" r="1.4" fill="#fff" /><circle cx="113.5" cy="80" r="1.4" fill="#fff" />
          </g>
        )}
        {/* mouth */}
        {mood === 'sad' ? <path d="M90 114 Q100 106 110 112" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
          : mood === 'thinking' ? <path d="M93 112 L107 110" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          : mood === 'talking' ? <ellipse cx="100" cy="111" rx="7" ry="5" fill="oklch(0.25 0.06 20)" className="plumi-mouth" />
          : <path d={mood === 'cheer' ? 'M86 104 Q100 124 116 102 Z' : 'M88 106 Q100 118 113 104'}
                  stroke="#fff" strokeWidth="4" fill={mood === 'cheer' ? 'oklch(0.25 0.06 20)' : 'none'} strokeLinecap="round" strokeLinejoin="round" />}
      </g>
    </svg>
  );
}

/** Plumi plus a speech bubble. */
export function PlumiSays({ mood = 'happy', size = 120, children }: { mood?: Mood; size?: number; children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-3">
      <Plumi mood={mood} size={size} className="flex-none" />
      <div className="relative mb-6 rounded-2xl border-2 border-primary-tint bg-paper px-4 py-3 text-[17px] shadow-sm">
        <span aria-hidden className="absolute -left-2.5 bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-primary-tint bg-paper" />
        {children}
      </div>
    </div>
  );
}
