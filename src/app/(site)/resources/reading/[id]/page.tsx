import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { READINGS, readingById } from '@/lib/content/readings';
import { readingAsQuiz, publicQuestions } from '@/lib/content/catalog';
import { levelById } from '@/lib/content/levels';
import { gradePractice } from '@/app/resource-actions';
import { QuizPlayer } from '@/components/quiz-player';
import { ReadingPassage } from '@/components/reading-passage';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return READINGS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = readingById((await params).id);
  return r ? { title: `${r.title} — ${levelById(r.level)?.name} reading` } : {};
}

export default async function ReadingRoute({ params }: Props) {
  const { id } = await params;
  const reading = readingById(id);
  const quiz = readingAsQuiz(id);
  if (!reading || !quiz) notFound();
  return (
    <>
      <Link href={`/resources/reading?level=${reading.level}`} className="text-sm">← {levelById(reading.level)?.name} readings</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">{levelById(reading.level)?.name}</p>
        <Link href={`/resources/worksheets/${reading.level}--ws-reading-${reading.id}`} className="text-sm font-bold">Printable version + answer key →</Link>
      </div>
      <div className="mt-3"><ReadingPassage reading={reading} /></div>
      <h2 className="mt-10 text-xl font-bold">Preguntas</h2>
      <div className="mt-4">
        <QuizPlayer questions={publicQuestions(quiz)} writing={reading.writing} submit={gradePractice.bind(null, quiz.id)} />
      </div>
    </>
  );
}
