'use client';

import { useActionState } from 'react';
import { createCourseAction } from './workspace-actions';
import { LEVELS } from '@/lib/content/levels';
import { inputCls, labelCls } from '@/components/lms/ui';

export function NewCourseForm({ compact = false }: { compact?: boolean }) {
  const [error, action, pending] = useActionState(createCourseAction, null);
  return (
    <form action={action} className={compact ? 'space-y-3' : 'grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end'}>
      <label className={labelCls}>
        Course name
        <input name="name" required maxLength={120} placeholder="Period 3 · Spanish 2" className={inputCls} />
      </label>
      <label className={labelCls}>
        Level
        <select name="level" defaultValue="spanish-1" className={inputCls}>
          {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </label>
      <button disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
        {pending ? 'Creating…' : '+ Create course'}
      </button>
      {error && <p className="text-sm text-tangerine-ink sm:col-span-3">{error}</p>}
    </form>
  );
}
