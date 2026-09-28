import { requireStudent } from '@/lib/auth/student';
import { datedItems } from '@/lib/classroom/workspace';
import { PageHeader } from '@/components/lms/ui';
import { MonthCalendar } from '@/components/lms/month-calendar';
import { parseMonth } from '@/components/lms/parse-month';
import { query } from '@/lib/db/client';

export default async function StudentCalendar({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const classes = await requireStudent();
  const { year, month } = parseMonth((await searchParams).month);
  const items = await datedItems({ classIds: classes.map((c) => c.classId) },
    new Date(Date.UTC(year, month - 1, 20)), new Date(Date.UTC(year, month + 1, 12)));
  // practice items link by this student's own target
  const targets = new Map((await query<{ assignment_id: string; id: string }>(
    `SELECT assignment_id, id FROM assignment_target WHERE roster_entry_id = ANY($1::uuid[])`,
    [classes.map((c) => c.rosterEntryId)])).map((t) => [t.assignment_id, t.id]));
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="Calendar" sub="Due dates for all your classes." />
      <div className="mt-6">
        <MonthCalendar year={year} month={month} base="/student/calendar"
          items={items.filter((i) => i.kind === 'library' || targets.has(i.id)).map((i) => ({
            ...i, href: i.kind === 'practice' ? `/student/${i.class_id}/assignments/${targets.get(i.id)}?kind=practice` : `/student/${i.class_id}/assignments/${i.id}`,
          }))} />
      </div>
    </div>
  );
}
