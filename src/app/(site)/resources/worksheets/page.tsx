import Link from 'next/link';
import type { Metadata } from 'next';
import { LevelTabs, parseLevel } from '@/components/level-tabs';
import { worksheetsForLevel } from '@/lib/content/catalog';
import { levelById } from '@/lib/content/levels';

export const metadata: Metadata = { title: 'Spanish Worksheets with Answer Keys' };

const ORDER = ['Vocabulario', 'Verbos', 'Gramática', 'Lectura y escritura'] as const;
const PDF_LEVELS = new Set(['spanish-1', 'spanish-2', 'spanish-3']);

export default async function WorksheetsShelf({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const level = parseLevel((await searchParams).level);
  const L = levelById(level)!;
  const sheets = worksheetsForLevel(level);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Worksheets</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Every worksheet is paired with its answer key. Open one, print it, and switch to the
        <strong> Answer key</strong> tab when you’re ready to grade. Answer keys need a free teacher account.
      </p>
      <div className="mt-6"><LevelTabs base="/resources/worksheets" current={level} /></div>
      <p className="mt-4 text-sm text-ink-muted">{L.name}: {L.blurb}</p>

      {ORDER.map((cat) => {
        const list = sheets.filter((s) => s.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="mt-8">
            <h2 className="text-xl font-bold">{cat}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((w) => (
                <li key={w.id} className="flex flex-col rounded-[var(--radius-md)] border border-rule p-4">
                  <Link href={`/resources/worksheets/${w.id}`} className="font-bold text-ink no-underline hover:text-primary">{w.title}</Link>
                  <span className="text-sm text-ink-soft">{w.subtitle}</span>
                  <span className="mt-3 flex gap-3 text-sm">
                    <Link href={`/resources/worksheets/${w.id}`}>Worksheet</Link>
                    <Link href={`/resources/worksheets/${w.id}?tab=key`}>Answer key</Link>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {PDF_LEVELS.has(level) && (
        <p className="mt-10 rounded-[var(--radius-md)] bg-primary-tint p-4 text-sm">
          Looking for PDF downloads? The <Link href="/worksheets" className="font-bold">PDF worksheet library</Link> has
          ready-to-print verb drills for Spanish 1–3.
        </p>
      )}
    </>
  );
}
