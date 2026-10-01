'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { signIn, signUp } from './actions';
import { StudyBienLogo } from '@/components/logo';

export function LoginForm({ next, startInSignUp }: { next: string | null; startInSignUp: boolean }) {
  const [mode, setMode] = useState<'in' | 'up'>(startInSignUp ? 'up' : 'in');
  const action = mode === 'in' ? signIn : signUp;
  const [error, formAction, pending] = useActionState(action, null);

  const field = 'mt-1 w-full rounded-lg border border-rule px-3 py-2.5 focus:border-primary focus:outline-none';

  return (
    <div className="min-h-screen bg-[#B8E2F2]">
      <header className="px-6 py-4">
        <Link href="/" className="text-ink no-underline"><StudyBienLogo height={26} /></Link>
      </header>
      <main className="mx-auto max-w-md px-6 pb-16 pt-6">
        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper p-7 shadow-sm">
          <div role="tablist" className="grid grid-cols-2 gap-1 rounded-lg bg-paper-sunk p-1">
            {(['up', 'in'] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                      className={`rounded-md py-2 font-bold ${mode === m ? 'bg-paper shadow-sm' : 'text-ink-soft'}`}>
                {m === 'up' ? 'Sign up' : 'Sign in'}
              </button>
            ))}
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            {mode === 'up' ? 'Create your teacher account' : '¡Hola de nuevo!'}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {next
              ? 'Answer keys are free. They just need a teacher account.'
              : mode === 'up' ? 'Free forever. Make your first classroom in under a minute.' : 'Sign in to your dashboard.'}
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            {next && <input type="hidden" name="next" value={next} />}
            {mode === 'up' && (
              <label className="block">
                <span className="text-sm font-bold">Your name</span>
                <input name="name" autoComplete="name" placeholder="Sra. García" className={field} />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-bold">Email</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Password</span>
              <input name="password" type="password" required minLength={10}
                     autoComplete={mode === 'in' ? 'current-password' : 'new-password'} className={field} />
              {mode === 'up' && <span className="mt-1 block text-xs text-ink-muted">At least 10 characters.</span>}
            </label>

            {error && <p className="rounded-lg bg-tangerine-fill px-3 py-2 text-sm text-tangerine-ink">{error}</p>}

            <button disabled={pending}
                    className="w-full rounded-lg bg-primary px-3 py-3 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
              {pending ? 'Working…' : mode === 'in' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-[var(--radius-lg)] border border-rule bg-paper p-5 text-center">
          <p className="font-bold">Are you a student?</p>
          <p className="mt-1 text-sm text-ink-soft">You don’t need an email. Join with the code from your teacher.</p>
          <Link href="/go" className="mt-3 inline-block font-bold">Join classroom as a student →</Link>
        </div>
      </main>
    </div>
  );
}
