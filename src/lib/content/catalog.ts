/**
 * The content library: quizzes, tests and worksheets for every level, built
 * deterministically from the vocabulary, grammar, verb and reading sources.
 *
 * Deterministic on purpose: a quiz id always yields the same questions in the
 * same order with the same choices, so a teacher's printed copy, a student's
 * submission and the server's grading all agree without storing the quiz.
 *
 * Verb answers come from the conjugator, which refuses rather than guesses; a
 * form it cannot produce is simply not asked.
 */
import { conjugate, isSupported, type Person, type Tense } from '../generation/template/conjugator.ts';
import { LEVELS, levelById, TENSE_NAME, type LevelId, type VerbSet } from './levels.ts';
import { THEMES, themesForLevel, type Theme, type Word } from './vocab.ts';
import { grammarForLevel, type GrammarQ, type GrammarTopic } from './grammar.ts';
import { readingsForLevel, readingById, type Reading } from './readings.ts';

// ------------------------------------------------------------------ types

export type Question = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;          // index into choices
  why?: string;
  section?: string;
};

export type Quiz = {
  id: string;
  level: LevelId;
  kind: 'quiz' | 'test';
  category: 'Vocabulario' | 'Verbos' | 'Gramática' | 'Repaso' | 'Examen';
  title: string;
  subtitle: string;
  readingId?: string;
  writing?: { prompt: string; minWords: number };
  questions: Question[];
};

export type WorksheetItem = { prompt: string; answer: string; choices?: string[] };
export type WorksheetSection = { heading: string; instructions: string; items: WorksheetItem[]; lines?: number };

export type Worksheet = {
  id: string;
  level: LevelId;
  category: 'Vocabulario' | 'Verbos' | 'Gramática' | 'Lectura y escritura';
  title: string;
  subtitle: string;
  readingId?: string;
  sections: WorksheetSection[];
};

/** What a browser may see of a question: never the answer. */
export type PublicQuestion = Omit<Question, 'answer' | 'why'>;

// ------------------------------------------------------------------ deterministic randomness

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string): () => number {
  let a = hashString(seed);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const r = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pick<T>(items: readonly T[], n: number, seed: string): T[] {
  return shuffle(items, seed).slice(0, n);
}

/** Put the correct answer among the wrong ones in a stable, unguessable position. */
function mcq(id: string, prompt: string, correct: string, wrong: readonly string[], why?: string): Question {
  const choices = shuffle([correct, ...wrong], `choices:${id}`);
  return { id, prompt, choices, answer: choices.indexOf(correct), why };
}

// ------------------------------------------------------------------ question builders

function vocabQuestion(word: Word, pool: readonly Word[], id: string, direction: 'es-en' | 'en-es'): Question {
  const others = pool.filter((w) => w[1] !== word[1] && w[0] !== word[0]);
  const wrong = pick(others, 3, `wrong:${id}`);
  return direction === 'es-en'
    ? mcq(id, `¿Qué significa «${word[0]}»?`, word[1], wrong.map((w) => w[1]))
    : mcq(id, `¿Cómo se dice «${word[1]}» en español?`, word[0], wrong.map((w) => w[0]));
}

function vocabQuestions(words: readonly Word[], pool: readonly Word[], n: number, seed: string): Question[] {
  return pick(words, n, seed).map((w, i) =>
    vocabQuestion(w, pool, `${seed}:v${i}`, i % 2 === 0 ? 'es-en' : 'en-es'));
}

const QUIZ_PERSONS: Person[] = ['1s', '2s', '3s', '1p', '3p'];
const PRONOUNS: Record<Person, readonly string[]> = {
  '1s': ['yo'], '2s': ['tú'], '3s': ['él', 'ella', 'usted'],
  '1p': ['nosotros'], '2p': ['vosotros'], '3p': ['ellos', 'ellas', 'ustedes'],
};

function safeConjugate(v: string, t: Tense, p: Person): string | null {
  return isSupported(v, t, p) ? conjugate(v, t, p) : null;
}

/** One conjugation question, or null if the conjugator can't vouch for four distinct forms. */
function verbQuestion(verb: string, tense: Tense, person: Person, id: string, tenses: readonly Tense[]): Question | null {
  const correct = safeConjugate(verb, tense, person);
  if (!correct) return null;
  const candidates = new Set<string>();
  for (const p of QUIZ_PERSONS) if (p !== person) {
    const f = safeConjugate(verb, tense, p);
    if (f) candidates.add(f);
  }
  const allTenses: Tense[] = ['present', 'preterite', 'imperfect', 'future', 'conditional', 'present_subjunctive'];
  for (const t of [...tenses, ...allTenses]) if (t !== tense) {
    const f = safeConjugate(verb, t, person);
    if (f) candidates.add(f);
  }
  candidates.delete(correct);
  const wrong = pick([...candidates], 3, `wrong:${id}`);
  if (wrong.length < 3) return null;
  const r = rng(`pronoun:${id}`);
  const pronouns = PRONOUNS[person];
  const pronoun = pronouns[Math.floor(r() * pronouns.length)];
  return mcq(id, `${pronoun} ___ (${verb}) — ${TENSE_NAME[tense]}`, correct, wrong,
    `${verb}, ${TENSE_NAME[tense]}, ${pronoun}: ${correct}`);
}

function verbQuestions(set: Pick<VerbSet, 'tenses' | 'verbs'>, n: number, seed: string): Question[] {
  const r = rng(`verbs:${seed}`);
  const out: Question[] = [];
  const seen = new Set<string>();
  for (let tries = 0; out.length < n && tries < n * 20; tries++) {
    const verb = set.verbs[Math.floor(r() * set.verbs.length)];
    const tense = set.tenses[Math.floor(r() * set.tenses.length)];
    const person = QUIZ_PERSONS[Math.floor(r() * QUIZ_PERSONS.length)];
    const key = `${verb}|${tense}|${person}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const question = verbQuestion(verb, tense, person, `${seed}:c${out.length}`, set.tenses);
    if (question) out.push(question);
  }
  return out;
}

function grammarQuestion(g: GrammarQ, id: string): Question {
  return mcq(id, g.prompt, g.correct, g.wrong, g.why);
}

function grammarQuestions(topic: GrammarTopic, n: number, seed: string): Question[] {
  return pick(topic.questions, n, seed).map((g, i) => grammarQuestion(g, `${seed}:g${i}`));
}

function readingQuestions(reading: Reading, seed: string): Question[] {
  return reading.questions.map((g, i) => grammarQuestion(g, `${seed}:r${i}`));
}

function withSection(qs: Question[], section: string): Question[] {
  return qs.map((q) => ({ ...q, section }));
}

// ------------------------------------------------------------------ quizzes and tests

function buildQuizzes(level: LevelId): Quiz[] {
  const L = levelById(level)!;
  const themes = themesForLevel(level);
  const levelWords = themes.flatMap((t) => t.words);
  const grammar = grammarForLevel(level);
  const quizzes: Quiz[] = [];

  for (const t of themes) {
    const id = `${level}--vocab-${t.id}`;
    quizzes.push({
      id, level, kind: 'quiz', category: 'Vocabulario',
      title: `Vocabulario: ${t.name}`, subtitle: t.nameEn,
      questions: vocabQuestions(t.words, t.words, 10, id),
    });
  }
  // levels with few themes get mixed vocabulary reviews so every level has plenty
  for (let i = 1; themes.length + i - 1 < 5; i++) {
    const id = `${level}--vocab-mixed-${i}`;
    quizzes.push({
      id, level, kind: 'quiz', category: 'Vocabulario',
      title: `Vocabulario mixto ${i}`, subtitle: 'Words from every theme in this level',
      questions: vocabQuestions(levelWords, levelWords, 10, id),
    });
  }
  for (const s of L.verbSets) {
    const id = `${level}--verbs-${s.id}`;
    quizzes.push({
      id, level, kind: 'quiz', category: 'Verbos', title: s.title, subtitle: 'Verb conjugation',
      questions: verbQuestions(s, 10, id),
    });
  }
  for (const g of grammar) {
    const id = `${level}--grammar-${g.id}`;
    quizzes.push({
      id, level, kind: 'quiz', category: 'Gramática', title: g.title, subtitle: g.titleEn,
      questions: grammarQuestions(g, 10, id),
    });
  }
  const reviewId = `${level}--review`;
  quizzes.push({
    id: reviewId, level, kind: 'quiz', category: 'Repaso',
    title: `Repaso general — ${L.name}`, subtitle: 'A little of everything',
    questions: [
      ...vocabQuestions(levelWords, levelWords, 4, `${reviewId}:voc`),
      ...verbQuestions({ tenses: [...new Set(L.verbSets.flatMap((s) => s.tenses))], verbs: [...new Set(L.verbSets.flatMap((s) => s.verbs))] }, 3, `${reviewId}:verb`),
      ...grammar.flatMap((g, i) => grammarQuestions(g, 1, `${reviewId}:gr${i}`)),
    ],
  });
  return quizzes;
}

function buildTests(level: LevelId): Quiz[] {
  const L = levelById(level)!;
  const themes = themesForLevel(level);
  const grammar = grammarForLevel(level);
  const readings = readingsForLevel(level);
  const half = Math.ceil(themes.length / 2);

  const spec = [
    { slug: 'unit-1', title: 'Examen de unidad 1', subtitle: 'First half of the level', themes: themes.slice(0, half), sets: L.verbSets.slice(0, 2), grammar: grammar.slice(0, 2), reading: readings[0] },
    { slug: 'unit-2', title: 'Examen de unidad 2', subtitle: 'Second half of the level', themes: themes.slice(half).length ? themes.slice(half) : themes, sets: L.verbSets.slice(2), grammar: grammar.slice(1), reading: readings[1] ?? readings[0] },
    { slug: 'final', title: 'Examen final', subtitle: 'The whole level', themes, sets: L.verbSets, grammar, reading: readings[2] ?? readings[0] },
  ];

  return spec.map((s) => {
    const id = `${level}--test-${s.slug}`;
    const words = s.themes.flatMap((t: Theme) => t.words);
    const set = { tenses: [...new Set(s.sets.flatMap((v) => v.tenses))], verbs: [...new Set(s.sets.flatMap((v) => v.verbs))] };
    const grammarQs = s.grammar.flatMap((g, i) => grammarQuestions(g, Math.ceil(8 / s.grammar.length), `${id}:gr${i}`)).slice(0, 8);
    return {
      id, level, kind: 'test' as const, category: 'Examen' as const,
      title: `${s.title} — ${L.name}`, subtitle: s.subtitle,
      readingId: s.reading?.id,
      writing: s.reading?.writing,
      questions: [
        ...withSection(vocabQuestions(words, words, 10, `${id}:voc`), 'I. Vocabulario'),
        ...withSection(verbQuestions(set, 10, `${id}:verb`), 'II. Verbos'),
        ...withSection(grammarQs, 'III. Gramática'),
        ...(s.reading ? withSection(readingQuestions(s.reading, `${id}:read`), 'IV. Comprensión de lectura') : []),
      ],
    };
  });
}

// ------------------------------------------------------------------ worksheets

function buildWorksheets(level: LevelId): Worksheet[] {
  const L = levelById(level)!;
  const out: Worksheet[] = [];

  for (const t of themesForLevel(level)) {
    const words = shuffle(t.words, `ws:${t.id}`);
    const halfway = Math.ceil(words.length / 2);
    out.push({
      id: `${level}--ws-vocab-${t.id}`, level, category: 'Vocabulario',
      title: `Vocabulario: ${t.name}`, subtitle: t.nameEn,
      sections: [
        { heading: 'A. ¿Qué significa?', instructions: 'Write the English meaning of each word.',
          items: words.slice(0, halfway).map(([es, en]) => ({ prompt: es, answer: en })) },
        { heading: 'B. ¿Cómo se dice?', instructions: 'Write each word in Spanish. Include the article for nouns.',
          items: words.slice(halfway).map(([es, en]) => ({ prompt: en, answer: es })) },
        { heading: 'C. Escribe', instructions: 'Write three original sentences in Spanish using words from this list.',
          items: [], lines: 6 },
      ],
    });
  }

  for (const s of L.verbSets) {
    const chartVerbs = pick(s.verbs, 3, `chart:${s.id}`);
    const tense = s.tenses[0];
    const chart: WorksheetItem[] = [];
    for (const v of chartVerbs) for (const p of QUIZ_PERSONS) {
      const f = safeConjugate(v, tense, p);
      if (f) chart.push({ prompt: `${v} · ${PRONOUNS[p][0]}`, answer: f });
    }
    const sentences = verbQuestions(s, 12, `${level}--ws-verbs-${s.id}`).map((q) => ({
      prompt: q.prompt, answer: q.choices[q.answer],
    }));
    out.push({
      id: `${level}--ws-verbs-${s.id}`, level, category: 'Verbos',
      title: s.title, subtitle: 'Conjugation practice',
      sections: [
        { heading: `A. Conjuga en el ${TENSE_NAME[tense]}`, instructions: `Conjugate each verb in the ${TENSE_NAME[tense]} tense.`, items: chart },
        { heading: 'B. Completa', instructions: 'Write the correct form of the verb in the tense shown.', items: sentences },
      ],
    });
  }

  for (const g of grammarForLevel(level)) {
    out.push({
      id: `${level}--ws-grammar-${g.id}`, level, category: 'Gramática',
      title: g.title, subtitle: g.titleEn,
      sections: [
        { heading: 'A. Escoge la respuesta correcta', instructions: 'Choose the option that completes each item correctly.',
          items: g.questions.map((q, i) => ({
            prompt: q.prompt, answer: q.correct,
            choices: shuffle([q.correct, ...q.wrong], `wsg:${g.id}:${i}`),
          })) },
        { heading: 'B. Explica', instructions: 'In your own words, explain the rule this worksheet practices and give two original examples.',
          items: [], lines: 5 },
      ],
    });
  }

  for (const r of readingsForLevel(level)) {
    out.push({
      id: `${level}--ws-reading-${r.id}`, level, category: 'Lectura y escritura',
      title: `Lectura: ${r.title}`, subtitle: `${r.titleEn} · ${r.genre}`,
      readingId: r.id,
      sections: [
        { heading: 'A. Comprensión', instructions: 'Read the passage, then choose the best answer.',
          items: r.questions.map((q, i) => ({
            prompt: q.prompt, answer: q.correct,
            choices: shuffle([q.correct, ...q.wrong], `wsr:${r.id}:${i}`),
          })) },
        { heading: 'B. Escritura', instructions: `${r.writing.prompt} (mínimo ${r.writing.minWords} palabras)`,
          items: [], lines: Math.min(22, Math.max(8, Math.round(r.writing.minWords / 12))) },
      ],
    });
  }
  return out;
}

// ------------------------------------------------------------------ the catalog

type Catalog = { quizzes: Map<string, Quiz>; tests: Map<string, Quiz>; worksheets: Map<string, Worksheet> };
let catalog: Catalog | undefined;

function build(): Catalog {
  const quizzes = new Map<string, Quiz>();
  const tests = new Map<string, Quiz>();
  const worksheets = new Map<string, Worksheet>();
  for (const l of LEVELS) {
    for (const q of buildQuizzes(l.id)) quizzes.set(q.id, q);
    for (const t of buildTests(l.id)) tests.set(t.id, t);
    for (const w of buildWorksheets(l.id)) worksheets.set(w.id, w);
  }
  return { quizzes, tests, worksheets };
}

function cat(): Catalog {
  return (catalog ??= build());
}

export function quizzesForLevel(level: LevelId): Quiz[] {
  return [...cat().quizzes.values()].filter((q) => q.level === level);
}
export function testsForLevel(level: LevelId): Quiz[] {
  return [...cat().tests.values()].filter((q) => q.level === level);
}
export function worksheetsForLevel(level: LevelId): Worksheet[] {
  return [...cat().worksheets.values()].filter((w) => w.level === level);
}
export function quizById(id: string): Quiz | undefined {
  return cat().quizzes.get(id) ?? cat().tests.get(id);
}
export function worksheetById(id: string): Worksheet | undefined {
  return cat().worksheets.get(id);
}
export function allQuizzes(): Quiz[] { return [...cat().quizzes.values()]; }
export function allTests(): Quiz[] { return [...cat().tests.values()]; }
export function allWorksheets(): Worksheet[] { return [...cat().worksheets.values()]; }

export function publicQuestions(q: Quiz): PublicQuestion[] {
  return q.questions.map(({ id, prompt, choices, section }) => ({ id, prompt, choices, section }));
}

export type GradeResult = {
  score: number; max: number;
  results: Array<{ id: string; correct: boolean; given: number | null; answer: number; why?: string }>;
};

/** Grade a submission on the server. `answers` maps question id → chosen index. */
export function gradeQuiz(q: Quiz, answers: Record<string, unknown>): GradeResult {
  const results = q.questions.map((question) => {
    const raw = answers[question.id];
    const given = raw === undefined || raw === null || raw === '' ? null : Number(raw);
    return { id: question.id, correct: given === question.answer, given, answer: question.answer, why: question.why };
  });
  return { score: results.filter((r) => r.correct).length, max: results.length, results };
}

// ------------------------------------------------------------------ resources for assignments

export type ResourceKind = 'quiz' | 'test' | 'reading' | 'worksheet';

export function resourceTitle(kind: ResourceKind, id: string): string | null {
  if (kind === 'quiz' || kind === 'test') return quizById(id)?.title ?? null;
  if (kind === 'worksheet') return worksheetById(id)?.title ?? null;
  if (kind === 'reading') return readingById(id)?.title ?? null;
  return null;
}

/** A reading, used as an assignment: its comprehension questions, gradable like a quiz. */
export function readingAsQuiz(id: string): Quiz | undefined {
  const r = readingById(id);
  if (!r) return undefined;
  return {
    id: `reading:${r.id}`, level: r.level, kind: 'quiz', category: 'Repaso',
    title: r.title, subtitle: r.titleEn, readingId: r.id, writing: r.writing,
    questions: readingQuestions(r, `reading:${r.id}`),
  };
}

export { THEMES };
