import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requireStudentClass } from '@/lib/auth/student';
import {
  getCourseAssignment, studentSubmission, assignmentQuiz, assignmentWorksheet,
} from '@/lib/classroom/workspace';
import { publicQuestions } from '@/lib/content/catalog';
import { readingById } from '@/lib/content/readings';
import { query } from '@/lib/db/client';
import { PageHeader, KIND_LABEL } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';
import { QuizPlayer } from '@/components/quiz-player';
import { ReadingPassage } from '@/components/reading-passage';
import { submitWorkAction } from '../../../actions';
import { WrittenWork } from './written-work';

type Props = { params: Promise<{ classId: string; aid: string }>; searchParams: Promise<{ kind?: string }> };

export default async function StudentAssignment({ params, searchParams }: Props) {
  const { classId, aid } = await params;
  const me = await requireStudentClass(classId);

  if ((await searchParams).kind === 'practice') {
    const own = await query(`SELECT 1 FROM assignment_target WHERE id = $1 AND roster_entry_id = $2`, [aid, me.rosterEntryId]);
    if (!own.length) notFound();
    redirect(`/go/${me.classCode}/work/${aid}`);
  }

  const a = await getCourseAssignment(aid, classId);
  if (!a) notFound();
  const sub = await studentSubmission(a.id, me.rosterEntryId);
  const quiz = assignmentQuiz(a);
  const ws = assignmentWorksheet(a);
  const reading = quiz?.readingId ? readingById(quiz.readingId) : ws?.readingId ? readingById(ws.readingId) : undefined;
  const submit = submitWorkAction.bind(null, classId, a.id);

  return (
    <div className="px-5 py-6 sm:px-8">
      <Link href={`/student/${classId}/assignments`} className="text-sm">← Assignments</Link>
      <div className="mt-3">
        <PageHeader title={a.title}
          sub={<>{KIND_LABEL[a.resource_kind]} · {Number(a.points)} pts · {a.due_at ? <>Due <LocalTime iso={a.due_at} /></> : 'No due date'}</>} />
      </div>
      {a.instructions && <p className="mt-4 max-w-3xl whitespace-pre-line rounded-[var(--radius-md)] bg-primary-tint/60 p-4">{a.instructions}</p>}

      {sub ? (
        <section className="mt-6 max-w-3xl space-y-4">
          <div className={`rounded-[var(--radius-lg)] p-5 ${sub.score === null ? 'bg-marigold-fill/60' : 'bg-teal/15'}`}>
            <p className="text-sm">Submitted <LocalTime iso={sub.submitted_at} /></p>
            <p className="mt-1 text-2xl font-bold">
              {sub.score === null ? 'Waiting for your teacher to grade' : `${Number(sub.score)} / ${Number(a.points)}`}
            </p>
            {sub.auto_max !== null && <p className="text-sm">Multiple choice: {Number(sub.auto_score)} / {Number(sub.auto_max)} correct</p>}
            {sub.teacher_feedback && <p className="mt-3 rounded-lg bg-paper p-3"><strong>Feedback:</strong> {sub.teacher_feedback}</p>}
          </div>
          {quiz && (
            <details className="rounded-[var(--radius-md)] border border-rule p-4">
              <summary className="cursor-pointer font-bold">Review my answers</summary>
              <ol className="mt-3 space-y-2">
                {quiz.questions.map((q, i) => {
                  const given = sub.answers[q.id];
                  const ok = given !== undefined && Number(given) === q.answer;
                  return (
                    <li key={q.id} className={ok ? 'text-teal-ink' : 'text-tangerine-ink'}>
                      {ok ? '✓' : '✗'} {i + 1}. {q.prompt} — <strong>{given === undefined ? 'no answer' : q.choices[Number(given)]}</strong>
                      {!ok && <span className="text-ink-soft"> · correct: {q.choices[q.answer]}{q.why ? ` (${q.why})` : ''}</span>}
                    </li>
                  );
                })}
              </ol>
            </details>
          )}
          {sub.written_response && (
            <div>
              <p className="font-bold">Your writing</p>
              <p className="mt-1 whitespace-pre-line rounded-lg bg-paper-sunk/50 p-3 font-serif">{sub.written_response}</p>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-6">
          {reading && <div className="mb-8"><ReadingPassage reading={reading} /></div>}
          {quiz ? (
            <QuizPlayer questions={publicQuestions(quiz)} writing={quiz.writing} submit={submit} submitLabel="Turn it in" />
          ) : (
            <WrittenWork ws={ws} submit={submit} />
          )}
        </div>
      )}
    </div>
  );
}
