import Link from 'next/link';
import type { Metadata } from 'next';
import { gameThemes } from '@/components/games/game-words';

export const metadata: Metadata = { title: 'Spanish Games: Hangman and Word Search' };

const FEATURED = ['verbos', 'colores', 'animales', 'comida', 'numeros', 'familia', 'ropa', 'cuerpo'];

export default function Games() {
  const themes = gameThemes().filter((t) => FEATURED.includes(t.id));
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Games</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Practice vocabulary the fun way. Every game works with {gameThemes().length} categories, from colors
        and animals in Spanish 1 to idioms and false cognates at college level.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <GameCard href="/games/hangman" title="El ahorcado" en="Hangman" blurb="Guess the Spanish word letter by letter before the drawing is finished. The English meaning is your hint." icon="🪢" />
        <GameCard href="/games/word-search" title="Sopa de letras" en="Word search" blurb="Find the hidden Spanish words in a 12 × 12 grid. Turn on difícil for backwards and diagonal words." icon="🔎" />
      </div>
      <h2 className="mt-12 text-xl font-bold">Jump into a category</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((t) => (
          <div key={t.id} className="rounded-[var(--radius-md)] border border-rule p-4">
            <p className="font-bold">{t.name}</p>
            <p className="text-sm text-ink-muted">{t.nameEn}</p>
            <p className="mt-2 flex gap-3 text-sm">
              <Link href={`/games/hangman?theme=${t.id}`}>Hangman</Link>
              <Link href={`/games/word-search?theme=${t.id}`}>Word search</Link>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function GameCard({ href, title, en, blurb, icon }: { href: string; title: string; en: string; blurb: string; icon: string }) {
  return (
    <Link href={href} className="rounded-[var(--radius-lg)] border border-rule p-6 text-ink no-underline hover:border-primary hover:shadow-md hover:text-ink">
      <span aria-hidden className="text-4xl">{icon}</span>
      <p className="mt-3 text-2xl font-bold">{title}</p>
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">{en}</p>
      <p className="mt-2 text-ink-soft">{blurb}</p>
      <p className="mt-4 font-bold text-primary">Play →</p>
    </Link>
  );
}
