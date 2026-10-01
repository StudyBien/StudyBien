'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Plumi, PlumiSays } from '@/components/plumi/plumi';
import { loadProgress, takeBurst, type Progress } from '@/components/plumi/progress';
import { speak } from '@/components/plumi/speak';

type L = { id: string; name: string; school: string; units: Array<{ id: string; name: string; nameEn: string; pics: string[]; lessons: Array<{ key: string; index: number }> }> };

const LEVEL_KEY = 'studybien.plumi.cefr';

export function LearnPath({ levels }: { levels: L[] }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [levelId, setLevelId] = useState(levels[0].id);
  const [burst, setBurst] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    const b = takeBurst();
    let start = levels[0].id;
    try { const s = localStorage.getItem(LEVEL_KEY); if (s && levels.some((l) => l.id === s)) start = s; } catch { /* ignore */ }
    if (b) {
      const owner = levels.find((l) => l.units.some((u) => u.lessons.some((x) => x.key === b)));
      if (owner) start = owner.id;
      setBurst(b);
      speak('¡Nivel completado! ¡Felicidades!');
    }
    setLevelId(start);
  }, [levels]);
  const choose = (id: string) => { setLevelId(id); try { localStorage.setItem(LEVEL_KEY, id); } catch { /* ignore */ } };

  const level = levels.find((l) => l.id === levelId)!;
  const niveles = level.units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })));
  const next = niveles.find((l) => !progress?.lessons[l.key]);
  const done = niveles.filter((l) => progress?.lessons[l.key]).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PlumiSays mood={burst ? 'cheer' : 'happy'} size={96}>
          <p className="font-bold">{burst ? '¡Nivel completado! 🎉' : '¡Hola! Soy Plumi. 🪶'}</p>
          <p className="text-ink-soft">{next ? <>Next up: <strong>Nivel {niveles.indexOf(next) + 1}</strong> · {next.unit.name}</> : '¡Terminaste este nivel! Pick another level.'}</p>
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
                  className={`rounded-full border px-4 py-1.5 text-sm font-bold ${l.id === levelId ? 'border-primary bg-primary text-paper' : 'border-rule bg-paper hover:border-primary'}`}>
            {l.id}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="text-sm text-ink-muted"><strong className="text-ink">{level.name}</strong> · about {level.school}</p>
        <div className="h-2.5 min-w-[140px] flex-1 overflow-hidden rounded-full bg-paper-sunk" aria-label={`${done} of ${niveles.length} niveles complete`}>
          <div className="h-full rounded-full bg-marigold transition-all" style={{ width: `${(100 * done) / Math.max(1, niveles.length)}%` }} />
        </div>
        <p className="text-sm font-bold">{done} / {niveles.length}</p>
      </div>

      <ol className="relative mt-8">
        {/* the trail */}
        <span aria-hidden className="absolute bottom-6 left-[31px] top-6 w-1.5 rounded-full bg-paper-sunk" />
        {niveles.map((n, k) => {
          const stars = progress?.lessons[n.key] ?? 0;
          const isNext = next?.key === n.key;
          const firstOfUnit = n.index === 0;
          return (
            <li key={n.key}>
              {firstOfUnit && (
                <div className="relative mb-3 ml-[84px] mt-6 flex items-center gap-2 first:mt-0">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">{n.unit.name} · {n.unit.nameEn}</span>
                  <span aria-hidden>{n.unit.pics.join(' ')}</span>
                </div>
              )}
              <Link href={`/learn/${n.unit.id}/${n.index}`} className="group relative mb-4 flex items-center gap-5 text-ink no-underline hover:text-ink">
                <NivelBubble number={k + 1} stars={stars} isNext={isNext} burst={burst === n.key} />
                <div className={`flex-1 rounded-2xl border-2 px-5 py-3 transition group-hover:-translate-y-0.5 group-hover:shadow-md ${
                  isNext ? 'border-primary bg-[#F5FBFF]' : stars ? 'border-marigold/60 bg-paper' : 'border-rule bg-paper'}`}>
                  <p className="text-lg font-bold">Nivel {k + 1}</p>
                  <p className="text-sm text-ink-soft">
                    {n.unit.name} · Lección {n.index + 1}
                    {stars > 0 && <span className="ml-2 text-marigold" aria-label={`${stars} stars`}>{'★'.repeat(stars)}<span className="text-rule">{'★'.repeat(3 - stars)}</span></span>}
                    {isNext && <span className="ml-2 font-bold text-primary">¡Empieza aquí!</span>}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
      {!next && niveles.length > 0 && (
        <div className="mt-6 flex items-center gap-4 rounded-2xl bg-marigold-fill/60 p-5">
          <Plumi mood="cheer" size={70} />
          <p className="text-lg font-bold">¡Felicidades! You finished every nivel in {level.id}.</p>
        </div>
      )}
    </div>
  );
}

function NivelBubble({ number, stars, isNext, burst }: { number: number; stars: number; isNext: boolean; burst: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (burst) ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [burst]);
  const done = stars > 0;
  return (
    <span ref={ref} className="relative z-10 grid h-16 w-16 flex-none place-items-center">
      {burst && <Burst />}
      <span className={`grid h-16 w-16 place-items-center rounded-full border-4 text-xl font-bold shadow-sm transition group-hover:scale-105 ${
        done ? 'border-marigold-ink/30 bg-marigold text-marigold-ink' : isNext ? 'nivel-pulse border-primary-deep bg-primary text-paper' : 'border-paper bg-paper-sunk text-ink-muted'
      } ${burst ? 'nivel-pop' : ''}`}>
        {done ? '✓' : number}
      </span>
    </span>
  );
}

/** A small burst of confetti around a bubble. */
function Burst() {
  const colors = ['var(--color-primary)', 'var(--color-marigold)', 'var(--color-teal)', 'var(--color-tangerine-bright)'];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 46 + (i % 3) * 12;
        return (
          <span key={i} className="nivel-spark absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-sm"
                style={{
                  background: colors[i % colors.length],
                  ['--dx' as string]: `${Math.cos(angle) * dist}px`,
                  ['--dy' as string]: `${Math.sin(angle) * dist}px`,
                  animationDelay: `${(i % 4) * 30}ms`,
                }} />
        );
      })}
      <span className="nivel-ring absolute inset-0 rounded-full border-4 border-marigold" />
    </span>
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
