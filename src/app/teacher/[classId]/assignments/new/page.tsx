import Link from 'next/link';
import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { allQuizzes, allTests, allWorksheets } from '@/lib/content/catalog';
import { READINGS } from '@/lib/content/readings';
import { LEVELS } from '@/lib/content/levels';
import { PageHeader } from '@/components/lms/ui';
import { AssignmentForm } from './assignment-form';

export default async function NewAssignment({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacherId = await requireTeacher();
  const klass = await requireOwnedClass(teacherId, classId);
  const options = {
    quiz: allQuizzes().map((q) => ({ id: q.id, title: q.title, level: q.level, group: q.category })),
    test: allTests().map((q) => ({ id: q.id, title: q.title, level: q.level, group: 'Tests' })),
    reading: READINGS.map((r) => ({ id: r.id, title: r.title, level: r.level, group: r.genre })),
    worksheet: allWorksheets().map((w) => ({ id: w.id, title: w.title, level: w.level, group: w.category })),
  };
  return (
    <div className="px-5 py-6 sm:px-8">
      <Link href={`/teacher/${classId}/assignments`} className="text-sm">← Assignments</Link>
      <div className="mt-3"><PageHeader title="New assignment" sub={`For everyone in ${klass.name}.`} /></div>
      <div className="mt-6">
        <AssignmentForm classId={classId} courseLevel={klass.course_slug}
          levels={LEVELS.map((l) => ({ id: l.id, name: l.name }))} options={options} />
      </div>
    </div>
  );
}
