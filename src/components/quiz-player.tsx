'use client';

import { useState, useTransition } from 'react';
import type { PublicQuestion, GradeResult } from '@/lib/content/catalog';

export type SubmitFn = (answers: Record<string, string>, writing: string) => Promise<GradeResult | { error: string } | { saved: true; result?: GradeResult }>;

/**
 * Takes a quiz. Answers are held here and sent once; the server grades and
 * sends back which were right, so the answer key is never in the page.
 */
export function QuizPlayer({
  questions, submit, writing, submitLabel = 'Check my answers', locked = false,
}: {
  questions: PublicQuestion[];
  submit: SubmitFn;
  writing?: { prompt: string; minWords: number };
  submitLabel?: string;
  locked?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState('');
  const [result, setResult] = useState<GradeResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const byId = new Map(result?.results.map((r) => [r.id, r]));
  const answered = Object.keys(answers).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const done = result !== null || saved;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answered < questions.length && !confirm(`You answered ${answered} of ${questions.length}. Submit anyway?`)) return;
    start(async () => {
      const r = await submit(answers, text);
      if ('error' in r) { setError(r.error); return; }
      setError(null);
      if ('saved' in r) { setSaved(true); if (r.result) setResult(r.result); }
      else setResult(r);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  let section: string | undefined;
  return (
    <form onSubmit={onSubmit}>
      {result && (
        <div className="mb-6 rounded-[var(--radius-lg)] bg-primary-tint p-5">
          <p className="text-2xl font-bold">{result.score} / {result.max} <span className="text-base font-normal text-ink-soft">({Math.round(100 * result.score / Math.max(1, result.max))}%)</span></p>
          <p className="text-sm text-ink-soft">{saved ? 'Submitted to your teacher.' : '¡Buen trabajo! Review the explanations below, or try again.'}</p>
        </div>
      )}
      {saved && !result && (
        <div className="mb-6 rounded-[var(--radius-lg)] bg-primary-tint p-5 font-bold">Submitted to your teacher. ✓</div>
      )}

      <ol className="space-y-5">
        {questions.map((q, i) => {
          const r = byId.get(q.id);
          const header = q.section && q.section !== section ? (section = q.section) : null;
          return (
            <li key={q.id}>
              {header && <h3 className="mb-3 mt-8 border-b border-rule pb-1 text-lg font-bold">{header}</h3>}
              <fieldset className={`rounded-[var(--radius-md)] border p-4 ${r ? (r.correct ? 'border-teal-deep bg-teal/10' : 'border-tangerine bg-tangerine-fill') : 'border-rule'}`}>
                <legend className="px-1 font-bold"><span className="text-ink-muted">{i + 1}.</span> {q.prompt}</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {q.choices.map((c, ci) => {
                    const chosen = answers[q.id] === String(ci);
                    const isAnswer = r && r.answer === ci;
                    return (
                      <label key={ci}
                             className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${
                               isAnswer ? 'border-teal-deep font-bold' : chosen ? 'border-primary bg-primary-tint' : 'border-rule hover:border-primary'
                             } ${done || locked ? 'cursor-default' : ''}`}>
                        <input type="radio" name={q.id} value={ci} checked={chosen} disabled={done || locked}
                               onChange={() => setAnswers({ ...answers, [q.id]: String(ci) })} className="accent-[var(--color-primary)]" />
                        <span>{c}</span>
                        {isAnswer && <span className="ml-auto text-teal-deep" aria-label="correct answer">✓</span>}
                      </label>
                    );
                  })}
                </div>
                {r && !r.correct && r.why && <p className="mt-2 text-sm text-tangerine-ink">{r.why}</p>}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {writing && (
        <div className="mt-8 rounded-[var(--radius-md)] border border-rule p-4">
          <h3 className="text-lg font-bold">Escritura</h3>
          <p className="mt-1 text-ink-soft">{writing.prompt}</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={done || locked} rows={10}
                    className="mt-3 w-full rounded-lg border border-rule p-3 font-serif leading-relaxed focus:border-primary focus:outline-none"
                    placeholder="Escribe aquí…" />
          <p className={`text-right text-sm ${words >= writing.minWords ? 'text-teal-deep' : 'text-ink-muted'}`}>
            {words} / {writing.minWords} palabras
          </p>
        </div>
      )}

      {error && <p className="mt-4 rounded bg-tangerine-fill p-3 text-tangerine-ink">{error}</p>}

      {!locked && (
        <div className="mt-6 flex flex-wrap gap-3">
          {!done ? (
            <button disabled={pending}
                    className="rounded-lg bg-primary px-6 py-3 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
              {pending ? 'Checking…' : submitLabel}
            </button>
          ) : !saved && (
            <button type="button" onClick={() => { setAnswers({}); setResult(null); setText(''); window.scrollTo({ top: 0 }); }}
                    className="rounded-lg border border-rule px-6 py-3 font-bold hover:border-primary">
              Try again
            </button>
          )}
        </div>
      )}
    </form>
  );
}
