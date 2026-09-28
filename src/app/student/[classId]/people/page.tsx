import { requireStudentClass } from '@/lib/auth/student';
import { classPeople } from '@/lib/classroom/workspace';
import { PageHeader } from '@/components/lms/ui';

export default async function StudentPeople({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  await requireStudentClass(classId);
  const p = await classPeople(classId);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="People" />
      <ul className="mt-6 max-w-xl divide-y divide-rule rounded-[var(--radius-md)] border border-rule">
        <li className="flex justify-between px-4 py-3"><strong>{p.teacher ?? 'Your teacher'}</strong><span className="text-sm text-ink-muted">Teacher</span></li>
        {p.students.map((s, i) => <li key={i} className="flex justify-between px-4 py-3"><span>{s}</span><span className="text-sm text-ink-muted">Student</span></li>)}
      </ul>
    </div>
  );
}
