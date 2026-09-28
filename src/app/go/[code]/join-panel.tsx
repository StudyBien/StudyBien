'use client';

import { useActionState, useState } from 'react';
import { pickNameAction, selfJoinAction } from '../actions';

type Entry = { id: string; display_name: string; has_pin: boolean };
const field = 'mt-1 w-full rounded-lg border border-rule px-3 py-2.5 focus:border-primary focus:outline-none';

export function JoinPanel({ code, roster }: { code: string; roster: Entry[] }) {
  const [mode, setMode] = useState<'new' | 'back'>(roster.length ? 'back' : 'new');
  return (
    <>
      <div role="tablist" className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-paper-sunk p-1">
        <button role="tab" aria-selected={mode === 'new'} onClick={() => setMode('new')}
                className={`rounded-md py-2 font-bold ${mode === 'new' ? 'bg-paper shadow-sm' : 'text-ink-soft'}`}>I’m new here</button>
        <button role="tab" aria-selected={mode === 'back'} onClick={() => setMode('back')}
                className={`rounded-md py-2 font-bold ${mode === 'back' ? 'bg-paper shadow-sm' : 'text-ink-soft'}`}>I’ve joined before</button>
      </div>
      {mode === 'new' ? <NewStudent code={code} /> : <Returning code={code} roster={roster} />}
    </>
  );
}

function NewStudent({ code }: { code: string }) {
  const [error, action, pending] = useActionState(selfJoinAction, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="code" value={code} />
      <div className="grid grid-cols-[1fr_110px] gap-3">
        <label className="text-sm font-bold">First name<input name="firstName" required maxLength={40} autoComplete="given-name" className={field} /></label>
        <label className="text-sm font-bold">Last initial<input name="lastInitial" maxLength={1} className={field} /></label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">Make a PIN<input name="pin" type="password" inputMode="numeric" pattern="[0-9]{4,6}" required maxLength={6} className={field} /></label>
        <label className="text-sm font-bold">Type it again<input name="pin2" type="password" inputMode="numeric" pattern="[0-9]{4,6}" required maxLength={6} className={field} /></label>
      </div>
      <p className="text-xs text-ink-muted">Your PIN is 4 to 6 numbers. You’ll use it with your name to get back in, so remember it! Only your first name and last initial are saved.</p>
      {error && <p className="rounded-lg bg-tangerine-fill p-3 text-sm text-tangerine-ink">{error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
        {pending ? 'Joining…' : 'Join the class'}
      </button>
    </form>
  );
}

function Returning({ code, roster }: { code: string; roster: Entry[] }) {
  const [error, action, pending] = useActionState(pickNameAction, null);
  const [selected, setSelected] = useState<Entry | null>(null);

  if (roster.length === 0) return <p className="mt-6 text-ink-muted">Nobody has joined yet. Choose “I’m new here”.</p>;
  if (selected) {
    return (
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="code" value={code} />
        <input type="hidden" name="rosterEntryId" value={selected.id} />
        <p className="text-lg">Hola, <strong>{selected.display_name}</strong> 👋</p>
        {selected.has_pin && (
          <label className="block text-sm font-bold">Your PIN
            <input name="pin" type="password" inputMode="numeric" autoFocus required maxLength={6}
                   className="mt-1 w-full rounded-lg border-2 border-rule px-4 py-3 text-center font-mono text-2xl tracking-[0.3em] focus:border-primary focus:outline-none" />
          </label>
        )}
        {error && <p className="rounded-lg bg-tangerine-fill p-3 text-sm text-tangerine-ink">{error}</p>}
        <button disabled={pending} className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
          {pending ? 'Checking…' : 'Enter'}
        </button>
        <button type="button" onClick={() => setSelected(null)} className="w-full text-sm text-ink-muted underline">Not me</button>
      </form>
    );
  }
  return (
    <>
      <p className="mt-6 text-ink-soft">Find your name:</p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {roster.map((r) => (
          <li key={r.id}>
            <button onClick={() => setSelected(r)} className="w-full rounded-lg border border-rule px-3 py-3 text-left font-bold hover:border-primary hover:bg-primary-tint">
              {r.display_name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
