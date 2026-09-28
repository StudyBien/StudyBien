import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import {
  getCourseAssignment, listSubmissions, assignmentQuiz, assignmentWorksheet, assignmentHasWriting,
} from '@/lib/classroom/workspace';
import { query } from '@/lib/db/client';
import { PageHeader, KIND_LABEL, inputCls } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';
import { gradeAction, deleteCourseAssignmentAction } from '../../../workspace-actions';

type Props = { params: Promise<{ classId: string; aid: string }>; searchParams: Promise<{ kind?: string }> };

const PREVIEW: Record<string, (id: string) => string> = {
  quiz: (id) => `/resources/quizzes/${id}`,
  test: (id) => `/resources/tests/${id}`,
  reading: (id) => `/resources/reading/${id}`,
  worksheet: (id) => `/resources/worksheets/${id}?tab=key`,
};

export default async function AssignmentDetail({ params, searchParams }: Props) {
  const { classId, aid } = await params;
  const teacherId = await requireTeacher();
  await requireOwnedClass(teacherId, classId);
  if ((await searchParams).kind === 'practice') return <PracticeDetail classId={classId} aid={aid} />;

  const a = await getCourseAssignment(aid, classId);
  if (!a) notFound();
  const [subs, roster] = await Promise.all([
    listSubmissions(a.id),
    query<{ id: string; name: string }>(
      `SELECT r.id, r.first_name || COALESCE(' ' || r.last_initial || '.', '') AS name
         FROM roster_entry r JOIN enrollment e ON e.roster_entry_id = r.id
        WHERE e.class_id = $1 AND e.removed_at IS NULL AND r.deleted_at IS NULL ORDER BY r.first_name`, [classId]),
  ]);
  const quiz = assignmentQuiz(a);
  const ws = assignmentWorksheet(a);
  const bySt = new Map(subs.map((s) => [s.roster_entry_id, s]));
  const missing = roster.filter((r) => !bySt.has(r.id));
  const path = `/teacher/${classId}/assignments/${a.id}`;

  return (
    <div className="px-5 py-6 sm:px-8">
      <Link href={`/teacher/${classId}/assignments`} className="text-sm">← Assignments</Link>
      <div className="mt-3">
        <PageHeader title={a.title}
          sub={<>{KIND_LABEL[a.resource_kind]} · {Number(a.points)} pts · {a.due_at ? <>Due <LocalTime iso={a.due_at} /></> : 'No due date'}</>}
          action={a.resource_id ? <Link href={PREVIEW[a.resource_kind](a.resource_id)} className="font-bold">Preview{a.resource_kind === 'worksheet' ? ' with answer key' : ''} →</Link> : undefined} />
      </div>
      {a.instructions && <p className="mt-4 max-w-3xl whitespace-pre-line rounded-[var(--radius-md)] bg-paper-sunk/50 p-4">{a.instructions}</p>}

      <p className="mt-6 text-ink-soft">
        <strong>{subs.length}</strong> of {roster.length} submitted · <strong>{subs.filter((s) => s.score === null).length}</strong> waiting for a grade
      </p>

      <ul className="mt-4 space-y-4">
        {subs.map((s) => (
          <li key={s.id} className="rounded-[var(--radius-md)] border border-rule">
            <details open={s.score === null}>
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4">
                <span className="font-bold">{s.student_name}</span>
                <span className="text-sm text-ink-muted">submitted <LocalTime iso={s.submitted_at} /></span>
                {s.auto_max !== null && <span className="text-sm">auto: {Number(s.auto_score)}/{Number(s.auto_max)}</span>}
                <span className={`ml-auto rounded-full px-3 py-0.5 text-sm font-bold ${s.score === null ? 'bg-marigold-fill text-marigold-ink' : 'bg-teal/20 text-teal-ink'}`}>
                  {s.score === null ? 'Needs grading' : `${Number(s.score)} / ${Number(a.points)}`}
                </span>
              </summary>
              <div className="border-t border-rule p-4">
                {quiz && (
                  <details>
                    <summary className="cursor-pointer text-sm font-bold text-primary">Multiple-choice answers</summary>
                    <ol className="mt-2 space-y-1 text-sm">
                      {quiz.questions.map((q, i) => {
                        const given = s.answers[q.id];
                        const ok = given !== undefined && Number(given) === q.answer;
                        return (
                          <li key={q.id} className={ok ? 'text-teal-ink' : 'text-tangerine-ink'}>
                            {ok ? '✓' : '✗'} {i + 1}. {q.prompt} — <strong>{given === undefined ? 'no answer' : q.choices[Number(given)]}</strong>
                            {!ok && <> (correct: {q.choices[q.answer]})</>}
                          </li>
                        );
                      })}
                    </ol>
                  </details>
                )}
                {ws && (
                  <table className="mt-2 w-full text-sm">
                    <thead className="text-left text-ink-muted"><tr><th className="py-1">Item</th><th>Student</th><th>Key</th></tr></thead>
                    <tbody>
                      {ws.sections.flatMap((sec, si) => sec.items.map((it, ii) => {
                        const given = s.answers[`${si}-${ii}`] ?? '';
                        const ok = given.trim().toLowerCase() === it.answer.trim().toLowerCase();
                        return (
                          <tr key={`${si}-${ii}`} className="border-t border-rule">
                            <td className="py-1 pr-2">{it.prompt}</td>
                            <td className={`pr-2 font-bold ${ok ? 'text-teal-ink' : 'text-tangerine-ink'}`}>{given || '—'}</td>
                            <td>{it.answer}</td>
                          </tr>
                        );
                      }))}
                    </tbody>
                  </table>
                )}
                {s.written_response && (
                  <div className="mt-3">
                    <p className="text-sm font-bold">Written response ({s.written_response.trim().split(/\s+/).length} words)</p>
                    <p className="mt-1 whitespace-pre-line rounded-lg bg-paper-sunk/50 p-3 font-serif leading-relaxed">{s.written_response}</p>
                  </div>
                )}
                <form action={gradeAction} className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-end">
                  <input type="hidden" name="submissionId" value={s.id} />
                  <input type="hidden" name="path" value={path} />
                  <label className="text-sm font-bold">Score / {Number(a.points)}
                    <input name="score" type="number" step="0.5" min={0} max={Number(a.points)} required
                           defaultValue={s.score ?? (s.auto_max && Number(s.auto_max) > 0 ? Math.round(Number(a.points) * Number(s.auto_score) / Number(s.auto_max)) : '')}
                           className={inputCls} />
                  </label>
                  <label className="text-sm font-bold">Feedback (optional)
                    <input name="feedback" defaultValue={s.teacher_feedback ?? ''} className={inputCls} placeholder="¡Muy bien! Revisa los acentos." />
                  </label>
                  <button className="rounded-lg bg-primary px-4 py-2 font-bold text-paper hover:bg-primary-hover">
                    {s.score === null ? 'Save grade' : 'Update'}
                  </button>
                </form>
                {assignmentHasWriting(a) && s.auto_max !== null && s.score === null && (
                  <p className="mt-2 text-xs text-ink-muted">The suggested score is the multiple-choice share; adjust it after reading the writing.</p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>

      {missing.length > 0 && (
        <section className="mt-8">
          <h2 className="font-bold">Not submitted yet</h2>
          <p className="mt-1 text-ink-soft">{missing.map((m) => m.name).join(', ')}</p>
        </section>
      )}

      <form action={deleteCourseAssignmentAction} className="mt-12 border-t border-rule pt-4">
        <input type="hidden" name="id" value={a.id} />
        <input type="hidden" name="classId" value={classId} />
        <button className="text-sm text-ink-muted hover:text-tangerine">Delete this assignment and its submissions</button>
      </form>
    </div>
  );
}

async function PracticeDetail({ classId, aid }: { classId: string; aid: string }) {
  const rows = await query<{ name: string; submitted_at: string | null; score: string | null; max_score: string | null }>(
    `SELECT r.first_name || COALESCE(' ' || r.last_initial || '.', '') AS name, t.submitted_at, t.score::text, t.max_score::text
       FROM assignment_target t JOIN assignment a ON a.id = t.assignment_id JOIN roster_entry r ON r.id = t.roster_entry_id
      WHERE a.id = $1 AND a.class_id = $2 ORDER BY r.first_name`, [aid, classId]);
  const head = await query<{ title: string; due_at: string | null }>(`SELECT title, due_at FROM assignment WHERE id = $1 AND class_id = $2`, [aid, classId]);
  if (!head[0]) notFound();
  return (
    <div className="px-5 py-6 sm:px-8">
      <Link href={`/teacher/${classId}/assignments`} className="text-sm">← Assignments</Link>
      <div className="mt-3"><PageHeader title={head[0].title} sub={<>Generated practice · {head[0].due_at ? <>Due <LocalTime iso={head[0].due_at} /></> : 'No due date'}</>} /></div>
      <table className="mt-6 w-full max-w-2xl text-left">
        <thead className="border-b border-rule text-sm text-ink-muted"><tr><th className="py-2">Student</th><th>Status</th><th>Score</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-rule">
              <td className="py-2 font-bold">{r.name}</td>
              <td>{r.submitted_at ? <>Submitted <LocalTime iso={r.submitted_at} mode="date" /></> : 'Not yet'}</td>
              <td>{r.submitted_at && r.max_score ? `${Number(r.score)}/${Number(r.max_score)}` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-ink-muted">Practice is auto-graded and feeds the Mastery grid.</p>
    </div>
  );
}
