import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS } from './levels.ts';
import {
  quizzesForLevel, testsForLevel, worksheetsForLevel, allQuizzes, allTests,
  quizById, gradeQuiz, publicQuestions,
} from './catalog.ts';
import { THEMES } from './vocab.ts';
import { GRAMMAR } from './grammar.ts';
import { READINGS } from './readings.ts';

test('every level has more than ten quizzes, three tests, and worksheets', () => {
  for (const l of LEVELS) {
    assert.ok(quizzesForLevel(l.id).length > 10, `${l.id}: ${quizzesForLevel(l.id).length} quizzes`);
    assert.equal(testsForLevel(l.id).length, 3, l.id);
    assert.ok(worksheetsForLevel(l.id).length >= 10, `${l.id}: worksheets`);
  }
});

test('every question is well formed: 4 distinct choices, answer in range', () => {
  for (const q of [...allQuizzes(), ...allTests()]) {
    assert.ok(q.questions.length >= 8, `${q.id} has ${q.questions.length} questions`);
    const ids = new Set<string>();
    for (const question of q.questions) {
      assert.ok(!ids.has(question.id), `duplicate id ${question.id}`);
      ids.add(question.id);
      assert.equal(question.choices.length, 4, `${question.id}: ${question.choices}`);
      assert.equal(new Set(question.choices).size, 4, `${question.id} repeats a choice: ${question.choices}`);
      assert.ok(question.answer >= 0 && question.answer < 4, question.id);
    }
  }
});

test('quizzes are deterministic', () => {
  const a = quizById('spanish-2--verbs-preterite-irregular')!;
  const b = quizById('spanish-2--verbs-preterite-irregular')!;
  assert.deepEqual(a, b);
});

test('the public view carries no answers', () => {
  for (const pq of publicQuestions(quizById('spanish-1--vocab-colores')!)) {
    assert.ok(!('answer' in pq) && !('why' in pq));
  }
});

test('grading counts only exact choice matches', () => {
  const q = quizById('spanish-1--vocab-colores')!;
  const all = Object.fromEntries(q.questions.map((x) => [x.id, String(x.answer)]));
  assert.equal(gradeQuiz(q, all).score, q.questions.length);
  assert.equal(gradeQuiz(q, {}).score, 0);
});

test('authored content has no duplicate glosses within a theme and 3 distinct wrong answers', () => {
  for (const t of THEMES) {
    assert.equal(new Set(t.words.map((w) => w[1])).size, t.words.length, `${t.id} repeats an English gloss`);
    assert.equal(new Set(t.words.map((w) => w[0])).size, t.words.length, `${t.id} repeats a Spanish word`);
    assert.ok(t.words.length >= 12, `${t.id} has only ${t.words.length} words`);
  }
  for (const g of [...GRAMMAR.flatMap((x) => x.questions), ...READINGS.flatMap((r) => r.questions)]) {
    assert.equal(new Set([g.correct, ...g.wrong]).size, 4, `repeated option in: ${g.prompt}`);
  }
  for (const l of LEVELS) assert.equal(READINGS.filter((r) => r.level === l.id).length, 3, l.id);
});
