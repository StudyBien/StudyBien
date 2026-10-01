"""
Pre-record Plumi's voices with Piper, a free open-source TTS engine.

    pip install piper-tts lameenc
    npx tsx scripts/voice-lines.ts > /tmp/lines.txt
    python3 scripts/generate-voice.py /tmp/lines.txt <models-dir>

For each voice below, writes public/voice/<id>/<clip>.mp3 and a manifest.json
mapping text -> clip. Existing clips are kept, so re-running only records new
lines. Models come from https://huggingface.co/rhasspy/piper-voices; licences
are listed in public/voice/LICENSE.md. Keep this list in sync with
src/components/plumi/voices.ts.
"""
import hashlib, io, json, os, sys, wave
import lameenc
from piper import PiperVoice, SynthesisConfig

# (folder, model, speaker, noise_scale, noise_w, bitrate kbps)
# Lower noise settings give steadier, clearer delivery; the male voices also get a
# higher bitrate because their deeper voices lose more at low bitrates.
VOICES = [
    ('mx-f', 'es_MX-claude-high', None, 0.667, 0.8, 40),
    ('es-f', 'es_ES-sharvard-medium', 1, 0.667, 0.8, 40),
]
# Diego (mx-m) and Javier (es-m) are cloned voices: record them with
# scripts/voice-clone/run_all.py instead, so this never overwrites them.

lines_file, models = sys.argv[1], sys.argv[2]
lines = [l.strip() for l in open(lines_file, encoding='utf-8') if l.strip()]
root = os.path.join(os.path.dirname(__file__), '..', 'public', 'voice')

for vid, model, speaker, ns, nw, kbps in VOICES:
    out_dir = os.path.join(root, vid)
    os.makedirs(out_dir, exist_ok=True)
    voice = PiperVoice.load(os.path.join(models, model + '.onnx'))
    cfg = SynthesisConfig(speaker_id=speaker, length_scale=1.05, noise_scale=ns, noise_w_scale=nw)
    manifest = {}
    for text in lines:
        clip = hashlib.sha1(text.encode('utf-8')).hexdigest()[:12]
        dst = os.path.join(out_dir, f'{clip}.mp3')
        if not os.path.exists(dst):
            buf = io.BytesIO()
            with wave.open(buf, 'wb') as w:
                voice.synthesize_wav(text, w, syn_config=cfg)
            buf.seek(0)
            with wave.open(buf, 'rb') as w:
                enc = lameenc.Encoder()
                enc.set_bit_rate(kbps); enc.set_in_sample_rate(w.getframerate()); enc.set_channels(w.getnchannels()); enc.set_quality(2)
                data = enc.encode(w.readframes(w.getnframes())) + enc.flush()
            open(dst, 'wb').write(data)
        manifest[text] = clip
    json.dump(manifest, open(os.path.join(out_dir, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, sort_keys=True)
    print(vid, len(manifest), 'clips')
