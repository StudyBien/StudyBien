'use client';

import { useState, useTransition } from 'react';
import type { Worksheet } from '@/lib/content/catalog';

type Submit = (answers: Record<string, string>, writing: string) => Promise<{ saved: true } | { error: string } | { saved: true; result?: unknown }>;

/** A worksheet or written task, filled in on screen. */
export function WrittenWork({ ws, prompt, submit }: { ws?: Worksheet; prompt?: string | null; submit: Submit }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const hasLines = !ws || ws.sections.some((s) => s.lines);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  let n = 0;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm('Turn this in? You can’t change it afterwards.')) return;
    start(async () => {
      const r = await submit(answers, text);
      if ('error' in r) setError(r.error); else setSaved(true);
    });
  }

  if (saved) return <p className="rounded-[var(--radius-lg)] bg-teal/15 p-5 text-lg font-bold">Turned in ✓ Your teacher will grade it soon.</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {ws?.sections.map((s, si) => (
        <section key={si}>
          <h3 className="text-lg font-bold">{s.heading}</h3>
          <p className="text-sm italic text-ink-soft">{s.instructions}</p>
          {s.items.length > 0 && (
            <ol className="mt-3 grid gap-3 sm:grid-cols-2">
              {s.items.map((it, ii) => {
                n += 1;
                const k = `${si}-${ii}`;
                return (
                  <li key={k} className="rounded-lg border border-rule p-3">
                    <p><span className="font-bold text-ink-muted">{n}.</span> {it.prompt}</p>
                    {it.choices && <p className="mt-1 text-sm text-ink-soft">{it.choices.join(' · ')}</p>}
                    <input value={answers[k] ?? ''} onChange={(e) => setAnswers({ ...answers, [k]: e.target.value })}
                           maxLength={200} aria-label={`Answer ${n}`}
                           className="mt-2 w-full rounded-lg border border-rule px-3 py-1.5 focus:border-primary focus:outline-none" />
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      ))}
      {prompt && !ws && <p className="whitespace-pre-line rounded-[var(--radius-md)] bg-paper-sunk/50 p-4">{prompt}</p>}
      {hasLines && (
        <label className="block">
          <span className="font-bold">{ws ? 'Your writing (for the writing sections above)' : 'Your response'}</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12}
                    className="mt-2 w-full rounded-lg border border-rule p-3 font-serif leading-relaxed focus:border-primary focus:outline-none" placeholder="Escribe aquí…" />
          <span className="block text-right text-sm text-ink-muted">{words} palabras</span>
        </label>
      )}
      {error && <p className="rounded-lg bg-tangerine-fill p-3 text-tangerine-ink">{error}</p>}
      <button disabled={pending} className="rounded-lg bg-primary px-6 py-3 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
        {pending ? 'Submitting…' : 'Turn it in'}
      </button>
    </form>
  );
}
