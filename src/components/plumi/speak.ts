'use client';

/**
 * Plumi's voice.
 *
 * First choice is a pre-recorded clip in /voice (generated once with the free
 * Piper engine; see public/voice/LICENSE.md). Then the neural voice from
 * /api/tts, if the site has a Google TTS key. Otherwise, the most natural Spanish voice this device has:
 * Edge's "Natural" voices, Chrome's Google voices and Apple's enhanced voices
 * sound far less robotic than the defaults, so they're preferred by name.
 */
let premium: boolean | undefined;           // unknown until the first request
const audioCache = new Map<string, string>();
let current: HTMLAudioElement | null = null;

const PREFERRED = [/natural/i, /neural/i, /online/i, /premium/i, /enhanced/i, /google/i, /paulina|m[oó]nica|sabina|dalia|elvira|helena/i];
const LOCALES = ['es-MX', 'es-US', 'es-419', 'es-ES', 'es'];

function bestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('es'));
  if (!voices.length) return null;
  const score = (v: SpeechSynthesisVoice) => {
    const nameScore = PREFERRED.findIndex((re) => re.test(v.name));
    const loc = LOCALES.findIndex((l) => v.lang.replace('_', '-').startsWith(l));
    return (nameScore === -1 ? 100 : nameScore * 10) + (loc === -1 ? 9 : loc);
  };
  return [...voices].sort((a, b) => score(a) - score(b))[0];
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // voices load asynchronously in Chrome; touching the list starts that
  window.speechSynthesis.getVoices();
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && ('speechSynthesis' in window || 'Audio' in window);
}

function browserSpeak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) { onEnd?.(); return; }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/…/g, ''));
    const v = bestVoice();
    if (v) u.voice = v;
    u.lang = v?.lang ?? 'es-MX';
    u.rate = 0.92;
    u.pitch = 1.08;      // a touch brighter: friendlier, less flat
    u.onend = () => onEnd?.();
    u.onerror = () => onEnd?.();
    window.speechSynthesis.speak(u);
  } catch {
    onEnd?.();
  }
}

let manifest: Promise<Record<string, string>> | undefined;
function clips(): Promise<Record<string, string>> {
  return (manifest ??= fetch('/voice/manifest.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
}

async function clipUrl(text: string): Promise<string | null> {
  const id = (await clips())[text];
  return id ? `/voice/${id}.mp3` : null;
}

async function premiumUrl(text: string): Promise<string | null> {
  if (premium === false) return null;
  const hit = audioCache.get(text);
  if (hit) return hit;
  try {
    const res = await fetch(`/api/tts?t=${encodeURIComponent(text)}`);
    if (res.status === 501) { premium = false; return null; }
    if (!res.ok) return null;
    premium = true;
    const url = URL.createObjectURL(await res.blob());
    audioCache.set(text, url);
    return url;
  } catch {
    return null;
  }
}

export function speak(text: string, opts: { onEnd?: () => void } = {}): void {
  if (typeof window === 'undefined') return;
  current?.pause();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  void clipUrl(text).then((u) => u ?? premiumUrl(text)).then((url) => {
    if (!url) { browserSpeak(text, opts.onEnd); return; }
    const a = new Audio(url);
    current = a;
    a.onended = () => opts.onEnd?.();
    a.onerror = () => browserSpeak(text, opts.onEnd);
    a.play().catch(() => browserSpeak(text, opts.onEnd));
  });
}

/** Warm the cache so the first tap plays instantly. */
export function preload(texts: string[]): void {
  void clips().then((m) => {
    for (const t of texts) {
      if (m[t]) { const a = new Audio(`/voice/${m[t]}.mp3`); a.preload = 'auto'; }
      else void premiumUrl(t);
    }
  });
}
