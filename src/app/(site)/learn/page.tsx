import type { Metadata } from 'next';
import { LEVELS } from '@/lib/content/levels';
import { HIGH_SCHOOL, unitsForLevel } from '@/lib/content/lessons';
import { LearnPath } from './learn-path';

export const metadata: Metadata = { title: 'Learn with Plumi' };

export default function Learn() {
  const levels = HIGH_SCHOOL.map((id) => ({
    id, name: LEVELS.find((l) => l.id === id)!.name,
    units: unitsForLevel(id).map((u) => ({
      id: u.theme.id, name: u.theme.name, nameEn: u.theme.nameEn,
      lessons: u.lessons.map((l) => ({ key: l.key, index: l.index, count: l.words.length })),
    })),
  }));
  return <LearnPath levels={levels} />;
}
