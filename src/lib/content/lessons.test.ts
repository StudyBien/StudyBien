import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CEFR_LEVELS, PIC_UNITS } from './picture-vocab.ts';
import { unitsForLevel, buildExercises, lessonFor, lessonsOf } from './lessons.ts';

function seeded(n: number) { return () => ((n = (n * 16807) % 2147483647) / 2147483647); }

test('every CEFR level has picture units; every unit has 8 words with unique pictures and glosses', () => {
  for (const l of CEFR_LEVELS) assert.ok(unitsForLevel(l.id).length >= 4, l.id);
  const ids = new Set<string>();
  for (const u of PIC_UNITS) {
    assert.ok(!ids.has(u.id), `duplicate unit ${u.id}`); ids.add(u.id);
    assert.equal(u.words.length, 8, u.id);
    assert.equal(new Set(u.words.map((w) => w[2])).size, 8, `${u.id} repeats a picture`);
    assert.equal(new Set(u.words.map((w) => w[0])).size, 8, `${u.id} repeats a word`);
    assert.equal(new Set(u.words.map((w) => w[1])).size, 8, `${u.id} repeats a meaning`);
  }
});

test('every exercise has exactly one correct option among four distinct pictures', () => {
  for (const u of PIC_UNITS) for (const l of lessonsOf(u)) {
    const ex = buildExercises(l.words, u.words, seeded(3));
    assert.equal(ex[0].kind, 'meet');
    for (const e of ex) {
      if (e.kind === 'meet') continue;
      assert.equal(e.options.length, 4, l.key);
      assert.equal(e.options.filter((o) => o[0] === e.word[0]).length, 1, l.key);
      assert.equal(new Set(e.options.map((o) => o[2])).size, 4, `${l.key} repeats a picture`);
    }
  }
});

test('lessons resolve by unit and index', () => {
  assert.ok(lessonFor('a1-animales', 1));
  assert.equal(lessonFor('a1-animales', 5), null);
  assert.equal(lessonFor('nope', 0), null);
});
