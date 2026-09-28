import Link from 'next/link';
import { requireStudentClass } from '@/lib/auth/student';
import { studentAssignments } from '@/lib/classroom/workspace';
import { PageHeader, Empty } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function StudentGrades({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const me = await requireStudentClass(classId);
  const work = await studentAssignments(classId, me.rosterEntryId);
  const graded = work.filter((w) => w.graded && w.score !== null);
  const earned = graded.reduce((s, w) => s + (w.score ?? 0), 0);
  const possible = graded.reduce((s, w) => s + w.points, 0);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title={`Grades for ${me.name}`}
        action={possible > 0 ? <p className="text-2xl font-bold">Total: {Math.round(100 * earned / possible)}%</p> : undefined} />
      <div className="mt-6 overflow-x-auto">
        {work.length === 0 ? <Empty>No assignments yet.</Empty> : (
          <table className="w-full min-w-[560px] text-left">
            <thead className="border-b border-rule text-sm text-ink-muted"><tr><th className="py-2">Name</th><th>Due</th><th>Status</th><th className="text-right">Score</th></tr></thead>
            <tbody>
              {work.map((w) => (
                <tr key={w.id} className="border-b border-rule">
                  <td className="py-3"><Link href={`/student/${classId}/assignments/${w.id}${w.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">{w.title}</Link></td>
                  <td className="text-sm">{w.due_at ? <LocalTime iso={w.due_at} mode="date" /> : '—'}</td>
                  <td className="text-sm">{!w.submitted ? 'Not submitted' : !w.graded ? 'Waiting for grade' : 'Graded'}</td>
                  <td className="text-right font-bold tabular-nums">{w.score !== null ? `${w.score}${w.kind === 'practice' ? '%' : ` / ${w.points}`}` : `– / ${w.points}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
