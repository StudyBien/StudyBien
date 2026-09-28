/**
 * The eight levels the content library is organised by. Slugs match the
 * `course` table, so a class made for "Spanish 4" and the Spanish 4 shelf of
 * the library are the same thing.
 */
import type { Tense } from '../generation/template/conjugator.ts';

export type LevelId =
  | 'spanish-1' | 'spanish-2' | 'spanish-3' | 'spanish-4'
  | 'spanish-5' | 'spanish-6' | 'ap-spanish' | 'college-spanish';

/** A verb drill: every question conjugates one of these verbs in one of these tenses. */
export type VerbSet = {
  id: string;
  title: string;
  tenses: readonly Tense[];
  verbs: readonly string[];
};

export type Level = {
  id: LevelId;
  name: string;
  short: string;
  audience: string;
  blurb: string;
  verbSets: readonly VerbSet[];
};

const AR = ['hablar', 'estudiar', 'trabajar', 'bailar', 'cantar', 'caminar', 'escuchar', 'nadar', 'cocinar', 'comprar', 'mirar', 'tomar'];
const ER_IR = ['comer', 'beber', 'correr', 'leer', 'aprender', 'vender', 'vivir', 'escribir', 'abrir', 'recibir', 'compartir', 'subir'];
const STEM = ['pensar', 'querer', 'preferir', 'poder', 'volver', 'dormir', 'pedir', 'servir', 'jugar', 'entender', 'encontrar', 'repetir'];
const IRREG = ['ser', 'estar', 'ir', 'tener', 'venir', 'decir', 'hacer', 'poner', 'saber', 'salir', 'dar', 'ver'];
const MIXED = [...AR.slice(0, 4), ...ER_IR.slice(0, 4), ...STEM.slice(0, 4), ...IRREG];

export const LEVELS: readonly Level[] = [
  {
    id: 'spanish-1', name: 'Spanish 1', short: 'S1', audience: 'High school · first year',
    blurb: 'Greetings, everyday vocabulary, ser and estar, and the present tense.',
    verbSets: [
      { id: 'present-ar', title: 'Present tense: -ar verbs', tenses: ['present'], verbs: AR },
      { id: 'present-er-ir', title: 'Present tense: -er and -ir verbs', tenses: ['present'], verbs: ER_IR },
      { id: 'present-stem', title: 'Present tense: stem-changing verbs', tenses: ['present'], verbs: STEM },
      { id: 'present-irregular', title: 'Present tense: irregular verbs', tenses: ['present'], verbs: IRREG },
    ],
  },
  {
    id: 'spanish-2', name: 'Spanish 2', short: 'S2', audience: 'High school · second year',
    blurb: 'The past tenses, reflexive verbs, object pronouns, travel and daily life.',
    verbSets: [
      { id: 'preterite-regular', title: 'Preterite: regular verbs', tenses: ['preterite'], verbs: [...AR, ...ER_IR] },
      { id: 'preterite-irregular', title: 'Preterite: irregular verbs', tenses: ['preterite'], verbs: IRREG },
      { id: 'imperfect', title: 'The imperfect tense', tenses: ['imperfect'], verbs: [...AR.slice(0, 6), ...ER_IR.slice(0, 6), 'ser', 'ir', 'ver'] },
      { id: 'past-mixed', title: 'Preterite and imperfect forms', tenses: ['preterite', 'imperfect'], verbs: MIXED },
    ],
  },
  {
    id: 'spanish-3', name: 'Spanish 3', short: 'S3', audience: 'High school · third year',
    blurb: 'Future and conditional, commands, por and para, and the subjunctive begins.',
    verbSets: [
      { id: 'future', title: 'The simple future', tenses: ['future'], verbs: MIXED },
      { id: 'conditional', title: 'The conditional', tenses: ['conditional'], verbs: MIXED },
      { id: 'subj-regular', title: 'Present subjunctive: regular verbs', tenses: ['present_subjunctive'], verbs: [...AR, ...ER_IR] },
      { id: 'subj-irregular', title: 'Present subjunctive: irregular verbs', tenses: ['present_subjunctive'], verbs: IRREG },
    ],
  },
  {
    id: 'spanish-4', name: 'Spanish 4', short: 'S4', audience: 'High school · fourth year',
    blurb: 'Subjunctive of doubt, perfect tenses, relative pronouns, media and society.',
    verbSets: [
      { id: 'subj-stem', title: 'Present subjunctive: stem-changing verbs', tenses: ['present_subjunctive'], verbs: STEM },
      { id: 'future-conditional', title: 'Future and conditional review', tenses: ['future', 'conditional'], verbs: MIXED },
      { id: 'past-review', title: 'Past tenses review', tenses: ['preterite', 'imperfect'], verbs: [...STEM, ...IRREG] },
      { id: 'indicative-review', title: 'Indicative tenses review', tenses: ['present', 'preterite', 'imperfect', 'future'], verbs: MIXED },
    ],
  },
  {
    id: 'spanish-5', name: 'Spanish 5', short: 'S5', audience: 'High school · honors',
    blurb: 'Imperfect subjunctive, si clauses, se constructions, art, film and the economy.',
    verbSets: [
      { id: 'subj-review', title: 'Present subjunctive review', tenses: ['present_subjunctive'], verbs: MIXED },
      { id: 'all-past', title: 'Past and conditional forms', tenses: ['preterite', 'imperfect', 'conditional'], verbs: MIXED },
      { id: 'all-tenses-1', title: 'Mixed tenses I', tenses: ['present', 'preterite', 'future', 'present_subjunctive'], verbs: MIXED },
      { id: 'all-tenses-2', title: 'Mixed tenses II', tenses: ['imperfect', 'conditional', 'present_subjunctive'], verbs: MIXED },
    ],
  },
  {
    id: 'spanish-6', name: 'Spanish 6', short: 'S6', audience: 'High school · advanced',
    blurb: 'Compound tenses, adverbial clauses, reported speech, politics and history.',
    verbSets: [
      { id: 'irregular-all', title: 'Irregular verbs in every tense', tenses: ['present', 'preterite', 'imperfect', 'future', 'conditional', 'present_subjunctive'], verbs: IRREG },
      { id: 'stem-all', title: 'Stem-changing verbs in every tense', tenses: ['present', 'preterite', 'present_subjunctive'], verbs: STEM },
      { id: 'mixed-6a', title: 'Mixed tenses: indicative', tenses: ['present', 'preterite', 'imperfect', 'future', 'conditional'], verbs: MIXED },
      { id: 'mixed-6b', title: 'Mixed tenses: with subjunctive', tenses: ['preterite', 'conditional', 'present_subjunctive'], verbs: MIXED },
    ],
  },
  {
    id: 'ap-spanish', name: 'AP Spanish Language', short: 'AP', audience: 'High school · AP',
    blurb: 'The six AP themes, formal register, interpretive reading and argumentative writing.',
    verbSets: [
      { id: 'ap-verbs-1', title: 'Verb accuracy I', tenses: ['present', 'preterite', 'imperfect', 'future', 'conditional', 'present_subjunctive'], verbs: MIXED },
      { id: 'ap-verbs-2', title: 'Verb accuracy II: irregulars', tenses: ['preterite', 'future', 'conditional', 'present_subjunctive'], verbs: IRREG },
      { id: 'ap-verbs-3', title: 'Verb accuracy III: stem changes', tenses: ['present', 'preterite', 'present_subjunctive'], verbs: STEM },
      { id: 'ap-verbs-4', title: 'Verb accuracy IV: mixed', tenses: ['imperfect', 'conditional', 'present_subjunctive'], verbs: MIXED },
    ],
  },
  {
    id: 'college-spanish', name: 'College Spanish', short: 'COL', audience: 'University · upper division',
    blurb: 'Advanced syntax, nuance, idioms, academic vocabulary, literary analysis and essay writing.',
    verbSets: [
      { id: 'col-verbs-1', title: 'Morphology review: all tenses', tenses: ['present', 'preterite', 'imperfect', 'future', 'conditional', 'present_subjunctive'], verbs: MIXED },
      { id: 'col-verbs-2', title: 'Irregular verbs: advanced review', tenses: ['preterite', 'future', 'conditional', 'present_subjunctive'], verbs: IRREG },
      { id: 'col-verbs-3', title: 'Stem changes across tenses', tenses: ['present', 'preterite', 'present_subjunctive'], verbs: STEM },
      { id: 'col-verbs-4', title: 'Subjunctive and conditional forms', tenses: ['conditional', 'present_subjunctive'], verbs: MIXED },
    ],
  },
];

export const LEVEL_IDS = LEVELS.map((l) => l.id);

export function levelById(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export const TENSE_NAME: Record<Tense, string> = {
  present: 'present',
  preterite: 'preterite',
  imperfect: 'imperfect',
  future: 'future',
  conditional: 'conditional',
  present_subjunctive: 'present subjunctive',
};
