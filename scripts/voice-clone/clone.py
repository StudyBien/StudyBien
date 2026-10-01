"""Clone a friend's voice onto Piper output with OpenVoice V2's tone-colour converter (MIT)."""
import sys, io, wave, os, numpy as np, soundfile as sf, torch, librosa
sys.path.insert(0, os.environ.get('OPENVOICE_DIR', '/var/tmp/openvoice'))
from openvoice.api import ToneColorConverter
from piper import PiperVoice, SynthesisConfig

CKPT = os.environ.get('OPENVOICE_CKPT', '/var/tmp/ov_ckpt/converter')
conv = ToneColorConverter(os.path.join(CKPT, 'config.json'), device='cpu')
conv.watermark_model = None
conv.load_ckpt(os.path.join(CKPT, 'checkpoint.pth'))
SR = conv.hps.data.sampling_rate

def embed(paths):
    return conv.extract_se(paths)

def chunks(ref, out_prefix, seconds=8):
    x, sr = librosa.load(ref, sr=SR)
    paths = []
    for i in range(0, len(x) - sr * 3, sr * seconds):
        p = f'{out_prefix}_{i // (sr * seconds)}.wav'; sf.write(p, x[i:i + sr * seconds], sr); paths.append(p)
    return paths

def piper_wav(voice, cfg, text, path):
    with wave.open(path, 'wb') as w:
        voice.synthesize_wav(text, w, syn_config=cfg)

SAMPLE_LINES = ['¡Hola! Soy Plumi. ¡Vamos a aprender español!', 'Veo el pájaro.', 'Me gusta la manzana.', '¡Muy bien!', '¿Cuál es el perro?',
                'Me duele la mano.', 'Voy en tren.', 'Busco el hospital.', 'Estoy cansado.', 'Necesito el libro.']

def build(name, model, speaker, ns, nw):
    voice = PiperVoice.load(os.path.join(os.environ.get('PIPER_MODELS', '/var/tmp/piper'), f'{model}.onnx'))
    cfg = SynthesisConfig(speaker_id=speaker, length_scale=1.05, noise_scale=ns, noise_w_scale=nw)
    src_paths = []
    for k, t in enumerate(SAMPLE_LINES):
        p = f'/tmp/{name}_src_{k}.wav'; piper_wav(voice, cfg, t, p); src_paths.append(p)
    src_se = embed(src_paths)
    tgt_se = embed(chunks(f'/tmp/{name}_ref.wav', f'/tmp/{name}_refchunk'))
    torch.save({'src': src_se, 'tgt': tgt_se}, f'/tmp/{name}_se.pt')
    return voice, cfg, src_se, tgt_se

if __name__ == '__main__':
    name, model, speaker = sys.argv[1], sys.argv[2], (None if sys.argv[3] == '-' else int(sys.argv[3]))
    voice, cfg, src_se, tgt_se = build(name, model, speaker, 0.4, 0.5)
    text = '¡Hola! Soy Plumi. ¡Vamos a aprender español! Veo el pájaro. Me gusta la manzana. ¡Muy bien! ¡Órale!'
    piper_wav(voice, cfg, text, f'/tmp/{name}_test_src.wav')
    conv.convert(audio_src_path=f'/tmp/{name}_test_src.wav', src_se=src_se, tgt_se=tgt_se,
                 output_path=f'/tmp/{name}_test.wav', tau=0.3)
    print('done', name)
