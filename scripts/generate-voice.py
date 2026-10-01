"""
Pre-record Plumi's voice with Piper, a free open-source TTS engine.

    pip install piper-tts lameenc
    npx tsx scripts/voice-lines.ts > /tmp/lines.txt
    python3 scripts/generate-voice.py /tmp/lines.txt path/to/es_MX-claude-high.onnx

Writes public/voice/<id>.mp3 for each line and public/voice/manifest.json
mapping text -> file. Existing clips are kept, so re-running only records new
lines. Voice: es_MX-claude-high (Apache-2.0), see public/voice/LICENSE.md.
"""
import hashlib, io, json, os, sys, wave
import lameenc
from piper import PiperVoice

lines_file, model = sys.argv[1], sys.argv[2]
out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'voice')
os.makedirs(out_dir, exist_ok=True)
voice = PiperVoice.load(model)
manifest = {}

for text in [l.strip() for l in open(lines_file, encoding='utf-8') if l.strip()]:
    clip_id = hashlib.sha1(text.encode('utf-8')).hexdigest()[:12]
    dst = os.path.join(out_dir, f'{clip_id}.mp3')
    if not os.path.exists(dst):
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as w:
            voice.synthesize_wav(text, w)
        buf.seek(0)
        with wave.open(buf, 'rb') as w:
            enc = lameenc.Encoder()
            enc.set_bit_rate(40); enc.set_in_sample_rate(w.getframerate()); enc.set_channels(w.getnchannels()); enc.set_quality(2)
            data = enc.encode(w.readframes(w.getnframes())) + enc.flush()
        open(dst, 'wb').write(data)
    manifest[text] = clip_id

json.dump(manifest, open(os.path.join(out_dir, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, sort_keys=True)
print(f'{len(manifest)} clips')
