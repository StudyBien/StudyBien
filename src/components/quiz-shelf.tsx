import Link from 'next/link';
import type { Quiz } from '@/lib/content/catalog';

const COLORS: Record<string, string> = {
  Vocabulario: 'bg-teal/20 text-teal-ink', Verbos: 'bg-primary-tint text-primary-deep',
  Gramática: 'bg-marigold-fill text-marigold-ink', Repaso: 'bg-tangerine-fill text-tangerine-ink',
  Examen: 'bg-primary-tint text-primary-deep',
};

export function QuizShelf({ quizzes, base }: { quizzes: Quiz[]; base: string }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((q) => (
        <li key={q.id}>
          <Link href={`${base}/${q.id}`}
                className="flex h-full flex-col rounded-[var(--radius-md)] border border-rule p-4 text-ink no-underline hover:border-primary hover:text-ink">
            <span className={`self-start rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] ${COLORS[q.category]}`}>{q.category}</span>
            <span className="mt-2 font-bold">{q.title}</span>
            <span className="text-sm text-ink-soft">{q.subtitle}</span>
            <span className="mt-auto pt-3 text-sm text-ink-muted">{q.questions.length} questions{q.writing ? ' + writing' : ''}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
