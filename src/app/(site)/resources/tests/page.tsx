import type { Metadata } from 'next';
import { LevelTabs, parseLevel } from '@/components/level-tabs';
import { QuizShelf } from '@/components/quiz-shelf';
import { testsForLevel } from '@/lib/content/catalog';
import { levelById } from '@/lib/content/levels';

export const metadata: Metadata = { title: 'Spanish Tests and Exams' };

export default async function Tests({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const level = parseLevel((await searchParams).level);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Two unit exams and a final for {levelById(level)?.name}. Each has vocabulary, verbs, grammar,
        a reading comprehension section and a writing task.
      </p>
      <div className="mt-6"><LevelTabs base="/resources/tests" current={level} /></div>
      <QuizShelf quizzes={testsForLevel(level)} base="/resources/tests" />
    </>
  );
}
