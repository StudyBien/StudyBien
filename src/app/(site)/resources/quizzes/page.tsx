import type { Metadata } from 'next';
import { LevelTabs, parseLevel } from '@/components/level-tabs';
import { QuizShelf } from '@/components/quiz-shelf';
import { quizzesForLevel } from '@/lib/content/catalog';
import { levelById } from '@/lib/content/levels';

export const metadata: Metadata = { title: 'Spanish Quizzes' };

export default async function Quizzes({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const level = parseLevel((await searchParams).level);
  const quizzes = quizzesForLevel(level);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        {quizzes.length} auto-graded quizzes for {levelById(level)?.name}: vocabulary, verb conjugation and grammar.
        Answers are checked the moment you submit, with an explanation for anything you missed.
      </p>
      <div className="mt-6"><LevelTabs base="/resources/quizzes" current={level} /></div>
      <QuizShelf quizzes={quizzes} base="/resources/quizzes" />
    </>
  );
}
