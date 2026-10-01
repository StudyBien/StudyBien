'use client';

import { useEffect } from 'react';

const CLICKABLE = 'a[href], button:not([disabled]), [role="option"], [role="tab"], summary, input[type="radio"], input[type="checkbox"]';

/**
 * A soft pop on every click of a link or button, site-wide. One decoded
 * sample is reused, so rapid clicks don't pile up network requests, and
 * nothing plays if the browser blocks audio.
 */
export function ClickSound() {
  useEffect(() => {
    const base = new Audio('/sounds/pop.mp3');
    base.preload = 'auto';
    base.volume = 0.45;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as Element | null;
      if (!target?.closest(CLICKABLE)) return;
      const a = base.cloneNode() as HTMLAudioElement;
      a.volume = base.volume;
      a.play().catch(() => { /* autoplay blocked or no audio device */ });
    };
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    return () => document.removeEventListener('pointerdown', onDown, { capture: true });
  }, []);
  return null;
}
