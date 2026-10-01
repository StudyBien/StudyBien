/**
 * Every Spanish string Plumi can say, one per line, for scripts/generate-voice.py.
 *   npx tsx scripts/voice-lines.ts > /tmp/lines.txt
 */
import { PIC_UNITS } from '../src/lib/content/picture-vocab.ts';
import { sentenceFor, tokens } from '../src/lib/content/sentences.ts';
import { PLUMI_LINES } from '../src/components/plumi/lines.ts';

const out = new Set<string>(PLUMI_LINES);
for (const u of PIC_UNITS) for (const w of u.words) {
  out.add(w[0]);
  const s = sentenceFor(u.id, w);
  if (s) { out.add(s.es); for (const t of tokens(s.es)) out.add(t); }
}
process.stdout.write([...out].join('\n') + '\n');
