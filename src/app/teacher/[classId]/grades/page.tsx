import Link from 'next/link';
import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { gradebook, studentTotal } from '@/lib/classroom/workspace';
import { PageHeader, Empty } from '@/components/lms/ui';

export default async function Grades({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacherId = await requireTeacher();
  await requireOwnedClass(teacherId, classId);
  const g = await gradebook(classId);

  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="Grades" sub="Scores by student and assignment. Practice columns show percent." />
      {g.students.length === 0 || g.columns.length === 0 ? (
        <div className="mt-6"><Empty>The gradebook fills in once you have students and assignments.</Empty></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[var(--radius-md)] border border-rule">
          <table className="min-w-full text-sm">
            <thead className="bg-paper-sunk/60">
              <tr>
                <th className="sticky left-0 z-10 bg-paper-sunk px-3 py-2 text-left">Student</th>
                {g.columns.map((c) => (
                  <th key={c.id} className="min-w-[120px] border-l border-rule px-3 py-2 text-left align-bottom font-bold">
                    <Link href={`/teacher/${classId}/assignments/${c.id}${c.kind === 'practice' ? '?kind=practice' : ''}`} className="line-clamp-2">{c.title}</Link>
                    <span className="block text-xs font-normal text-ink-muted">{c.kind === 'practice' ? 'out of 100%' : `out of ${c.points}`}</span>
                  </th>
                ))}
                <th className="border-l border-rule px-3 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {g.students.map((s) => {
                const t = studentTotal(g, s.id);
                return (
                  <tr key={s.id} className="border-t border-rule">
                    <td className="sticky left-0 bg-paper px-3 py-2 font-bold">{s.name}</td>
                    {g.columns.map((c) => {
                      const cell = g.cells.get(`${s.id}:${c.id}`);
                      return (
                        <td key={c.id} className="border-l border-rule px-3 py-2 tabular-nums">
                          {!cell ? <span className="text-ink-muted">–</span>
                            : cell.score === null ? <span className="rounded bg-marigold-fill px-1.5 text-marigold-ink" title="Submitted, needs grading">✎</span>
                            : cell.score}
                        </td>
                      );
                    })}
                    <td className="border-l border-rule px-3 py-2 font-bold tabular-nums">
                      {t.possible > 0 ? `${Math.round(100 * t.earned / t.possible)}%` : '–'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-sm text-ink-muted">– not submitted · ✎ submitted, waiting for your grade · Total counts graded work only.</p>
    </div>
  );
}
