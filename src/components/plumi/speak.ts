'use client';

/**
 * Plumi's voice: the browser's own speech synthesis, preferring a Latin
 * American Spanish voice. Silent (never throws) where speech isn't available.
 */
let cached: SpeechSynthesisVoice | null | undefined;

function voice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cached !== undefined && cached !== null) return cached;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  cached = voices.find((v) => v.lang === 'es-MX') ?? voices.find((v) => v.lang === 'es-US')
    ?? voices.find((v) => v.lang.startsWith('es-4')) ?? voices.find((v) => v.lang.startsWith('es')) ?? null;
  return cached;
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string, opts: { slow?: boolean; onEnd?: () => void } = {}): void {
  if (!canSpeak()) { opts.onEnd?.(); return; }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/…/g, ''));
    const v = voice();
    if (v) u.voice = v;
    u.lang = v?.lang ?? 'es-MX';
    u.rate = opts.slow ? 0.6 : 0.9;
    u.onend = () => opts.onEnd?.();
    u.onerror = () => opts.onEnd?.();
    window.speechSynthesis.speak(u);
  } catch {
    opts.onEnd?.();
  }
}
