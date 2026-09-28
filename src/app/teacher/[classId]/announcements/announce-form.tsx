'use client';

import { useActionState, useRef } from 'react';
import { postAnnouncementAction } from '../../workspace-actions';
import { inputCls, labelCls } from '@/components/lms/ui';

export function AnnounceForm({ classId }: { classId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [error, action, pending] = useActionState(async (prev: string | null, form: FormData) => {
    const r = await postAnnouncementAction(prev, form);
    if (!r) ref.current?.reset();
    return r;
  }, null);
  return (
    <form ref={ref} action={action} className="space-y-3 rounded-[var(--radius-md)] border border-rule p-4">
      <input type="hidden" name="classId" value={classId} />
      <label className={labelCls}>Title<input name="title" required maxLength={200} className={inputCls} placeholder="Examen el viernes" /></label>
      <label className={labelCls}>Message<textarea name="body" required rows={4} maxLength={5000} className={inputCls} placeholder="Recuerden estudiar el vocabulario de la unidad 3…" /></label>
      {error && <p className="text-sm text-tangerine-ink">{error}</p>}
      <button disabled={pending} className="rounded-lg bg-primary px-4 py-2 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
        {pending ? 'Posting…' : 'Post announcement'}
      </button>
    </form>
  );
}
