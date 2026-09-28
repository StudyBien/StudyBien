import { THEMES, stripArticle } from '@/lib/content/vocab';
import { LEVELS } from '@/lib/content/levels';

export type GameWord = { word: string; hint: string };
export type GameTheme = { id: string; name: string; nameEn: string; level: string; words: GameWord[] };

/** Themes as games see them: articles removed, English gloss as the hint. */
export function gameThemes(): GameTheme[] {
  return THEMES.map((t) => ({
    id: t.id, name: t.name, nameEn: t.nameEn,
    level: LEVELS.find((l) => l.id === t.level)?.name ?? '',
    words: t.words.map(([es, en]) => ({ word: stripArticle(es), hint: en })),
  }));
}
