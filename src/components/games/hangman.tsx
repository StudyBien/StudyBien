'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GameTheme } from './game-words';

const LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const MAX_MISSES = 6;

/** á, é, í, ó, ú, ü all count as their plain vowel; ñ is its own letter. */
function base(ch: string): string {
  const up = ch.toUpperCase();
  if (up === 'Ñ') return 'Ñ';
  return up.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function Hangman({ theme }: { theme: GameTheme }) {
  const [order, setOrder] = useState<number[]>(() => theme.words.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState({ won: 0, played: 0 });

  // shuffle on the client only, so server and client render the same first frame
  useEffect(() => {
    setOrder(theme.words.map((_, i) => i).sort(() => Math.random() - 0.5));
    setIdx(0); setGuessed(new Set()); setScore({ won: 0, played: 0 });
  }, [theme]);

  const current = theme.words[order[idx % order.length]];
  const letters = useMemo(() => new Set([...current.word].filter((c) => /\p{L}/u.test(c)).map(base)), [current]);
  const misses = [...guessed].filter((g) => !letters.has(g)).length;
  const won = [...letters].every((l) => guessed.has(l));
  const lost = misses >= MAX_MISSES;
  const over = won || lost;

  const guess = useCallback((l: string) => {
    if (over || guessed.has(l)) return;
    const next = new Set(guessed); next.add(l);
    setGuessed(next);
    const nowWon = [...letters].every((x) => next.has(x));
    const nowLost = [...next].filter((g) => !letters.has(g)).length >= MAX_MISSES;
    if (nowWon || nowLost) setScore((s) => ({ won: s.won + (nowWon ? 1 : 0), played: s.played + 1 }));
  }, [over, guessed, letters]);

  const nextWord = useCallback(() => { setIdx((i) => i + 1); setGuessed(new Set()); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter' && over) { nextWord(); return; }
      const l = base(e.key);
      if (e.key.length === 1 && LETTERS.includes(l)) guess(l);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [guess, nextWord, over]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="flex flex-col items-center">
        <Gallows misses={misses} />
        <p className="mt-2 font-mono text-sm text-ink-muted">{MAX_MISSES - misses} lives left</p>
        <p className="mt-1 text-sm">Score: <strong>{score.won}</strong> / {score.played}</p>
      </div>
      <div>
        <p className="text-sm text-ink-muted">Pista (hint): <strong className="text-ink">{current.hint}</strong></p>
        <p aria-live="polite" className="mt-4 flex flex-wrap gap-x-4 gap-y-3 text-3xl font-bold sm:text-4xl">
          {current.word.split(' ').map((w, wi) => (
            <span key={wi} className="flex gap-1.5">
              {[...w].map((c, ci) => {
                const isLetter = /\p{L}/u.test(c);
                const show = !isLetter || guessed.has(base(c)) || lost;
                return (
                  <span key={ci} className={`inline-block min-w-[1.1ch] border-b-4 text-center ${isLetter ? 'border-ink' : 'border-transparent'} ${lost && !guessed.has(base(c)) ? 'text-tangerine' : ''}`}>
                    {show ? c.toUpperCase() : ' '}
                  </span>
                );
              })}
            </span>
          ))}
        </p>

        {over && (
          <div className={`mt-6 rounded-[var(--radius-md)] p-4 ${won ? 'bg-teal/15' : 'bg-tangerine-fill'}`}>
            <p className="text-lg font-bold">{won ? '¡Excelente! 🎉' : `¡Ay, no! La palabra era «${current.word}».`}</p>
            <button onClick={nextWord} className="mt-3 rounded-lg bg-primary px-5 py-2.5 font-bold text-paper hover:bg-primary-hover">
              Siguiente palabra →
            </button>
          </div>
        )}

        <div className="mt-6 flex max-w-xl flex-wrap gap-2">
          {LETTERS.map((l) => {
            const used = guessed.has(l);
            const hit = used && letters.has(l);
            return (
              <button key={l} onClick={() => guess(l)} disabled={used || over}
                      className={`h-11 w-11 rounded-lg border text-lg font-bold ${
                        hit ? 'border-teal-deep bg-teal/30' : used ? 'border-rule bg-paper-sunk text-ink-muted line-through' : 'border-rule hover:border-primary hover:bg-primary-tint'
                      }`}>
                {l}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-muted">Type on your keyboard too. Accented vowels match their plain letter.</p>
      </div>
    </div>
  );
}

function Gallows({ misses }: { misses: number }) {
  const part = (n: number) => (misses >= n ? 'opacity-100' : 'opacity-0');
  return (
    <svg viewBox="0 0 200 220" className="h-56 w-52" role="img" aria-label={`${misses} of ${MAX_MISSES} wrong guesses`}>
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" className="text-ink">
        <path d="M20 210 H120 M50 210 V20 H140 V45" />
      </g>
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" className="text-tangerine transition-opacity">
        <circle cx="140" cy="65" r="20" className={part(1)} />
        <path d="M140 85 V140" className={part(2)} />
        <path d="M140 100 L115 122" className={part(3)} />
        <path d="M140 100 L165 122" className={part(4)} />
        <path d="M140 140 L118 175" className={part(5)} />
        <path d="M140 140 L162 175" className={part(6)} />
      </g>
    </svg>
  );
}
