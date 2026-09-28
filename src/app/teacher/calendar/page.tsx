import { requireTeacher } from '@/lib/auth/require';
import { datedItems } from '@/lib/classroom/workspace';
import { PageHeader } from '@/components/lms/ui';
import { MonthCalendar } from '@/components/lms/month-calendar';
import { parseMonth } from '@/components/lms/parse-month';

export default async function Calendar({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const teacherId = await requireTeacher();
  const { year, month } = parseMonth((await searchParams).month);
  // a margin either side so every time zone's view of the month is covered
  const items = await datedItems({ teacherId }, new Date(Date.UTC(year, month - 1, 20)), new Date(Date.UTC(year, month + 1, 12)));
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="Calendar" sub="Due dates across all your courses." />
      <div className="mt-6">
        <MonthCalendar year={year} month={month} base="/teacher/calendar"
          items={items.map((i) => ({ ...i, href: `/teacher/${i.class_id}/assignments/${i.id}${i.kind === 'practice' ? '?kind=practice' : ''}` }))} />
      </div>
    </div>
  );
}
