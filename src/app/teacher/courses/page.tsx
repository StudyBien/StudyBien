import Link from 'next/link';
import { requireTeacher } from '@/lib/auth/require';
import { listClasses } from '@/lib/classroom/teacher';
import { courseColor, PageHeader, Empty } from '@/components/lms/ui';
import { NewCourseForm } from '../new-course-form';

export default async function Courses() {
  const teacherId = await requireTeacher();
  const classes = await listClasses(teacherId);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="All Courses" sub="Every course you teach, with its join code." />
      <div className="mt-6 overflow-x-auto">
        {classes.length === 0 ? <Empty>No courses yet. Create one below.</Empty> : (
          <table className="w-full min-w-[560px] text-left">
            <thead className="border-b border-rule text-sm text-ink-muted">
              <tr><th className="py-2 pr-3">Course</th><th className="pr-3">Level</th><th className="pr-3">Join code</th><th>Students</th></tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b border-rule">
                  <td className="py-3 pr-3">
                    <span className="mr-2 inline-block h-3 w-3 rounded-full align-middle" style={{ background: courseColor(c.id) }} />
                    <Link href={`/teacher/${c.id}`} className="font-bold">{c.name}</Link>
                  </td>
                  <td className="pr-3">{c.course_name}</td>
                  <td className="pr-3 font-mono tracking-[0.15em]">{c.class_code}</td>
                  <td>{c.student_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <section className="mt-10 rounded-[var(--radius-lg)] border border-rule p-5">
        <h2 className="text-lg font-bold">Create a course</h2>
        <div className="mt-4"><NewCourseForm /></div>
      </section>
    </div>
  );
}
