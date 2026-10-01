/**
 * Plumi's lessons. Each vocabulary theme for the high school levels is split
 * into lessons of about six words. A lesson introduces its words, then drills
 * them with a mix of exercises; anything missed comes back at the end.
 */
import { THEMES, type Theme, type Word } from './vocab.ts';
import { LEVELS, type LevelId } from './levels.ts';

export const HIGH_SCHOOL: LevelId[] = ['spanish-1', 'spanish-2', 'spanish-3', 'spanish-4', 'spanish-5', 'spanish-6', 'ap-spanish'];
const PER_LESSON = 6;

export type LessonRef = { themeId: string; index: number; words: Word[]; key: string };
export type Unit = { theme: Theme; lessons: LessonRef[] };

/** Units a beginner should meet first; everything else keeps its authored order. */
const FIRST: Partial<Record<LevelId, string[]>> = { 'spanish-1': ['saludos', 'cortesia', 'frases-clase'] };

export function unitsForLevel(level: LevelId): Unit[] {
  const first = FIRST[level] ?? [];
  const themes = THEMES.filter((t) => t.level === level)
    .sort((a, b) => (first.includes(a.id) ? first.indexOf(a.id) : 99) - (first.includes(b.id) ? first.indexOf(b.id) : 99));
  return themes.map((theme) => {
    const n = Math.ceil(theme.words.length / PER_LESSON);
    // spread words evenly so no lesson is a lonely leftover
    const size = Math.ceil(theme.words.length / n);
    return {
      theme,
      lessons: Array.from({ length: n }, (_, i) => ({
        themeId: theme.id, index: i, words: theme.words.slice(i * size, (i + 1) * size), key: `${theme.id}:${i}`,
      })),
    };
  });
}

export function lessonFor(themeId: string, index: number): { theme: Theme; lesson: LessonRef; level: string } | null {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme || !HIGH_SCHOOL.includes(theme.level)) return null;
  const unit = unitsForLevel(theme.level).find((u) => u.theme.id === themeId)!;
  const lesson = unit.lessons[index];
  return lesson ? { theme, lesson, level: LEVELS.find((l) => l.id === theme.level)!.name } : null;
}

export type Exercise =
  | { kind: 'intro'; word: Word }
  | { kind: 'meaning'; word: Word; options: string[] }       // see Spanish, pick English
  | { kind: 'translate'; word: Word; options: string[] }     // see English, pick Spanish
  | { kind: 'listen'; word: Word; options: string[] }        // hear Spanish, pick Spanish
  | { kind: 'type'; word: Word }                             // see English, type Spanish
  | { kind: 'build'; word: Word; tiles: string[] }           // assemble a phrase from tiles
  | { kind: 'match'; pairs: Word[] };

export function isPhrase(es: string): boolean {
  return /\s/.test(stripArticle(es).trim());
}

function stripArticle(es: string) { return es.replace(/^(el|la|los|las)\s+/i, ''); }

function shuffle<T>(xs: readonly T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Build a lesson's exercise sequence. `rand` is injectable so tests are deterministic. */
export function buildExercises(words: readonly Word[], pool: readonly Word[], rand: () => number = Math.random): Exercise[] {
  const others = (w: Word, n: number, by: 0 | 1) =>
    shuffle(pool.filter((p) => p[by] !== w[by] && p[0] !== w[0] && p[1] !== w[1]), rand).slice(0, n).map((p) => p[by]);
  const out: Exercise[] = [];

  // teach in pairs: introduce two, then check both straight away
  for (let i = 0; i < words.length; i += 2) {
    const pair = words.slice(i, i + 2);
    for (const w of pair) out.push({ kind: 'intro', word: w });
    for (const w of pair) out.push({ kind: 'meaning', word: w, options: shuffle([w[1], ...others(w, 3, 1)], rand) });
  }
  // then mix it up
  const mixed: Exercise[] = [];
  for (const w of shuffle(words, rand)) {
    const r = rand();
    if (isPhrase(w[0]) && r < 0.5) {
      const words = w[0].replace(/[¿?¡!.,…]/g, '').split(/\s+/).filter(Boolean);
      const extra = shuffle(pool.flatMap((p) => p[0].replace(/[¿?¡!.,…]/g, '').split(/\s+/)).filter((x) => x && !words.includes(x)), rand).slice(0, 2);
      mixed.push({ kind: 'build', word: w, tiles: shuffle([...words, ...extra], rand) });
    } else if (r < 0.35) mixed.push({ kind: 'listen', word: w, options: shuffle([w[0], ...others(w, 3, 0)], rand) });
    else if (r < 0.7) mixed.push({ kind: 'translate', word: w, options: shuffle([w[0], ...others(w, 3, 0)], rand) });
    else mixed.push({ kind: 'type', word: w });
  }
  out.push(...mixed);
  out.push({ kind: 'match', pairs: shuffle(words, rand).slice(0, Math.min(5, words.length)) });
  return out;
}

/** Compare a typed answer: exact, close (only accents/punctuation/case differ), or wrong. */
export function checkTyped(given: string, expected: string): 'exact' | 'close' | 'wrong' {
  const norm = (s: string) => stripArticle(s.trim().toLowerCase()).replace(/\s+/g, ' ');
  const loose = (s: string) => norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,…]/g, '').trim();
  if (norm(given) === norm(expected) || norm(given).replace(/[¿?¡!.,…]/g, '') === norm(expected).replace(/[¿?¡!.,…]/g, '')) return 'exact';
  if (loose(given) === loose(expected)) return 'close';
  return 'wrong';
}
