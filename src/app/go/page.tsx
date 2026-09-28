'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { enterCodeAction } from './actions';
import { StudyBienLogo } from '@/components/logo';

export default function GoPage() {
  const [error, action, pending] = useActionState(enterCodeAction, null);
  return (
    <div className="min-h-screen bg-paper-sunk/50">
      <header className="px-6 py-4"><Link href="/" className="text-ink no-underline"><StudyBienLogo height={26} /></Link></header>
      <main className="mx-auto max-w-md px-6 pb-16 pt-8">
        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper p-8 text-center shadow-sm">
          <p className="text-4xl" aria-hidden>👋</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Join your classroom</h1>
          <p className="mt-1 text-ink-soft">Type the code your teacher gave you.</p>
          <form action={action} className="mt-6">
            <input name="code" required autoFocus autoComplete="off" autoCapitalize="characters" placeholder="ABC123"
                   aria-label="Class code"
                   className="w-full rounded-lg border-2 border-rule px-4 py-4 text-center font-mono text-3xl uppercase tracking-[0.3em] focus:border-primary focus:outline-none" />
            {error && <p className="mt-3 text-sm text-tangerine-ink">{error}</p>}
            <button disabled={pending} className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
              {pending ? 'Checking…' : 'Continue'}
            </button>
          </form>
          <p className="mt-6 text-sm text-ink-muted">No email or password needed.</p>
        </div>
        <p className="mt-6 text-center text-sm">Already joined on this device? <Link href="/student" className="font-bold">Go to my dashboard →</Link></p>
      </main>
    </div>
  );
}
