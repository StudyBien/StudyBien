import Link from 'next/link';
import type { Metadata } from 'next';
import { gameThemes } from '@/components/games/game-words';
import { ThemePicker } from '@/components/games/theme-picker';
import { Hangman } from '@/components/games/hangman';

export const metadata: Metadata = { title: 'Spanish Hangman' };

export default async function Page({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const themes = gameThemes();
  const want = (await searchParams).theme;
  const theme = themes.find((t) => t.id === want) ?? themes.find((t) => t.id === 'verbos')!;
  return (
    <>
      <Link href="/games" className="text-sm">← All games</Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">El ahorcado <span className="text-lg font-normal text-ink-muted">· Hangman</span></h1>
      <p className="mt-1 text-ink-soft">Category: <strong>{theme.name}</strong> ({theme.nameEn}, {theme.level})</p>
      <div className="mt-4"><ThemePicker themes={themes} current={theme.id} base="/games/hangman" /></div>
      <div className="mt-8"><Hangman theme={theme} /></div>
    </>
  );
}
