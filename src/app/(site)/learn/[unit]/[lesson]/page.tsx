import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PIC_UNITS } from '@/lib/content/picture-vocab';
import { lessonFor, lessonsOf } from '@/lib/content/lessons';
import { LessonPlayer } from './lesson-player';

type Props = { params: Promise<{ unit: string; lesson: string }> };

export function generateStaticParams() {
  return PIC_UNITS.flatMap((u) => lessonsOf(u).map((l) => ({ unit: u.id, lesson: String(l.index) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const f = lessonFor(p.unit, Number(p.lesson));
  return f ? { title: `${f.unit.name} — Lección ${f.lesson.index + 1}` } : {};
}

export default async function LessonPage({ params }: Props) {
  const p = await params;
  const f = lessonFor(p.unit, Number(p.lesson));
  if (!f) notFound();
  return (
    <LessonPlayer
      lessonKey={f.lesson.key}
      title={`${f.unit.name} · Lección ${f.lesson.index + 1}`}
      level={f.levelName}
      words={f.lesson.words.map((w) => [w[0], w[1], w[2]] as const)}
      pool={f.unit.words.map((w) => [w[0], w[1], w[2]] as const)}
      nextHref={f.lesson.index + 1 < f.count ? `/learn/${f.unit.id}/${f.lesson.index + 1}` : '/learn'}
    />
  );
}
