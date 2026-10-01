import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { lessonFor, HIGH_SCHOOL, unitsForLevel } from '@/lib/content/lessons';
import { LessonPlayer } from './lesson-player';

type Props = { params: Promise<{ theme: string; lesson: string }> };

export function generateStaticParams() {
  return HIGH_SCHOOL.flatMap((lvl) => unitsForLevel(lvl).flatMap((u) => u.lessons.map((l) => ({ theme: u.theme.id, lesson: String(l.index) }))));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const f = lessonFor(p.theme, Number(p.lesson));
  return f ? { title: `${f.theme.name} — Lesson ${f.lesson.index + 1}` } : {};
}

export default async function LessonPage({ params }: Props) {
  const p = await params;
  const found = lessonFor(p.theme, Number(p.lesson));
  if (!found) notFound();
  const unit = unitsForLevel(found.theme.level).find((u) => u.theme.id === found.theme.id)!;
  return (
    <LessonPlayer
      lessonKey={found.lesson.key}
      title={`${found.theme.name} · Lección ${found.lesson.index + 1}`}
      level={found.level}
      words={found.lesson.words.map((w) => [w[0], w[1]] as [string, string])}
      pool={found.theme.words.map((w) => [w[0], w[1]] as [string, string])}
      nextHref={found.lesson.index + 1 < unit.lessons.length ? `/learn/${found.theme.id}/${found.lesson.index + 1}` : '/learn'}
    />
  );
}
