import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HIGH_SCHOOL, unitsForLevel, buildExercises, checkTyped, lessonFor } from './lessons.ts';

function seeded(n: number) { return () => ((n = (n * 16807) % 2147483647) / 2147483647); }

test('every high school level has units, and every lesson has 4-7 words', () => {
  for (const level of HIGH_SCHOOL) {
    const units = unitsForLevel(level);
    assert.ok(units.length >= 3, level);
    for (const u of units) for (const l of u.lessons) assert.ok(l.words.length >= 4 && l.words.length <= 7, `${l.key}: ${l.words.length}`);
  }
});

test('exercises always contain the right answer among distinct options', () => {
  for (const level of HIGH_SCHOOL) for (const u of unitsForLevel(level)) for (const l of u.lessons) {
    const ex = buildExercises(l.words, u.theme.words, seeded(7));
    for (const e of ex) {
      if (e.kind === 'meaning') { assert.ok(e.options.includes(e.word[1])); assert.equal(new Set(e.options).size, e.options.length); }
      if (e.kind === 'translate' || e.kind === 'listen') { assert.ok(e.options.includes(e.word[0])); assert.equal(new Set(e.options).size, e.options.length); }
      if (e.kind === 'build') {
        const need = e.word[0].replace(/[¿?¡!.,…]/g, '').split(/\s+/).filter(Boolean);
        for (const w of need) assert.ok(e.tiles.includes(w), `${l.key} missing tile ${w}`);
      }
    }
    assert.equal(ex.filter((e) => e.kind === 'intro').length, l.words.length);
  }
});

test('typed answers forgive case and punctuation, flag missing accents', () => {
  assert.equal(checkTyped('el perro', 'el perro'), 'exact');
  assert.equal(checkTyped('Perro', 'el perro'), 'exact');
  assert.equal(checkTyped('como estas', '¿Cómo estás?'), 'close');
  assert.equal(checkTyped('Cómo estás', '¿Cómo estás?'), 'exact');
  assert.equal(checkTyped('gato', 'el perro'), 'wrong');
});

test('college content is not a Plumi lesson', () => {
  assert.equal(lessonFor('falsos-amigos', 0), null);
  assert.ok(lessonFor('saludos', 0));
});
