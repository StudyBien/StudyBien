'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Plumi, PlumiSays, type Mood } from '@/components/plumi/plumi';
import { speak, preload } from '@/components/plumi/speak';
import { recordLesson, markBurst } from '@/components/plumi/progress';
import { buildExercises, type Exercise } from '@/lib/content/lessons';
import { sameSentence } from '@/lib/content/sentences';

type W = readonly [string, string, string];
type Feedback = { ok: boolean; title: string; detail?: string } | null;

const HEARTS = 5;
const PRAISE = ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Fantástico!', '¡Eso es!', '¡Increíble!', '¡Bien hecho!'];
const COMFORT = ['¡Casi! Lo vemos otra vez.', 'No pasa nada. ¡Sigue!', 'Ánimo, la próxima sí.'];
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export function LessonPlayer({ lessonKey, unitId, title, level, words, pool }: {
  lessonKey: string; unitId: string; title: string; level: string; words: readonly W[]; pool: readonly W[];
}) {
  const [queue, setQueue] = useState<Exercise[] | null>(null);
  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(HEARTS);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [mood, setMood] = useState<Mood>('happy');
  const [finished, setFinished] = useState<{ stars: number; xp: number } | null>(null);

  const start = useCallback(() => {
    const q = buildExercises(words, pool, Math.random, unitId);
    preload([...words.map((w) => w[0]), ...q.flatMap((e) => (e.kind === 'tiles' ? [e.sentence.es] : []))]);
    setQueue(q); setI(0); setHearts(HEARTS); setMistakes(0); setFeedback(null); setFinished(null); setMood('happy');
  }, [words, pool, unitId]);
  useEffect(() => { start(); }, [start]);

  if (!queue) return null;
  const ex = queue[i];
  const total = queue.length;

  function answer(ok: boolean, detail?: string) {
    if (ok) { setMood('cheer'); setFeedback({ ok: true, title: pick(PRAISE), detail }); return; }
    setMood('sad');
    setMistakes((m) => m + 1);
    setHearts((h) => h - 1);
    setFeedback({ ok: false, title: pick(COMFORT), detail });
    if (ex.kind !== 'meet') setQueue((q) => [...q!, ex]);   // it comes back before the end
  }

  function next() {
    setFeedback(null); setMood('happy');
    if (hearts <= 0) return;
    if (i + 1 >= queue!.length) {
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      const xp = 10 + stars * 5;
      recordLesson(lessonKey, stars, xp);
      markBurst(lessonKey);
      setFinished({ stars, xp });
      setMood('cheer');
      speak('¡Lección completa! ¡Bien hecho!');
    } else setI(i + 1);
  }

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
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-4xl" aria-label="Words learned">{words.map((w) => <span key={w[0]} title={w[0]}>{w[2]}</span>)}</div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/learn" className="rounded-xl bg-primary px-8 py-3 font-bold text-paper no-underline hover:bg-primary-hover hover:text-paper">Continuar</Link>
            <button onClick={start} className="rounded-xl border-2 border-rule px-6 py-3 font-bold hover:border-primary">Practicar otra vez</button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={title} level={level} progress={i / total} hearts={hearts}>
      <div className="min-h-[420px]">
        {ex.kind === 'meet' && <Meet key={i} words={ex.words} onReady={next} />}
        {(ex.kind === 'find' || ex.kind === 'listen') && <PickPicture key={i} ex={ex} mood={mood} locked={!!feedback} onAnswer={answer} />}
        {ex.kind === 'name' && <NamePicture key={i} ex={ex} mood={mood} locked={!!feedback} onAnswer={answer} />}
        {ex.kind === 'meaning' && <Meaning key={i} ex={ex} mood={mood} locked={!!feedback} onAnswer={answer} />}
        {ex.kind === 'tiles' && <Tiles key={i} ex={ex} mood={mood} locked={!!feedback} onAnswer={answer} />}
      </div>
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

// ------------------------------------------------------------ layout

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
    <button type="button" onClick={() => speak(text)} aria-label={`Escuchar: ${text}`}
            className={`grid flex-none place-items-center rounded-xl bg-primary text-paper hover:bg-primary-hover ${big ? 'h-20 w-20 text-4xl' : 'h-10 w-10 text-lg'}`}>
      🔊
    </button>
  );
}

/** A picture card. With `label`, the Spanish word sits under the picture. */
function Card({ w, label, state, onClick, disabled }: {
  w: W; label: boolean; state?: 'selected' | 'right' | 'wrong' | 'heard'; onClick: () => void; disabled?: boolean;
}) {
  const ring = state === 'right' ? 'border-teal-deep bg-teal/15' : state === 'wrong' ? 'border-tangerine bg-tangerine-fill'
    : state === 'selected' ? 'border-primary bg-primary-tint' : state === 'heard' ? 'border-teal bg-[#F5FBFF]' : 'border-rule hover:border-primary hover:bg-[#F5FBFF]';
  return (
    <button type="button" onClick={onClick} disabled={disabled}
            className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-b-[5px] p-3 transition active:translate-y-0.5 ${ring}`}>
      <span aria-hidden className="text-[clamp(3rem,10vw,4.5rem)] leading-none">{w[2]}</span>
      {label && <span className="text-center text-lg font-bold leading-tight">{w[0]}</span>}
    </button>
  );
}

// ------------------------------------------------------------ exercises

/** Four new pictures: tap each one to hear it. */
function Meet({ words, onReady }: { words: W[]; onReady: () => void }) {
  const [heard, setHeard] = useState<Set<string>>(new Set());
  const [talking, setTalking] = useState(false);
  const all = heard.size === words.length;
  const tap = (w: W) => {
    setHeard(new Set(heard).add(w[0]));
    setTalking(true);
    speak(w[0], { onEnd: () => setTalking(false) });
  };
  useEffect(() => { speak('¡Palabras nuevas! Toca cada imagen.'); }, []);
  return (
    <div>
      <PlumiSays mood={talking ? 'talking' : all ? 'cheer' : 'happy'} size={100}>
        <p className="font-bold">¡Palabras nuevas!</p>
        <p className="text-ink-soft">{all ? '¡Muy bien! Now let’s practice.' : 'Tap each picture to hear it.'}</p>
      </PlumiSays>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {words.map((w) => (
          <div key={w[0]} className="flex flex-col">
            <Card w={w} label state={heard.has(w[0]) ? 'heard' : undefined} onClick={() => tap(w)} />
            <span className={`mt-1 text-center text-sm ${heard.has(w[0]) ? 'text-ink-soft' : 'text-transparent'}`}>{w[1]}</span>
          </div>
        ))}
      </div>
      <Footer>
        <span className="text-sm text-ink-muted">{heard.size} / {words.length} escuchadas</span>
        <button onClick={onReady} disabled={!all}
                className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">
          Continuar
        </button>
      </Footer>
    </div>
  );
}

/** "¿Cuál es…?" (labelled pictures) or listen-only (unlabelled). */
function PickPicture({ ex, mood, locked, onAnswer }: {
  ex: Extract<Exercise, { kind: 'find' | 'listen' }>; mood: Mood; locked: boolean; onAnswer: (ok: boolean, detail?: string) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  const listen = ex.kind === 'listen';
  useEffect(() => { speak(ex.word[0]); }, [ex]);
  return (
    <div>
      <PlumiSays mood={locked ? mood : 'thinking'} size={100}>
        {listen ? (
          <div className="flex items-center gap-3"><SpeakButton text={ex.word[0]} big /><p className="font-bold">¿Qué escuchas?<br /><span className="text-sm font-normal text-ink-soft">Tap the picture you hear.</span></p></div>
        ) : (
          <div className="flex items-center gap-3"><div><p className="font-bold">¿Cuál es…</p><p className="text-2xl font-bold text-primary">«{ex.word[0]}»?</p></div><SpeakButton text={ex.word[0]} /></div>
        )}
      </PlumiSays>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ex.options.map((o) => (
          <Card key={o[0]} w={o} label={!listen || locked} disabled={locked}
                state={locked ? (o[0] === ex.word[0] ? 'right' : o[0] === sel ? 'wrong' : undefined) : sel === o[0] ? 'selected' : undefined}
                onClick={() => { setSel(o[0]); speak(o[0]); }} />
        ))}
      </div>
      {!locked && (
        <Footer>
          <button disabled={!sel} onClick={() => onAnswer(sel === ex.word[0], `${ex.word[2]} ${ex.word[0]} = ${ex.word[1]}`)}
                  className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">
            Comprobar
          </button>
        </Footer>
      )}
    </div>
  );
}

/** One big picture; pick its Spanish name. */
function NamePicture({ ex, mood, locked, onAnswer }: {
  ex: Extract<Exercise, { kind: 'name' }>; mood: Mood; locked: boolean; onAnswer: (ok: boolean, detail?: string) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div>
      <PlumiSays mood={locked ? mood : 'thinking'} size={100}>
        <p className="font-bold">¿Qué es esto?</p>
        <p className="text-sm text-ink-soft">Choose the Spanish word for the picture.</p>
      </PlumiSays>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[180px_1fr]">
        <div aria-label="Picture" className="grid aspect-square place-items-center rounded-2xl border-2 border-rule bg-[#F5FBFF] text-[6rem] leading-none">{ex.word[2]}</div>
        <div className="grid gap-2">
          {ex.options.map((o) => {
            const state = locked ? (o[0] === ex.word[0] ? 'border-teal-deep bg-teal/15' : o[0] === sel ? 'border-tangerine bg-tangerine-fill' : 'border-rule')
              : sel === o[0] ? 'border-primary bg-primary-tint' : 'border-rule hover:bg-paper-sunk/50';
            return (
              <button key={o[0]} disabled={locked} onClick={() => { setSel(o[0]); speak(o[0]); }}
                      className={`rounded-xl border-2 border-b-4 px-4 py-3 text-left text-lg font-bold ${state}`}>{o[0]}</button>
            );
          })}
        </div>
      </div>
      {!locked && (
        <Footer>
          <button disabled={!sel} onClick={() => { speak(ex.word[0]); onAnswer(sel === ex.word[0], `${ex.word[2]} ${ex.word[0]} = ${ex.word[1]}`); }}
                  className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">
            Comprobar
          </button>
        </Footer>
      )}
    </div>
  );
}

/** Spanish word (with its picture) → pick the English meaning. */
function Meaning({ ex, mood, locked, onAnswer }: {
  ex: Extract<Exercise, { kind: 'meaning' }>; mood: Mood; locked: boolean; onAnswer: (ok: boolean, detail?: string) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => { speak(ex.word[0]); }, [ex]);
  return (
    <div>
      <PlumiSays mood={locked ? mood : 'thinking'} size={100}>
        <p className="font-bold">¿Qué significa?</p>
        <p className="mt-1 flex items-center gap-2 text-2xl font-bold"><span aria-hidden>{ex.word[2]}</span> {ex.word[0]} <SpeakButton text={ex.word[0]} /></p>
      </PlumiSays>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ex.options.map((o, k) => {
          const st = locked ? (o === ex.word[1] ? 'border-teal-deep bg-teal/15' : o === sel ? 'border-tangerine bg-tangerine-fill' : 'border-rule')
            : sel === o ? 'border-primary bg-primary-tint' : 'border-rule hover:bg-paper-sunk/50';
          return (
            <button key={o} disabled={locked} onClick={() => setSel(o)}
                    className={`rounded-xl border-2 border-b-4 px-4 py-3 text-left text-lg font-bold ${st}`}>
              <span className="mr-2 rounded border border-rule px-1.5 text-sm text-ink-muted">{k + 1}</span>{o}
            </button>
          );
        })}
      </div>
      {!locked && (
        <Footer>
          <button disabled={!sel} onClick={() => onAnswer(sel === ex.word[1], `${ex.word[0]} = ${ex.word[1]}`)}
                  className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">Comprobar</button>
        </Footer>
      )}
    </div>
  );
}

/** "Traduce esta oración": build the translation from word tiles. */
function Tiles({ ex, mood, locked, onAnswer }: {
  ex: Extract<Exercise, { kind: 'tiles' }>; mood: Mood; locked: boolean; onAnswer: (ok: boolean, detail?: string) => void;
}) {
  const [chosen, setChosen] = useState<number[]>([]);
  const fromEs = ex.from === 'es';
  const prompt = fromEs ? ex.sentence.es : ex.sentence.en;
  const answer = fromEs ? ex.sentence.en : ex.sentence.es;
  useEffect(() => { if (fromEs) speak(ex.sentence.es); }, [ex, fromEs]);
  const tap = (k: number) => { setChosen([...chosen, k]); if (!fromEs) speak(ex.tiles[k]); };
  return (
    <div>
      <h2 className="text-2xl font-bold">Traduce esta oración</h2>
      <div className="mt-3">
        <PlumiSays mood={locked ? mood : 'talking'} size={90}>
          <p className="flex items-center gap-2 text-xl font-bold">
            {fromEs && <SpeakButton text={ex.sentence.es} />}
            <span className="decoration-primary/40 decoration-dotted underline-offset-4 [text-decoration-line:underline]">{prompt}</span>
            <span aria-hidden className="text-2xl">{ex.word[2]}</span>
          </p>
        </PlumiSays>
      </div>
      {/* answer lines */}
      <div className="mt-4 min-h-[112px] border-b-2 border-t-2 border-rule py-3"
           style={{ backgroundImage: 'linear-gradient(transparent 51px, var(--color-rule) 52px)', backgroundSize: '100% 54px' }}>
        <div className="flex flex-wrap gap-2">
          {chosen.map((k, pos) => (
            <button key={pos} disabled={locked} onClick={() => setChosen(chosen.filter((_, p) => p !== pos))}
                    className="rounded-xl border-2 border-b-4 border-rule bg-paper px-3 py-1.5 text-lg font-bold">{ex.tiles[k]}</button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {ex.tiles.map((t, k) => (
          <button key={k} disabled={locked || chosen.includes(k)} onClick={() => tap(k)}
                  className={`rounded-xl border-2 border-b-4 px-3 py-1.5 text-lg font-bold ${chosen.includes(k) ? 'border-paper-sunk bg-paper-sunk text-transparent' : 'border-rule bg-paper hover:bg-paper-sunk/50'}`}>
            {t}
          </button>
        ))}
      </div>
      {!locked && (
        <Footer>
          <button disabled={!chosen.length}
                  onClick={() => { const ok = sameSentence(chosen.map((k) => ex.tiles[k]), answer); speak(ex.sentence.es); onAnswer(ok, ok ? answer : `Correct answer: ${answer}`); }}
                  className="ml-auto rounded-xl bg-primary px-10 py-3 font-bold text-paper hover:bg-primary-hover disabled:bg-rule disabled:text-ink-muted">Comprobar</button>
        </Footer>
      )}
    </div>
  );
}
