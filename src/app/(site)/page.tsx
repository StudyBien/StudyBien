import Link from 'next/link';
import { Bienvenidos } from '@/components/bienvenidos';
import { Plumi } from '@/components/plumi/plumi';
import { LEVELS } from '@/lib/content/levels';
import { allQuizzes, allTests, allWorksheets } from '@/lib/content/catalog';
import { READINGS } from '@/lib/content/readings';

const SHELVES = [
  { href: '/resources/worksheets', title: 'Worksheets', blurb: 'Printable practice for every level, each paired with its answer key.', icon: '▤', count: () => allWorksheets().length },
  { href: '/resources/quizzes', title: 'Quizzes', blurb: 'Over ten auto-graded quizzes per level: vocabulary, verbs and grammar.', icon: '✓', count: () => allQuizzes().length },
  { href: '/resources/tests', title: 'Tests', blurb: 'Unit exams and a final for every level, with reading and writing sections.', icon: '◈', count: () => allTests().length },
  { href: '/resources/reading', title: 'Reading Comprehension', blurb: 'Original passages from first-year stories to college essays, with writing tasks.', icon: '❡', count: () => READINGS.length },
  { href: '/games', title: 'Games', blurb: 'Hangman and word search with verbs, colors, animals and more.', icon: '★', count: () => null },
];

export default function Home() {
  return (
    <>
      <Bienvenidos />

      <section className="rounded-[var(--radius-lg)] bg-primary-deep px-6 py-10 text-paper sm:px-10 sm:py-14">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-paper/75">StudyBien</p>
        <h1 className="mt-2 text-[clamp(2.2rem,5.5vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          ¡Bienvenidos!
        </h1>
        <p className="mt-3 max-w-xl text-lg text-paper/90">
          Spanish, from first words to fluency. Free worksheets, quizzes, tests, readings and games
          for Spanish 1 through AP and college, plus a classroom for your students.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/login?mode=up"
                className="rounded-lg bg-paper px-5 py-3 font-bold text-primary-deep no-underline hover:bg-primary-tint hover:text-primary-deep">
            I’m a teacher: create a classroom
          </Link>
          <Link href="/go"
                className="rounded-lg border-2 border-paper/70 px-5 py-3 font-bold text-paper no-underline hover:bg-paper/10 hover:text-paper">
            I’m a student: join with a code
          </Link>
        </div>
      </section>

      <section className="mt-10 flex flex-col items-center gap-6 rounded-[var(--radius-lg)] border-2 border-primary-tint p-6 sm:flex-row sm:p-8" style={{ background: '#F5FBFF' }}>
        <Plumi mood="happy" size={110} className="flex-none" />
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-primary">Nuevo</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Learn with Plumi, our talking feather pen</h2>
          <p className="mt-2 text-ink-soft">
            Picture lessons from A1 to C2. Tap a picture and Plumi says the word, then find it by sight and by sound,
            and brings back what you missed. Earn stars, XP and a daily streak.
          </p>
          <Link href="/learn" className="mt-4 inline-block rounded-lg bg-primary px-5 py-3 font-bold text-paper no-underline hover:bg-primary-hover hover:text-paper">
            Start learning →
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Explora la biblioteca</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHELVES.map((s) => {
            const n = s.count();
            return (
              <Link key={s.href} href={s.href}
                    className="group rounded-[var(--radius-lg)] border border-rule bg-paper p-5 text-ink no-underline transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md hover:text-ink">
                <span aria-hidden className="grid h-10 w-10 place-items-center rounded-lg bg-primary-tint text-xl text-primary-deep">{s.icon}</span>
                <h3 className="mt-3 text-lg font-bold group-hover:text-primary">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{s.blurb}</p>
                {n !== null && <p className="mt-3 font-mono text-xs uppercase tracking-[0.06em] text-ink-muted">{n} available</p>}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Every level</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map((l) => (
            <Link key={l.id} href={`/resources/quizzes?level=${l.id}`}
                  className="rounded-[var(--radius-md)] border border-rule p-4 text-ink no-underline hover:border-primary hover:text-ink">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">{l.audience}</p>
              <p className="mt-1 text-lg font-bold">{l.name}</p>
              <p className="mt-1 text-sm text-ink-soft">{l.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-rule p-6">
          <h2 className="text-xl font-bold">For teachers</h2>
          <ul className="mt-3 space-y-2 text-ink-soft">
            <li>• A classroom with a dashboard, courses, calendar and to-do list</li>
            <li>• Announcements, assignments, grades and people for every course</li>
            <li>• A join code for each class: students are in within seconds</li>
            <li>• Assign any quiz, test, reading or worksheet from the library</li>
          </ul>
          <Link href="/login?mode=up" className="mt-4 inline-block font-bold">Create your free classroom →</Link>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-rule p-6">
          <h2 className="text-xl font-bold">For students</h2>
          <ul className="mt-3 space-y-2 text-ink-soft">
            <li>• Join with the code from your teacher: no email needed</li>
            <li>• See announcements, assignments and due dates in one place</li>
            <li>• Submit your work and see your grades</li>
            <li>• Practice anytime with quizzes and games</li>
          </ul>
          <Link href="/go" className="mt-4 inline-block font-bold">Join a classroom →</Link>
        </div>
      </section>
    </>
  );
}
