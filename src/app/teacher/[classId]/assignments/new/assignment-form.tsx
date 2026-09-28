'use client';

import { useActionState, useMemo, useState } from 'react';
import { createCourseAssignmentAction } from '../../../workspace-actions';
import { inputCls, labelCls } from '@/components/lms/ui';

export type Option = { id: string; title: string; level: string; group: string };
type Kind = 'quiz' | 'test' | 'reading' | 'worksheet' | 'task';

const KINDS: Array<{ id: Kind; label: string; hint: string }> = [
  { id: 'quiz', label: 'Quiz', hint: 'Auto-graded' },
  { id: 'test', label: 'Test', hint: 'Auto-graded + writing' },
  { id: 'reading', label: 'Reading', hint: 'Questions + writing' },
  { id: 'worksheet', label: 'Worksheet', hint: 'Students type answers' },
  { id: 'task', label: 'Written task', hint: 'Your own prompt' },
];

export function AssignmentForm({ classId, courseLevel, levels, options }: {
  classId: string; courseLevel: string; levels: Array<{ id: string; name: string }>;
  options: Record<Exclude<Kind, 'task'>, Option[]>;
}) {
  const [error, action, pending] = useActionState(createCourseAssignmentAction, null);
  const [kind, setKind] = useState<Kind>('quiz');
  const [level, setLevel] = useState(courseLevel);
  const [resourceId, setResourceId] = useState('');
  const [title, setTitle] = useState('');
  const [dueLocal, setDueLocal] = useState('');

  const list = useMemo(() => (kind === 'task' ? [] : options[kind].filter((o) => o.level === level)), [kind, level, options]);
  const groups = [...new Set(list.map((o) => o.group))];
  const dueIso = dueLocal ? new Date(dueLocal).toISOString() : '';

  return (
    <form action={action} className="max-w-3xl space-y-6">
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="dueAt" value={dueIso} />

      <fieldset>
        <legend className={labelCls}>What are you assigning?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-5">
          {KINDS.map((k) => (
            <button type="button" key={k.id} onClick={() => { setKind(k.id); setResourceId(''); }}
                    className={`rounded-lg border p-3 text-left ${kind === k.id ? 'border-primary bg-primary-tint' : 'border-rule hover:border-primary'}`}>
              <span className="block font-bold">{k.label}</span>
              <span className="text-xs text-ink-muted">{k.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {kind !== 'task' && (
        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <label className={labelCls}>Level
            <select value={level} onChange={(e) => { setLevel(e.target.value); setResourceId(''); }} className={inputCls}>
              {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </label>
          <label className={labelCls}>From the library
            <select name="resourceId" required value={resourceId}
                    onChange={(e) => { setResourceId(e.target.value); const o = list.find((x) => x.id === e.target.value); if (o && !title) setTitle(o.title); }}
                    className={inputCls}>
              <option value="">Choose one…</option>
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {list.filter((o) => o.group === g).map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
        </div>
      )}

      <label className={labelCls}>Title
        <input name="title" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls}
               placeholder={kind === 'task' ? 'Composición: Mi ciudad ideal' : 'Defaults to the resource title'} />
      </label>

      <label className={labelCls}>{kind === 'task' ? 'Prompt / instructions for students' : 'Instructions (optional)'}
        <textarea name="instructions" rows={4} maxLength={5000} required={kind === 'task'} className={inputCls}
                  placeholder={kind === 'task' ? 'Escribe 150 palabras sobre…' : 'Anything students should know before they start.'} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>Points
          <input name="points" type="number" min={1} max={1000} defaultValue={100} className={inputCls} />
        </label>
        <label className={labelCls}>Due
          <input type="datetime-local" value={dueLocal} onChange={(e) => setDueLocal(e.target.value)} className={inputCls} />
        </label>
      </div>

      <p className="text-sm text-ink-muted">
        {kind === 'quiz' && 'Quizzes grade themselves the moment a student submits.'}
        {kind === 'test' && 'Multiple-choice sections grade themselves; you grade the writing before the score is final.'}
        {kind === 'reading' && 'Comprehension questions grade themselves; you grade the writing before the score is final.'}
        {kind === 'worksheet' && 'Students see the worksheet and type their answers; you grade it with the answer key beside it.'}
        {kind === 'task' && 'Students write a response; you grade it.'}
      </p>

      {error && <p className="rounded-lg bg-tangerine-fill p-3 text-tangerine-ink">{error}</p>}
      <button disabled={pending} className="rounded-lg bg-primary px-6 py-3 font-bold text-paper hover:bg-primary-hover disabled:opacity-60">
        {pending ? 'Assigning…' : 'Assign to the whole course'}
      </button>
    </form>
  );
}
