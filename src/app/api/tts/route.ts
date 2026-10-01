/**
 * Plumi's natural voice. Turns a short Spanish string into speech with Google
 * Cloud Text-to-Speech (a neural voice), cached by the CDN forever since the
 * same text always sounds the same.
 *
 * Only strings that appear in the lessons may be spoken, so this can't be used
 * as a free general-purpose TTS proxy. Without GOOGLE_TTS_API_KEY it answers
 * 501 and the browser falls back to its own voice.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { PIC_UNITS } from '@/lib/content/picture-vocab';
import { sentenceFor } from '@/lib/content/sentences';
import { PLUMI_LINES } from '@/components/plumi/lines';

let allowed: Set<string> | undefined;
function allowList(): Set<string> {
  if (allowed) return allowed;
  allowed = new Set(PLUMI_LINES);
  for (const u of PIC_UNITS) for (const w of u.words) {
    allowed.add(w[0]);
    const s = sentenceFor(u.id, w);
    if (s) allowed.add(s.es);
  }
  return allowed;
}

export async function GET(req: NextRequest) {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) return new NextResponse(null, { status: 501 });

  const text = (req.nextUrl.searchParams.get('t') ?? '').slice(0, 200);
  if (!allowList().has(text)) return new NextResponse(null, { status: 404 });

  const voice = process.env.GOOGLE_TTS_VOICE || 'es-US-Neural2-A';
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: voice.slice(0, 5), name: voice },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.92, pitch: 1.0 },
    }),
  });
  if (!res.ok) return new NextResponse(null, { status: 502 });
  const { audioContent } = (await res.json()) as { audioContent?: string };
  if (!audioContent) return new NextResponse(null, { status: 502 });

  return new NextResponse(Buffer.from(audioContent, 'base64'), {
    headers: {
      'content-type': 'audio/mpeg',
      'cache-control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    },
  });
}
