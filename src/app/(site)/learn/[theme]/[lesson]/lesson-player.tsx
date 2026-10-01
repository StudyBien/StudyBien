'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plumi, PlumiSays, type Mood } from '@/components/plumi/plumi';
import { speak } from '@/components/plumi/speak';
import { recordLesson } from '@/components/plumi/progress';
import { buildExercises, checkTyped, type Exercise } from '@/lib/content/lessons';

type W = readonly [string, string];
type Feedback = { ok: boolean; title: string; detail?: string } | null;

const HEARTS = 5;
const PRAISE = ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Fantástico!', '¡Eso es!', '¡Increíble!', '¡Bien hecho!'];
const COMFORT = ['¡Casi! Lo vemos otra vez.', 'No pasa nada. ¡Sigue!', 'Ánimo, la próxima sí.'];
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export function LessonPlayer({ lessonKey, title, level, words, pool, nextHref }: {
  lessonKey: string; title: string; level: string; words: readonly W[]; pool: readonly W[]; nextHref: string;
}) {
  const [queue, setQueue] = useState<Exercise[] | null>(null);
  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(HEARTS);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [mood, setMood] = useState<Mood>('happy');
  const [finished, setFinished] = useState<{ stars: number; xp: number } | null>(null);

  const start = useCallback(() => {
    setQueue(buildExercises(words, pool)); setI(0); setHearts(HEARTS); setMistakes(0); setFeedback(null); setFinished(null); setMood('happy');
  }, [words, pool]);
  useEffect(() => { start(); }, [start]);

  if (!queue) return null;
  const ex = queue[i];
  const total = queue.length;

  function answer(ok: boolean, detail?: string, close = false) {
    if (ok) {
      setMood('cheer');
      setFeedback({ ok: true, title: close ? '¡Casi perfecto!' : pick(PRAISE), detail });
    } else {
      setMood('sad');
      setMistakes((m) => m + 1);
      setHearts((h) => h - 1);
      setFeedback({ ok: false, title: pick(COMFORT), detail });
      // missed items come back before the lesson ends
      if (ex.kind !== 'intro' && ex.kind !== 'match') setQueue((q) => [...q!, ex]);
    }
  }

  function next() {
    setFeedback(null); setMood('happy');
    if (hearts <= 0) return;
    if (i + 1 >= queue!.length) {
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      const xp = 10 + stars * 5;
      recordLesson(lessonKey, stars, xp);
      setFinished({ stars, xp });
      setMood('cheer');
      speak('¡Lección completa! ¡Bien hecho!');
    } else setI(i + 1);
  }

  // ------------------------------------------------------------ end states
  if (hearts <= 0 && !feedback) {
    return (
      <Shell title={title} level={level} progress={i / total} hearts={0}>
        <div className="flex flex-col items-center py-10 text-center">
          <Plumi mood="sad" size={130} />
          <h2 className="mt-4 text-2xl font-bold">¡Ay! Te quedaste sin corazones.</h2>
          <p className="mt-1 text-ink-soft">Every mistake is practice. Let’s try this lesson again!</p>
          <button onClick={start} className="mt-6 rounded-xl bg-primary px-8 py-3 font-bold text-paper hover:bg-primary-hover">Intentar otra vez</button>
        </div>
      </Shell>
    );
  }
  if (finished) {
    return (
      <Shell title={title} level={level} progress={1} hearts={hearts}>
        <div className="flex flex-col items-center py-8 text-center">
          <Plumi mood="cheer" size={140} />
          <h2 className="mt-4 text-3xl font-bold">¡Lección completa!</h2>
          <p className="mt-2 text-4xl text-marigold" aria-label={`${finished.stars} stars`}>{'★'.repeat(finished.stars)}<span className="text-rule">{'★'.repeat(3 - finished.stars)}</span></p>
          <p className="mt-2 text-lg">+{finished.xp} XP · {mistakes === 0 ? '¡Sin errores!' : `${mistakes} error${mistakes === 1 ? '' : 'es'}`}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={nextHref} className="rounded-xl bg-primary px-8 py-3 font-bold text-paper no-underline hover:bg-primary-hover hover:text-paper">Continuar</Link>
            <button onClick={start} className="rounded-xl border-2 border-rule px-6 py-3 font-bold hover:border-primary">Practicar otra vez</button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={title} level={level} progress={i / total} hearts={hearts}>
      <div className="min-h-[380px]">
        {ex.kind === 'intro' && <Intro key={i} word={ex.word} />}
        {(ex.kind === 'meaning' || ex.kind === 'translate' || ex.kind === 'listen') && (
          <Choice key={i} ex={ex} mood={mood} locked={!!feedback} onAnswer={answer} />
        )}
        {ex.kind === 'type' && <Typed key={i} word={ex.word} mood={mood} locked={!!feedback} onAnswer={answer} />}
        {ex.kind === 'build' && <Build key={i} word={ex.word} tiles={ex.tiles} mood={mood} locked={!!feedback} onAnswer={answer} />}
        {ex.kind === 'match' && <Match key={i} pairs={ex.pairs} onDone={() => answer(true, '¡Todas las parejas!')} onMiss={() => { setHearts((h) => h - 1); setMistakes((m) => m + 1); }} />}
      </div>

      {ex.kind === 'intro' && !feedback && (
        <Footer><button onClick={next} className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover">Continuar</button></Footer>
      )}
      {feedback && (
        <Footer tone={feedback.ok ? 'ok' : 'bad'}>
          <div>
            <p className="text-xl font-bold">{feedback.ok ? '✓ ' : '✗ '}{feedback.title}</p>
            {feedback.detail && <p className="mt-0.5">{feedback.detail}</p>}
          </div>
          <button onClick={next} autoFocus
                  className={`ml-auto rounded-xl px-10 py-3 font-bold text-paper ${feedback.ok ? 'bg-teal-deep hover:opacity-90' : 'bg-tangerine hover:opacity-90'}`}>
            Continuar
          </button>
        </Footer>
      )}
    </Shell>
  );
}

// ------------------------------------------------------------ layout pieces

function Shell({ title, level, progress, hearts, children }: { title: string; level: string; progress: number; hearts: number; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/learn" aria-label="Leave lesson" className="text-2xl text-ink-muted no-underline hover:text-ink">×</Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-paper-sunk" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-teal transition-all duration-300" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
        <span className="font-bold text-tangerine" aria-label={`${hearts} hearts`}>♥ {hearts}</span>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">{level} · {title}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Footer({ tone, children }: { tone?: 'ok' | 'bad'; children: React.ReactNode }) {
  return (
    <div className={`mt-6 flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4 ${tone === 'ok' ? 'bg-teal/20 text-teal-ink' : tone === 'bad' ? 'bg-tangerine-fill text-tangerine-ink' : ''}`}>
      {children}
    </div>
  );
}

function SpeakButton({ text, big = false }: { text: string; big?: boolean }) {
  return (
    <span className="inline-flex gap-2">
      <button type="button" onClick={() => speak(text)} aria-label={`Listen: ${text}`}
              className={`grid place-items-center rounded-xl bg-primary text-paper hover:bg-primary-hover ${big ? 'h-20 w-20 text-4xl' : 'h-10 w-10 text-lg'}`}>🔊</button>
      <button type="button" onClick={() => speak(text, { slow: true })} aria-label={`Listen slowly: ${text}`}
              className={`grid place-items-center rounded-xl border-2 border-primary text-primary hover:bg-primary-tint ${big ? 'h-20 w-14 text-2xl' : 'h-10 w-10 text-base'}`}>🐢</button>
    </span>
  );
}

// ------------------------------------------------------------ exercises

function Intro({ word }: { word: W }) {
  const [talking, setTalking] = useState(true);
  useEffect(() => { setTalking(true); speak(word[0], { onEnd: () => setTalking(false) }); const t = setTimeout(() => setTalking(false), 2500); return () => clearTimeout(t); }, [word]);
  return (
    <div>
      <PlumiSays mood={talking ? 'talking' : 'happy'} size={110}>
        <p className="text-sm font-bold uppercase tracking-wide text-primary">Palabra nueva</p>
        <p className="text-sm text-ink-soft">Listen, say it out loud, then continue.</p>
      </PlumiSays>
      <div className="mt-4 rounded-2xl border-2 border-rule p-8 text-center">
        <p className="text-4xl font-bold">{word[0]}</p>
        <p className="mt-2 text-xl text-ink-soft">{word[1]}</p>
        <div className="mt-5 flex justify-center"><SpeakButton text={word[0]} /></div>
      </div>
    </div>
  );
}

function Choice({ ex, mood, locked, onAnswer }: {
  ex: Extract<Exercise, { kind: 'meaning' | 'translate' | 'listen' }>; mood: Mood; locked: boolean;
  onAnswer: (ok: boolean, detail?: string) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  const correct = ex.kind === 'meaning' ? ex.word[1] : ex.word[0];
  useEffect(() => { if (ex.kind === 'listen') speak(ex.word[0]); }, [ex]);
  const prompt = ex.kind === 'meaning' ? '¿Qué significa?' : ex.kind === 'translate' ? '¿Cómo se dice en español?' : 'Escucha y elige.';
  return (
    <div>
      <PlumiSays mood={locked ? mood : 'thinking'} size={100}>
        <p className="font-bold">{prompt}</p>
        {ex.kind === 'meaning' && <p className="mt-1 flex items-center gap-2 text-2xl font-bold">{ex.word[0]} <SpeakButton text={ex.word[0]} /></p>}
        {ex.kind === 'translate' && <p className="mt-1 text-2xl font-bold">“{ex.word[1]}”</p>}
        {ex.kind === 'listen' && <div className="mt-2"><SpeakButton text={ex.word[0]} big /></div>}
      </PlumiSays>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ex.options.map((o, k) => {
          const show = locked && (o === correct ? 'border-teal-deep bg-teal/15' : o === sel ? 'border-tangerine bg-tangerine-fill' : '');
          return (
            <button key={o} disabled={locked} onClick={() => { setSel(o); if (ex.kind !== 'meaning') speak(o); }}
                    className={`rounded-xl border-2 border-b-4 px-4 py-3 text-left text-lg font-bold ${show || (sel === o ? 'border-primary bg-primary-tint' : 'border-rule hover:bg-paper-sunk/50')}`}>
              <span className="mr-2 rounded border border-rule px-1.5 text-sm text-ink-muted">{k + 1}</span>{o}
            </button>
          );
        })}
      </div>
      {!locked && (
        <Footer>
          <button disabled={!sel} onClick={() => onAnswer(sel === correct, sel === correct ? `${ex.word[0]} = ${ex.word[1]}` : `Correct answer: ${correct}`)}
                  className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">
            Comprobar
          </button>
        </Footer>
      )}
    </div>
  );
}

function Typed({ word, mood, locked, onAnswer }: { word: W; mood: Mood; locked: boolean; onAnswer: (ok: boolean, detail?: string, close?: boolean) => void }) {
  const [v, setV] = useState('');
  const submit = () => {
    const r = checkTyped(v, word[0]);
    speak(word[0]);
    if (r === 'exact') onAnswer(true, word[0]);
    else if (r === 'close') onAnswer(true, `Watch the accents and punctuation: ${word[0]}`, true);
    else onAnswer(false, `Correct answer: ${word[0]}`);
  };
  return (
    <div>
      <PlumiSays mood={locked ? mood : 'thinking'} size={100}>
        <p className="font-bold">Escribe en español:</p>
        <p className="mt-1 text-2xl font-bold">“{word[1]}”</p>
      </PlumiSays>
      <form onSubmit={(e) => { e.preventDefault(); if (v.trim() && !locked) submit(); }}>
        <input value={v} onChange={(e) => setV(e.target.value)} disabled={locked} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false}
               aria-label="Your answer" className="mt-4 w-full rounded-xl border-2 border-rule bg-paper-sunk/30 px-4 py-4 text-2xl focus:border-primary focus:outline-none" />
        <AccentKeys onKey={(k) => setV((x) => x + k)} disabled={locked} />
        {!locked && (
          <Footer>
            <button disabled={!v.trim()} className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">Comprobar</button>
          </Footer>
        )}
      </form>
    </div>
  );
}

function AccentKeys({ onKey, disabled }: { onKey: (k: string) => void; disabled: boolean }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'].map((k) => (
        <button type="button" key={k} disabled={disabled} onClick={() => onKey(k)}
                className="h-9 w-9 rounded-lg border border-rule font-bold hover:border-primary">{k}</button>
      ))}
    </div>
  );
}

function Build({ word, tiles, mood, locked, onAnswer }: { word: W; tiles: string[]; mood: Mood; locked: boolean; onAnswer: (ok: boolean, detail?: string) => void }) {
  const [chosen, setChosen] = useState<number[]>([]);
  const target = useMemo(() => word[0].replace(/[¿?¡!.,…]/g, '').split(/\s+/).filter(Boolean).join(' ').toLowerCase(), [word]);
  const built = chosen.map((k) => tiles[k]).join(' ').toLowerCase();
  return (
    <div>
      <PlumiSays mood={locked ? mood : 'thinking'} size={100}>
        <p className="font-bold">Forma la frase en español:</p>
        <p className="mt-1 text-2xl font-bold">“{word[1]}”</p>
      </PlumiSays>
      <div className="mt-4 flex min-h-[64px] flex-wrap gap-2 border-b-2 border-rule pb-3">
        {chosen.map((k, pos) => (
          <button key={pos} disabled={locked} onClick={() => setChosen(chosen.filter((_, p) => p !== pos))}
                  className="rounded-xl border-2 border-b-4 border-rule bg-paper px-3 py-2 text-lg font-bold">{tiles[k]}</button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tiles.map((t, k) => (
          <button key={k} disabled={locked || chosen.includes(k)} onClick={() => { setChosen([...chosen, k]); speak(t); }}
                  className={`rounded-xl border-2 border-b-4 px-3 py-2 text-lg font-bold ${chosen.includes(k) ? 'border-paper-sunk bg-paper-sunk text-transparent' : 'border-rule hover:bg-paper-sunk/50'}`}>{t}</button>
        ))}
      </div>
      {!locked && (
        <Footer>
          <button disabled={!chosen.length} onClick={() => { speak(word[0]); onAnswer(built === target, built === target ? word[0] : `Correct answer: ${word[0]}`); }}
                  className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">Comprobar</button>
        </Footer>
      )}
    </div>
  );
}

function Match({ pairs, onDone, onMiss }: { pairs: W[]; onDone: () => void; onMiss: () => void }) {
  const left = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);
  const right = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);
  const [selL, setSelL] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [fired, setFired] = useState(false);

  function pickRight(en: string) {
    if (!selL) return;
    const pair = pairs.find((p) => p[0] === selL)!;
    if (pair[1] === en) {
      const m = new Set(matched).add(selL); setMatched(m); setSelL(null);
      if (m.size === pairs.length && !fired) { setFired(true); onDone(); }
    } else { setWrong(en); onMiss(); setTimeout(() => setWrong(null), 500); }
  }
  return (
    <div>
      <PlumiSays mood="thinking" size={100}><p className="font-bold">Empareja las palabras.</p><p className="text-sm text-ink-soft">Tap a Spanish word, then its meaning.</p></PlumiSays>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {left.map(([es]) => (
            <button key={es} disabled={matched.has(es)} onClick={() => { setSelL(es); speak(es); }}
                    className={`w-full rounded-xl border-2 border-b-4 px-3 py-3 font-bold ${matched.has(es) ? 'border-paper-sunk text-ink-muted opacity-40' : selL === es ? 'border-primary bg-primary-tint' : 'border-rule hover:bg-paper-sunk/50'}`}>{es}</button>
          ))}
        </div>
        <div className="space-y-2">
          {right.map(([es, en]) => (
            <button key={en} disabled={matched.has(es)} onClick={() => pickRight(en)}
                    className={`w-full rounded-xl border-2 border-b-4 px-3 py-3 font-bold ${matched.has(es) ? 'border-paper-sunk text-ink-muted opacity-40' : wrong === en ? 'border-tangerine bg-tangerine-fill' : 'border-rule hover:bg-paper-sunk/50'}`}>{en}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
