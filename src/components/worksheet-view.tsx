import type { Worksheet } from '@/lib/content/catalog';
import type { Reading } from '@/lib/content/readings';
import { levelById } from '@/lib/content/levels';

/** A printable worksheet. With `showKey`, every blank is filled in. */
export function WorksheetView({ ws, reading, showKey }: { ws: Worksheet; reading?: Reading; showKey: boolean }) {
  let n = 0;
  return (
    <article className="worksheet mx-auto max-w-[8.5in] rounded-[var(--radius-md)] border border-rule bg-white p-6 sm:p-10 print:border-0 print:p-0">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            StudyBien · {levelById(ws.level)?.name} · {ws.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{ws.title}{showKey && <span className="ml-2 text-tangerine">— Answer key</span>}</h1>
          <p className="text-sm text-ink-soft">{ws.subtitle}</p>
        </div>
        <div className="space-y-1 text-sm">
          <p>Nombre: ______________________</p>
          <p>Fecha: ________ Clase: ______</p>
        </div>
      </header>

      {reading && (
        <section className="mt-6">
          <h2 className="text-lg font-bold">{reading.title}</h2>
          <div className="mt-2 space-y-3 font-serif text-[15px] leading-relaxed">
            {reading.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>
      )}

      {ws.sections.map((s) => (
        <section key={s.heading} className="mt-7 break-inside-avoid-page">
          <h2 className="text-lg font-bold">{s.heading}</h2>
          <p className="text-sm italic text-ink-soft">{s.instructions}</p>
          {s.items.length > 0 && (
            <ol className={`mt-3 grid gap-x-8 gap-y-3 ${s.items.some((i) => i.choices) ? '' : 'sm:grid-cols-2'}`}>
              {s.items.map((item) => {
                n += 1;
                return (
                  <li key={n} className="flex gap-2 break-inside-avoid">
                    <span className="w-6 flex-none text-right font-bold tabular-nums">{n}.</span>
                    <div className="min-w-0 flex-1">
                      <p>{item.prompt}</p>
                      {item.choices && (
                        <p className="mt-1 flex flex-wrap gap-x-5 text-sm text-ink-soft">
                          {item.choices.map((c, i) => (
                            <span key={c} className={showKey && c === item.answer ? 'font-bold text-primary-deep underline' : ''}>
                              {String.fromCharCode(97 + i)}) {c}
                            </span>
                          ))}
                        </p>
                      )}
                      <p className={`mt-1 min-h-6 border-b border-ink-muted ${showKey ? 'font-bold text-primary-deep' : ''}`}>
                        {showKey ? item.answer : ' '}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          {s.lines && (
            <div className="mt-3 space-y-5">
              {showKey ? (
                <p className="rounded bg-paper-sunk p-3 text-sm">Answers will vary. Look for accurate use of the target structures and vocabulary.</p>
              ) : Array.from({ length: s.lines }, (_, i) => <div key={i} className="h-6 border-b border-ink-muted" />)}
            </div>
          )}
        </section>
      ))}
    </article>
  );
}
