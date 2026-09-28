import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { quizById, allQuizzes } from '@/lib/content/catalog';
import { levelById } from '@/lib/content/levels';
import { QuizPage } from '@/components/quiz-page';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return allQuizzes().map((q) => ({ id: q.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = quizById((await params).id);
  return q ? { title: `${q.title} — ${levelById(q.level)?.name} quiz` } : {};
}

export default async function QuizRoute({ params }: Props) {
  const quiz = quizById((await params).id);
  if (!quiz || quiz.kind !== 'quiz') notFound();
  return <QuizPage quiz={quiz} back={`/resources/quizzes?level=${quiz.level}`} backLabel={`${levelById(quiz.level)?.name} quizzes`} />;
}
