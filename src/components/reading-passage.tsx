import type { Reading } from '@/lib/content/readings';

export function ReadingPassage({ reading }: { reading: Reading }) {
  return (
    <article className="rounded-[var(--radius-lg)] border border-rule bg-paper-sunk/40 p-6 sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">{reading.genre}</p>
      <h2 className="mt-1 text-2xl font-bold">{reading.title}</h2>
      <p className="text-sm text-ink-muted">{reading.titleEn}</p>
      <div className="mt-4 max-w-[68ch] space-y-4 font-serif text-[17px] leading-relaxed">
        {reading.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}
