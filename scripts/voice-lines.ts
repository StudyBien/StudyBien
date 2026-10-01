/**
 * Every Spanish string Plumi can say, one per line, for scripts/generate-voice.py.
 *   npx tsx scripts/voice-lines.ts > /tmp/lines.txt
 * With an argument, prints the voices as JSON instead (used by generate-voice.py).
 */
import { PIC_UNITS } from '../src/lib/content/picture-vocab.ts';
import { sentenceFor, tokens } from '../src/lib/content/sentences.ts';
import { PLUMI_LINES } from '../src/components/plumi/lines.ts';
import { ALL_REACTIONS } from '../src/components/plumi/reactions.ts';

const out = new Set<string>([...PLUMI_LINES, ...ALL_REACTIONS.map((r) => r.say)]);
for (const u of PIC_UNITS) for (const w of u.words) {
  out.add(w[0]);
  const s = sentenceFor(u.id, w);
  if (s) { out.add(s.es); for (const t of tokens(s.es)) out.add(t); }
}
process.stdout.write([...out].join('\n') + '\n');

