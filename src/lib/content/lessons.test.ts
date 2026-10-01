import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CEFR_LEVELS, PIC_UNITS } from './picture-vocab.ts';
import { unitsForLevel, buildExercises, lessonFor, lessonsOf } from './lessons.ts';
import { sentenceFor, tokens, sameSentence } from './sentences.ts';

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
    const ex = buildExercises(l.words, u.words, seeded(3), u.id);
    assert.equal(ex[0].kind, 'meet');
    for (const e of ex) {
      if (e.kind === 'meet') continue;
      if (e.kind === 'tiles') {
        const answer = e.from === 'es' ? e.sentence.en : e.sentence.es;
        for (const t of tokens(answer)) assert.ok(e.tiles.includes(t), `${l.key}: missing tile ${t}`);
        assert.ok(e.tiles.length > tokens(answer).length, `${l.key}: no decoys`);
        continue;
      }
      if (e.kind === 'meaning') { assert.ok(e.options.includes(e.word[1])); assert.equal(new Set(e.options).size, 4); continue; }
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

test('sentence patterns produce the expected Spanish', () => {
  const s = (unit: string, w: [string, string, string]) => sentenceFor(unit, w)!;
  assert.deepEqual(s('a1-animales', ['el perro', 'dog', '🐶']), { es: 'Veo el perro.', en: 'I see the dog.' });
  assert.equal(s('a1-frutas', ['las uvas', 'grapes', '🍇']).es, 'Quiero unas uvas.');
  assert.equal(s('a1-frutas', ['la manzana', 'apple', '🍎']).en, 'I want an apple.');
  assert.equal(s('a1-deportes' as string, ['el tenis', 'tennis', '🎾']), null);
  assert.equal(s('a1-bebidas', ['el agua', 'water', '💧']).es, 'Quiero agua.');
  assert.equal(s('a1-familia', ['la madre', 'mother', '👩']).es, 'Veo a mi madre.');
  assert.equal(s('a1-cuerpo', ['la mano', 'hand', '✋']).en, 'My hand hurts.');
  assert.equal(s('a2-transporte', ['el avión', 'airplane', '✈️']).es, 'Voy en avión.');
  assert.equal(s('a2-profesiones', ['el artista', 'artist', '🧑‍🎨']).en, 'My father is an artist.');
  assert.equal(sentenceFor('a1-numeros', ['uno', 'one', '1️⃣']), null);
  assert.ok(sameSentence(['i', 'see', 'the', 'dog'], 'I see the dog.'));
  assert.ok(!sameSentence(['see', 'I', 'the', 'dog'], 'I see the dog.'));
});
