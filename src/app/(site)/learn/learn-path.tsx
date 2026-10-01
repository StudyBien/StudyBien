'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PlumiSays } from '@/components/plumi/plumi';
import { loadProgress, type Progress } from '@/components/plumi/progress';
import { speak } from '@/components/plumi/speak';

type L = { id: string; name: string; units: Array<{ id: string; name: string; nameEn: string; lessons: Array<{ key: string; index: number; count: number }> }> };

const LEVEL_KEY = 'studybien.plumi.level';

export function LearnPath({ levels }: { levels: L[] }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [levelId, setLevelId] = useState(levels[0].id);
  useEffect(() => {
    setProgress(loadProgress());
    try { const s = localStorage.getItem(LEVEL_KEY); if (s && levels.some((l) => l.id === s)) setLevelId(s); } catch { /* ignore */ }
  }, [levels]);
  const choose = (id: string) => { setLevelId(id); try { localStorage.setItem(LEVEL_KEY, id); } catch { /* ignore */ } };

  const level = levels.find((l) => l.id === levelId)!;
  const all = level.units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })));
  const next = all.find((l) => !progress?.lessons[l.key]);
  const done = all.filter((l) => progress?.lessons[l.key]).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PlumiSays mood="happy" size={96}>
          <p className="font-bold">¡Hola! Soy Plumi. 🪶</p>
          <p className="text-ink-soft">{next ? <>Let’s learn <strong>{next.unit.name}</strong> together.</> : '¡Terminaste este nivel! Pick another level.'}</p>
          <button onClick={() => speak('¡Hola! Soy Plumi. ¡Vamos a aprender español!')} className="mt-1 text-sm font-bold text-primary">🔊 Escuchar</button>
        </PlumiSays>
        <div className="flex gap-3 text-center">
          <Stat label="Racha" value={`🔥 ${progress?.streak ?? 0}`} />
          <Stat label="XP" value={`⭐ ${progress?.xp ?? 0}`} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Level">
        {levels.map((l) => (
          <button key={l.id} role="tab" aria-selected={l.id === levelId} onClick={() => choose(l.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-bold ${l.id === levelId ? 'border-primary bg-primary text-paper' : 'border-rule hover:border-primary'}`}>
            {l.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-muted">{done} of {all.length} lessons complete</p>

      <ol className="mt-8 space-y-10">
        {level.units.map((u, ui) => (
          <li key={u.id}>
            <div className="rounded-[var(--radius-lg)] bg-primary-deep px-5 py-3 text-paper">
              <p className="font-mono text-xs uppercase tracking-[0.08em] opacity-80">Unidad {ui + 1}</p>
              <p className="text-lg font-bold">{u.name} <span className="font-normal opacity-80">· {u.nameEn}</span></p>
            </div>
            <div className="mt-5 flex flex-col items-center gap-4">
              {u.lessons.map((l, li) => {
                const stars = progress?.lessons[l.key] ?? 0;
                const isNext = next?.key === l.key;
                const offset = [0, 48, 72, 48, 0, -48, -72, -48][(ui * 3 + li) % 8];
                return (
                  <Link key={l.key} href={`/learn/${u.id}/${l.index}`} style={{ transform: `translateX(${offset}px)` }}
                        className="group relative flex flex-col items-center no-underline">
                    {isNext && <span className="absolute -top-8 rounded-lg bg-paper px-2 py-0.5 text-xs font-bold text-primary shadow">¡EMPIEZA!</span>}
                    <span className={`grid h-16 w-16 place-items-center rounded-full border-b-[6px] text-2xl font-bold transition group-hover:scale-105 ${
                      stars ? 'border-marigold-ink bg-marigold text-marigold-ink' : isNext ? 'border-primary-deep bg-primary text-paper' : 'border-rule bg-paper-sunk text-ink-muted'}`}>
                      {stars ? '★' : li + 1}
                    </span>
                    <span className="mt-1 text-xs text-ink-muted">{stars ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : `${l.count} words`}</span>
                  </Link>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-rule px-4 py-2">
      <p className="text-lg font-bold">{value}</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">{label}</p>
    </div>
  );
}
