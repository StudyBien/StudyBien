import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { VOICES } from './voices.ts';
import { ALL_REACTIONS } from './reactions.ts';
import { PLUMI_LINES } from './lines.ts';
import { PIC_UNITS } from '../../lib/content/picture-vocab.ts';
import { sentenceFor } from '../../lib/content/sentences.ts';

test('every voice has a recording for every line Plumi can say', () => {
  const lines = new Set([...PLUMI_LINES, ...ALL_REACTIONS.map((r) => r.say)]);
  for (const u of PIC_UNITS) for (const w of u.words) { lines.add(w[0]); const s = sentenceFor(u.id, w); if (s) lines.add(s.es); }
  for (const v of VOICES) {
    const dir = join(process.cwd(), 'public', 'voice', v.id);
    const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8')) as Record<string, string>;
    const missing = [...lines].filter((l) => !manifest[l] || !existsSync(join(dir, `${manifest[l]}.mp3`)));
    assert.deepEqual(missing, [], `${v.id} is missing ${missing.length} clips — run scripts/generate-voice.py`);
  }
});
