/**
 * Plumi's picture lessons, Duolingo style. Each CEFR unit has eight pictured
 * words, taught in lessons of four:
 *
 *   1. meet   — four pictures; tap each one to hear it
 *   2. find   — "¿Cuál es «el perro»?" pick the picture (pictures labelled)
 *   3. listen — hear the word, pick the picture (no labels)
 *   4. name   — see the picture, pick the Spanish word
 *
 * Wrong picks come back at the end. Distractors come from the whole unit, so
 * the second lesson also reviews the first.
 */
import { PIC_UNITS, CEFR_LEVELS, type Cefr, type PicUnit, type PicWord } from './picture-vocab.ts';

export const PER_LESSON = 4;

export type LessonRef = { unitId: string; index: number; words: PicWord[]; key: string };

export function lessonsOf(unit: PicUnit): LessonRef[] {
  const n = Math.ceil(unit.words.length / PER_LESSON);
  return Array.from({ length: n }, (_, i) => ({
    unitId: unit.id, index: i, words: unit.words.slice(i * PER_LESSON, (i + 1) * PER_LESSON), key: `${unit.id}:${i}`,
  }));
}

export function unitsForLevel(level: Cefr): Array<{ unit: PicUnit; lessons: LessonRef[] }> {
  return PIC_UNITS.filter((x) => x.level === level).map((unit) => ({ unit, lessons: lessonsOf(unit) }));
}

export function lessonFor(unitId: string, index: number): { unit: PicUnit; lesson: LessonRef; levelName: string; count: number } | null {
  const unit = PIC_UNITS.find((x) => x.id === unitId);
  if (!unit) return null;
  const all = lessonsOf(unit);
  const lesson = all[index];
  if (!lesson) return null;
  return { unit, lesson, levelName: CEFR_LEVELS.find((l) => l.id === unit.level)!.name, count: all.length };
}

export type Exercise =
  | { kind: 'meet'; words: PicWord[] }
  | { kind: 'find'; word: PicWord; options: PicWord[] }
  | { kind: 'listen'; word: PicWord; options: PicWord[] }
  | { kind: 'name'; word: PicWord; options: PicWord[] };

function shuffle<T>(xs: readonly T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Four options: the word plus three others from the unit, in random order. */
function optionsFor(word: PicWord, pool: readonly PicWord[], rand: () => number): PicWord[] {
  const others = shuffle(pool.filter((p) => p[0] !== word[0] && p[2] !== word[2]), rand).slice(0, 3);
  return shuffle([word, ...others], rand);
}

export function buildExercises(words: readonly PicWord[], pool: readonly PicWord[], rand: () => number = Math.random): Exercise[] {
  const out: Exercise[] = [{ kind: 'meet', words: [...words] }];
  for (const w of shuffle(words, rand)) out.push({ kind: 'find', word: w, options: optionsFor(w, words.length >= 4 ? words : pool, rand) });
  for (const w of shuffle(words, rand)) out.push({ kind: 'listen', word: w, options: optionsFor(w, pool, rand) });
  for (const w of shuffle(words, rand)) out.push({ kind: 'name', word: w, options: optionsFor(w, pool, rand) });
  return out;
}
