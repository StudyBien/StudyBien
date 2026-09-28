import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { listRoster } from '@/lib/classroom/teacher';
import { PageHeader, Empty } from '@/components/lms/ui';
import { AddStudentForm } from '../add-student-form';
import { setPinAction } from '../../actions';
import { removeStudentAction } from '../../workspace-actions';

export default async function People({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacherId = await requireTeacher();
  const klass = await requireOwnedClass(teacherId, classId);
  const roster = await listRoster(classId, teacherId);
  const path = `/teacher/${classId}/people`;

  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="People" sub={<>{roster.length} student{roster.length === 1 ? '' : 's'} · join code <strong className="font-mono tracking-[0.2em]">{klass.class_code}</strong></>} />

      <div className="mt-6 rounded-[var(--radius-md)] bg-primary-tint p-4 text-sm">
        <strong>Two ways to add students.</strong> Share the join code: students choose <em>Join classroom as a student</em>,
        type the code, and add themselves with their name and a PIN they choose. Or add them yourself below.
      </div>

      <div className="mt-6 overflow-x-auto">
        {roster.length === 0 ? <Empty>No students yet.</Empty> : (
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-rule text-sm text-ink-muted">
              <tr><th className="py-2">Name</th><th>Role</th><th>PIN</th><th /></tr>
            </thead>
            <tbody>
              {roster.map((r) => (
                <tr key={r.id} className="border-b border-rule">
                  <td className="py-3 font-bold">{r.first_name}{r.last_initial ? ` ${r.last_initial}.` : ''}</td>
                  <td>Student</td>
                  <td>
                    <form action={setPinAction} className="flex items-center gap-2">
                      <input type="hidden" name="rosterEntryId" value={r.id} />
                      <input type="hidden" name="path" value={path} />
                      <span className="text-sm text-ink-muted">{r.has_pin ? 'set' : 'none'}</span>
                      <input name="pin" inputMode="numeric" pattern="[0-9]{4,6}" maxLength={6} placeholder="new PIN"
                             className="w-24 rounded border border-rule px-2 py-1 text-sm" />
                      <button className="text-sm font-bold text-primary">Reset</button>
                    </form>
                  </td>
                  <td className="text-right">
                    <form action={removeStudentAction}>
                      <input type="hidden" name="classId" value={classId} />
                      <input type="hidden" name="rosterEntryId" value={r.id} />
                      <button className="text-sm text-ink-muted hover:text-tangerine">Remove</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Add a student</h2>
        <AddStudentForm classId={classId} />
      </section>
    </div>
  );
}
