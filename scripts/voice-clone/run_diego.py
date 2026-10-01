"""Re-record Diego: MeloTTS Spanish (MIT) at a natural pace, converted to the friend's voice with OpenVoice V2 (MIT)."""
import sys, os, json, hashlib, time, torch, soundfile as sf, numpy as np, lameenc, librosa
sys.argv=['x']; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.environ.get('OPENVOICE_DIR', '/var/tmp/openvoice'))
import clone as C
from melo.api import TTS
SPEED = 1.2
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'voice', 'mx-m'); os.makedirs(OUT, exist_ok=True)
tgt = torch.load(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'embeddings', 'diego.pt'))['tgt']; src = torch.load(os.path.join(os.environ.get('OPENVOICE_CKPT', '/var/tmp/ov_ckpt/converter'), '..', 'es_base.pth'), map_location='cpu')
melo = TTS(language='ES', device='cpu'); spk = list(melo.hps.data.spk2id.values())[0]
lines = [l.strip() for l in open(os.environ.get('LINES', '/tmp/lines.txt'), encoding='utf-8') if l.strip()]
manifest, t0 = {}, time.time()
for i, text in enumerate(lines):
    clip = hashlib.sha1(text.encode('utf-8')).hexdigest()[:12]
    melo.tts_to_file(text, spk, '/tmp/m_a.wav', speed=SPEED, quiet=True)
    y, sr = sf.read('/tmp/m_a.wav'); sf.write('/tmp/m_b.wav', np.concatenate([np.zeros(int(sr*.06)), y, np.zeros(int(sr*.06))]), sr)
    C.conv.convert(audio_src_path='/tmp/m_b.wav', src_se=src, tgt_se=tgt, output_path='/tmp/m_c.wav', tau=0.3)
    z, zsr = sf.read('/tmp/m_c.wav')
    z, _ = librosa.effects.trim(z, top_db=40); z = np.concatenate([np.zeros(int(zsr*.03)), z, np.zeros(int(zsr*.08))])
    z = z / max(1e-6, np.abs(z).max()) * 0.89
    e = lameenc.Encoder(); e.set_bit_rate(64); e.set_in_sample_rate(zsr); e.set_channels(1); e.set_quality(2)
    open(f'{OUT}/{clip}.mp3', 'wb').write(e.encode((z * 32767).astype(np.int16).tobytes()) + e.flush())
    manifest[text] = clip
    if i % 100 == 0: print(i, f'{time.time()-t0:.0f}s', flush=True)
json.dump(manifest, open(f'{OUT}/manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, sort_keys=True)
print('done', len(manifest), f'{time.time()-t0:.0f}s')
