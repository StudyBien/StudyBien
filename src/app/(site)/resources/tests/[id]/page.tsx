import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { quizById, allTests } from '@/lib/content/catalog';
import { levelById } from '@/lib/content/levels';
import { QuizPage } from '@/components/quiz-page';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return allTests().map((q) => ({ id: q.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = quizById((await params).id);
  return q ? { title: q.title } : {};
}

export default async function TestRoute({ params }: Props) {
  const quiz = quizById((await params).id);
  if (!quiz || quiz.kind !== 'test') notFound();
  return <QuizPage quiz={quiz} back={`/resources/tests?level=${quiz.level}`} backLabel={`${levelById(quiz.level)?.name} tests`} />;
}
