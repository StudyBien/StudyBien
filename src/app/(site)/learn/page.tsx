import type { Metadata } from 'next';
import { CEFR_LEVELS } from '@/lib/content/picture-vocab';
import { unitsForLevel } from '@/lib/content/lessons';
import { LearnPath } from './learn-path';

export const metadata: Metadata = { title: 'Learn with Plumi' };

export default function Learn() {
  const levels = CEFR_LEVELS.map((l) => ({
    id: l.id, name: l.name, school: l.school,
    units: unitsForLevel(l.id).map(({ unit, lessons }) => ({
      id: unit.id, name: unit.name, nameEn: unit.nameEn, pics: unit.words.slice(0, 4).map((w) => w[2]),
      lessons: lessons.map((x) => ({ key: x.key, index: x.index })),
    })),
  }));
  return <LearnPath levels={levels} />;
}
