import Link from 'next/link';
import type { GameTheme } from './game-words';

export function ThemePicker({ themes, current, base }: { themes: GameTheme[]; current: string; base: string }) {
  const levels = [...new Set(themes.map((t) => t.level))];
  return (
    <details className="rounded-[var(--radius-md)] border border-rule p-3">
      <summary className="cursor-pointer font-bold">Change category: <span className="text-primary">{themes.find((t) => t.id === current)?.name}</span></summary>
      <div className="mt-3 space-y-3">
        {levels.map((lvl) => (
          <div key={lvl}>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">{lvl}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {themes.filter((t) => t.level === lvl).map((t) => (
                <Link key={t.id} href={`${base}?theme=${t.id}`}
                      className={`rounded-full border px-3 py-1 text-sm no-underline ${t.id === current ? 'border-primary bg-primary text-paper hover:text-paper' : 'border-rule text-ink hover:border-primary hover:text-ink'}`}>
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
