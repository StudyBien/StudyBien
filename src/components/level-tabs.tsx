import Link from 'next/link';
import { LEVELS, type LevelId } from '@/lib/content/levels';

/** Level switcher shared by every library shelf. */
export function LevelTabs({ base, current }: { base: string; current: LevelId }) {
  return (
    <div className="-mx-1 flex flex-wrap gap-2" role="tablist" aria-label="Level">
      {LEVELS.map((l) => (
        <Link
          key={l.id}
          href={`${base}?level=${l.id}`}
          role="tab"
          aria-selected={l.id === current}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-bold no-underline ${
            l.id === current
              ? 'border-primary bg-primary text-paper hover:text-paper'
              : 'border-rule bg-paper text-ink hover:border-primary hover:text-ink'
          }`}
        >
          {l.name}
        </Link>
      ))}
    </div>
  );
}

export function parseLevel(v: string | string[] | undefined): LevelId {
  const s = Array.isArray(v) ? v[0] : v;
  return (LEVELS.find((l) => l.id === s)?.id ?? 'spanish-1');
}
