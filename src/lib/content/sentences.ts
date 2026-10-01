/**
 * Short practice sentences for Plumi's "translate this" exercises, built from
 * one pattern per unit. Each pattern is chosen so it is grammatical for every
 * word in that unit; units where no single pattern works get none and use
 * word-level exercises instead.
 */
import type { PicWord } from './picture-vocab.ts';

type Pattern =
  | 'see' | 'need' | 'lookfor' | 'like' | 'likeThe' | 'want' | 'color' | 'family'
  | 'hurt' | 'transport' | 'verbLike' | 'job' | 'estar' | 'phrase' | 'wantOne';

const PATTERN: Record<string, Pattern> = {
  'a1-animales': 'see', 'a1-comida': 'like', 'a1-frutas': 'wantOne', 'a1-bebidas': 'want', 'a1-colores': 'color',
  'a1-familia': 'family', 'a1-ropa': 'lookfor', 'a1-cuerpo': 'hurt', 'a1-casa': 'see', 'a1-escuela': 'need',
  'a1-tiempo': 'likeThe', 'a2-ciudad': 'lookfor', 'a2-transporte': 'transport', 'a2-deportes': 'like',
  'a2-acciones': 'verbLike', 'a2-profesiones': 'job', 'a2-viajes': 'lookfor', 'a2-emociones': 'estar',
  'b1-naturaleza': 'see', 'b1-tecnologia': 'need', 'b1-cocina': 'need', 'b1-arte': 'likeThe',
  'c2-modismos-1': 'phrase', 'c2-modismos-2': 'phrase', 'c2-refranes': 'phrase',
};

export type Sentence = { es: string; en: string };

const ART = /^(el|la|los|las)\s+/i;
const clean = (en: string) => en.replace(/\s*\(.*?\)\s*/g, '').replace(/\s*\/.*$/, '').trim();
const isPlural = (es: string) => /^(los|las)\s/i.test(es);
const bare = (es: string) => es.replace(ART, '');
const aOrAn = (w: string) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`);
/** el → un, la → una, los → unos, las → unas */
const indefinite = (es: string) => es.replace(ART, (a) => ({ el: 'un ', la: 'una ', los: 'unos ', las: 'unas ' }[a.trim().toLowerCase()]!));
/** English that reads better than the bare gloss inside a sentence. */
const EN_IN_SENTENCE: Record<string, string> = { 'el huevo': 'eggs' };

export function hasSentences(unitId: string): boolean {
  return unitId in PATTERN;
}

export function sentenceFor(unitId: string, w: PicWord): Sentence | null {
  const p = PATTERN[unitId];
  if (!p) return null;
  const [es, enRaw] = w;
  const en = EN_IN_SENTENCE[es] ?? clean(enRaw);
  switch (p) {
    case 'see': return { es: `Veo ${es}.`, en: `I see the ${en}.` };
    case 'need': return { es: `Necesito ${es}.`, en: `I need the ${en}.` };
    case 'lookfor': return { es: `Busco ${es}.`, en: `I am looking for the ${en}.` };
    case 'like': return { es: `Me ${isPlural(es) ? 'gustan' : 'gusta'} ${es}.`, en: `I like ${en}.` };
    case 'likeThe': return { es: `Me ${isPlural(es) ? 'gustan' : 'gusta'} ${es}.`, en: `I like the ${en}.` };
    case 'want': return { es: `Quiero ${bare(es)}.`, en: `I want ${en}.` };
    case 'color': return { es: `Es ${es}.`, en: `It is ${en}.` };
    case 'family': return { es: `Veo a mi ${bare(es)}.`, en: `I see my ${en}.` };
    case 'hurt': return { es: `Me ${isPlural(es) ? 'duelen' : 'duele'} ${es}.`, en: `My ${en} ${isPlural(es) ? 'hurt' : 'hurts'}.` };
    case 'transport': return { es: `Voy en ${bare(es)}.`, en: `I go by ${en}.` };
    case 'verbLike': return { es: `Me gusta ${es}.`, en: `I like ${en}.` };
    case 'job': return { es: `Mi padre es ${bare(es)}.`, en: `My father is ${aOrAn(en)}.` };
    case 'estar': return { es: `Estoy ${es}.`, en: `I am ${en}.` };
    case 'wantOne': return { es: `Quiero ${indefinite(es)}.`, en: `I want ${isPlural(es) ? `some ${en}` : aOrAn(en)}.` };
    case 'phrase': return { es: es.replace(/\.$/, '') + (es.endsWith('.') ? '.' : ''), en: enRaw };
  }
}

/** Words of a sentence as tiles: punctuation dropped, case kept. */
export function tokens(s: string): string[] {
  return s.replace(/[¿?¡!.,;:…]/g, ' ').split(/\s+/).filter(Boolean);
}

/** Does the tiled answer match the target sentence? Case and punctuation don't count. */
export function sameSentence(given: string[], target: string): boolean {
  const norm = (xs: string[]) => xs.map((x) => x.toLowerCase()).join(' ');
  return norm(given) === norm(tokens(target));
}
