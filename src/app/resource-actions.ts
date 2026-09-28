'use server';

import { quizById, readingAsQuiz, gradeQuiz, type GradeResult } from '@/lib/content/catalog';

/** Public practice: grade on the server so answers never ship before submission. */
export async function gradePractice(quizId: string, answers: Record<string, string>): Promise<GradeResult | { error: string }> {
  const quiz = quizId.startsWith('reading:') ? readingAsQuiz(quizId.slice('reading:'.length)) : quizById(quizId);
  if (!quiz) return { error: 'That quiz no longer exists.' };
  return gradeQuiz(quiz, answers);
}
