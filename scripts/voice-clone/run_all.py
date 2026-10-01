"""Re-record one of Plumi's voices as a friend's cloned voice. Usage: run_all.py <folder> <name> <model> <speaker|-> <semitones> [limit]"""
import sys, os, io, json, hashlib, wave, torch, librosa, soundfile as sf, numpy as np, lameenc, time
folder, name, model, spk, shift = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5])
limit = int(sys.argv[6]) if len(sys.argv) > 6 else None
sys.argv = ['x']; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.environ.get('OPENVOICE_DIR', '/var/tmp/openvoice'))
import clone as C
from piper import PiperVoice, SynthesisConfig
se = torch.load(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'embeddings', f'{name}.pt'))
voice = PiperVoice.load(fos.path.join(os.environ.get('PIPER_MODELS', '/var/tmp/piper'), f'{model}.onnx'))
cfg = SynthesisConfig(speaker_id=None if spk == '-' else int(spk), length_scale=1.05, noise_scale=0.4, noise_w_scale=0.5)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'voice', folder)
os.makedirs(out, exist_ok=True)
lines = [l.strip() for l in open(os.environ.get('LINES', '/tmp/lines.txt'), encoding='utf-8') if l.strip()][:limit]
manifest, t0 = {}, time.time()
src, mid, dst = f'/tmp/_{name}_a.wav', f'/tmp/_{name}_b.wav', f'/tmp/_{name}_c.wav'
for i, text in enumerate(lines):
    clip = hashlib.sha1(text.encode('utf-8')).hexdigest()[:12]
    with wave.open(src, 'wb') as w: voice.synthesize_wav(text, w, syn_config=cfg)
    y, sr = librosa.load(src, sr=None)
    if shift: y = librosa.effects.pitch_shift(y, sr=sr, n_steps=shift)
    y = np.concatenate([np.zeros(int(sr * 0.05)), y, np.zeros(int(sr * 0.05))])   # breathing room so the converter doesn't clip edges
    sf.write(mid, y, sr)
    C.conv.convert(audio_src_path=mid, src_se=se['src'], tgt_se=se['tgt'], output_path=dst, tau=0.3)
    z, zsr = sf.read(dst)
    z = z / max(1e-6, np.abs(z).max()) * 0.89                                      # even loudness, no clipping
    pcm = (z * 32767).astype(np.int16)
    e = lameenc.Encoder(); e.set_bit_rate(64); e.set_in_sample_rate(zsr); e.set_channels(1); e.set_quality(2)
    open(f'{out}/{clip}.mp3', 'wb').write(e.encode(pcm.tobytes()) + e.flush())
    manifest[text] = clip
    if i % 100 == 0: print(i, f'{time.time() - t0:.0f}s', flush=True)
json.dump(manifest, open(f'{out}/manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, sort_keys=True)
print('done', len(manifest), f'{time.time() - t0:.0f}s')
