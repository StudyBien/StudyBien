import Link from 'next/link';
import type { Quiz } from '@/lib/content/catalog';
import { publicQuestions } from '@/lib/content/catalog';
import { readingById } from '@/lib/content/readings';
import { levelById } from '@/lib/content/levels';
import { gradePractice } from '@/app/resource-actions';
import { QuizPlayer } from './quiz-player';
import { ReadingPassage } from './reading-passage';

export function QuizPage({ quiz, back, backLabel }: { quiz: Quiz; back: string; backLabel: string }) {
  const reading = quiz.readingId ? readingById(quiz.readingId) : undefined;
  return (
    <>
      <Link href={back} className="text-sm">← {backLabel}</Link>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
        {levelById(quiz.level)?.name} · {quiz.category}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{quiz.title}</h1>
      <p className="mt-1 text-ink-soft">{quiz.subtitle} · {quiz.questions.length} questions</p>
      {reading && <div className="mt-6"><ReadingPassage reading={reading} /></div>}
      <div className="mt-8">
        <QuizPlayer questions={publicQuestions(quiz)} writing={quiz.writing} submit={gradePractice.bind(null, quiz.id)} />
      </div>
    </>
  );
}
