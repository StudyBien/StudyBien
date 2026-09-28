import Link from 'next/link';
import type { Metadata } from 'next';
import { LevelTabs, parseLevel } from '@/components/level-tabs';
import { readingsForLevel } from '@/lib/content/readings';
import { levelById } from '@/lib/content/levels';

export const metadata: Metadata = { title: 'Spanish Reading Comprehension' };

export default async function Reading({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const level = parseLevel((await searchParams).level);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Reading Comprehension</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Original passages for {levelById(level)?.name}, each with comprehension questions and a writing task.
        Passages grow from short descriptions in Spanish 1 to literary and academic essays at college level.
      </p>
      <div className="mt-6"><LevelTabs base="/resources/reading" current={level} /></div>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {readingsForLevel(level).map((r) => (
          <li key={r.id}>
            <Link href={`/resources/reading/${r.id}`}
                  className="flex h-full flex-col rounded-[var(--radius-lg)] border border-rule p-5 text-ink no-underline hover:border-primary hover:text-ink">
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">{r.genre}</span>
              <span className="mt-2 text-lg font-bold">{r.title}</span>
              <span className="text-sm text-ink-soft">{r.titleEn}</span>
              <span className="mt-3 line-clamp-3 font-serif text-sm text-ink-soft">{r.paragraphs[0]}</span>
              <span className="mt-auto pt-4 text-sm text-ink-muted">{r.questions.length} questions · writing ({r.writing.minWords}+ words)</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
