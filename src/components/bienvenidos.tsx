'use client';

import { useEffect, useState } from 'react';

/**
 * The greeting every visitor sees on arrival. Plays on each visit to the home
 * page, skippable with a click or a key, and skipped entirely for people who
 * have asked their OS for reduced motion.
 */
export function Bienvenidos() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase('gone'); return; }
    const t1 = setTimeout(() => setPhase('out'), 650);
    const t2 = setTimeout(() => setPhase('gone'), 900);
    const skip = () => setPhase('gone');
    window.addEventListener('keydown', skip);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('keydown', skip); };
  }, []);

  if (phase === 'gone') return null;
  return (
    <div
      onClick={() => setPhase('gone')}
      role="presentation"
      className={`fixed inset-0 z-50 grid cursor-pointer place-items-center bg-primary text-paper transition-opacity duration-200 ${
        phase === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <p className="bienvenidos-word text-[clamp(3rem,11vw,7.5rem)] font-bold leading-none tracking-[-0.03em]">
          ¡Bienvenidos!
        </p>
        <p className="bienvenidos-sub mt-5 text-[clamp(1rem,2.4vw,1.4rem)] text-paper/90">
          Spanish, from first words to fluency.
        </p>
      </div>
    </div>
  );
}
