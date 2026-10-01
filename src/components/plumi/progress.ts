'use client';

/**
 * Learning progress, kept in this browser: completed lessons with their stars,
 * total XP, and a daily streak. Every read survives storage being blocked.
 */
export type Progress = { lessons: Record<string, number>; xp: number; streak: number; lastDay: string | null };

const KEY = 'studybien.plumi.v1';
const EMPTY: Progress = { lessons: {}, xp: 0, streak: 0, lastDay: null };
const today = () => new Date().toLocaleDateString('en-CA');

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? { ...EMPTY, ...JSON.parse(raw) } as Progress : { ...EMPTY };
    // a streak survives only if yesterday or today was a learning day
    if (p.lastDay) {
      const gap = (Date.parse(today()) - Date.parse(p.lastDay)) / 864e5;
      if (gap > 1) p.streak = 0;
    }
    return p;
  } catch {
    return { ...EMPTY };
  }
}

export function recordLesson(lessonKey: string, stars: number, xp: number): Progress {
  const p = loadProgress();
  p.lessons[lessonKey] = Math.max(p.lessons[lessonKey] ?? 0, stars);
  p.xp += xp;
  const t = today();
  if (p.lastDay !== t) p.streak = p.streak + 1;
  p.lastDay = t;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage blocked: progress lives for this page only */ }
  return p;
}

const BURST_KEY = 'studybien.plumi.burst';

/** Mark a lesson as just finished, so the path can celebrate it once. */
export function markBurst(lessonKey: string): void {
  try { sessionStorage.setItem(BURST_KEY, lessonKey); } catch { /* ignore */ }
}

/** The lesson to celebrate, if any — read once, then cleared. */
export function takeBurst(): string | null {
  try {
    const k = sessionStorage.getItem(BURST_KEY);
    sessionStorage.removeItem(BURST_KEY);
    return k;
  } catch {
    return null;
  }
}
