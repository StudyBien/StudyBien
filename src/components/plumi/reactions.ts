/**
 * What Plumi exclaims, the way people actually talk in Mexico and Spain.
 * Every line is family-friendly: no swearing, nothing offensive, nothing that
 * reads as an insult. The region tag is shown next to the phrase so students
 * learn where each expression comes from.
 */
export type Region = 'MX' | 'ES' | 'both';
export type Reaction = { say: string; region: Region; en: string };

const r = (say: string, region: Region, en: string): Reaction => ({ say, region, en });

/** A right answer. */
export const CORRECT: Reaction[] = [
  r('¡Bien!', 'both', 'Good!'),
  r('¡Muy bien!', 'both', 'Very good!'),
  r('¡Genial!', 'both', 'Great!'),
  r('¡Estupendo!', 'both', 'Wonderful!'),
  r('¡Perfecto!', 'both', 'Perfect!'),
  r('¡Eso es!', 'both', 'That’s it!'),
  r('¡Qué padre!', 'MX', 'How cool!'),
  r('¡Qué chido!', 'MX', 'Awesome!'),
  r('¡Órale!', 'MX', 'Wow! / Alright!'),
  r('¡Guay!', 'ES', 'Cool!'),
  r('¡Olé!', 'ES', 'Bravo!'),
  r('¡De lujo!', 'both', 'First-class!'),
];

/** Three or more right answers in a row. */
export const STREAK: Reaction[] = [
  r('¡Eres un crack!', 'both', 'You’re a star!'),
  r('¡Vas volando!', 'both', 'You’re flying!'),
  r('¡Imparable!', 'both', 'Unstoppable!'),
  r('¡Qué máquina!', 'ES', 'What a machine!'),
  r('¡A toda máquina!', 'both', 'Full speed ahead!'),
  r('¡Ándale, sigue así!', 'MX', 'Go on, keep it up!'),
];

/** A wrong answer. */
export const WRONG: Reaction[] = [
  r('¡Hombre!', 'ES', 'Oh, come on!'),
  r('¡Tío!', 'ES', 'Dude!'),
  r('¡Vaya, hombre!', 'ES', 'Oh, man!'),
  r('¡Caramba!', 'both', 'Good grief!'),
  r('¡Híjole!', 'MX', 'Yikes!'),
  r('¡Chale!', 'MX', 'Bummer!'),
  r('¡Dios mío!', 'both', 'Oh my goodness!'),
  r('¡Ay, no!', 'both', 'Oh, no!'),
];

/** A near miss: the right words in the wrong order, or one word off. */
export const SLIP: Reaction[] = [
  r('¡Uy, casi!', 'both', 'Oops, almost!'),
  r('¡Por poquito!', 'MX', 'So close!'),
  r('¡Casi, casi!', 'both', 'Almost, almost!'),
  r('¡Ojo!', 'both', 'Careful!'),
];

/** The whole lesson without a single mistake. */
export const PERFECT: Reaction[] = [
  r('¡Perfecto! ¡Sin un solo error!', 'both', 'Perfect! Not a single mistake!'),
  r('¡Bravo! ¡Lección perfecta!', 'both', 'Bravo! Perfect lesson!'),
  r('¡Qué padre! ¡Todo bien!', 'MX', 'So cool! All correct!'),
];

/** Out of hearts. */
export const OUT_OF_HEARTS: Reaction[] = [
  r('¡Ay, Dios mío! Otra vez será.', 'both', 'Oh my! Next time.'),
  r('¡Vaya, hombre! ¡A intentarlo de nuevo!', 'ES', 'Oh, man! Let’s try again!'),
  r('¡Híjole! ¡Vamos otra vez!', 'MX', 'Yikes! Let’s go again!'),
];

export const FLAG: Record<Region, string> = { MX: '🇲🇽', ES: '🇪🇸', both: '' };

export const ALL_REACTIONS = [...CORRECT, ...STREAK, ...WRONG, ...SLIP, ...PERFECT, ...OUT_OF_HEARTS];

export function pickReaction(list: Reaction[]): Reaction {
  return list[Math.floor(Math.random() * list.length)];
}
