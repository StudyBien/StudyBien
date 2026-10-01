#!/usr/bin/env bash
# Speed the raw recording to 60 s, loop the music under it and drop a pop on each click.
set -euo pipefail
MUSIC=$1; POP=$2; cd /var/tmp/tour
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -hide_banner -loglevel error -y -i "$POP" -ac 2 -ar 44100 -f s16le pop.raw
python3 - <<'PY'
import json, numpy as np, wave, subprocess, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe(); tl = json.load(open('timeline.json'))
d = subprocess.run([FF, '-i', 'raw.webm'], capture_output=True, text=True).stderr.split('Duration: ')[1].split(',')[0].split(':')
dur = int(d[0]) * 3600 + int(d[1]) * 60 + float(d[2]); factor = dur / 60.0; offset = dur - tl['total'] - 0.25
pop = np.frombuffer(open('pop.raw', 'rb').read(), np.int16).reshape(-1, 2).astype(np.float32); sr = 44100
track = np.zeros((sr * 61, 2), np.float32)
for c in tl['clicks']:
    i = int(sr * (c + offset) / factor); seg = pop[: len(track) - i] * 0.9; track[i:i + len(seg)] += seg
with wave.open('pops.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(track, -32767, 32767).astype(np.int16).tobytes())
open('factor.txt', 'w').write(f'{factor:.5f}')
PY
F=$(cat factor.txt); OUT=$(cd "$(dirname "$0")/../.." && pwd)/public/media
"$FF" -hide_banner -loglevel error -y -i raw.webm -stream_loop 1 -i "$MUSIC" -i pops.wav \
  -filter_complex "[0:v]setpts=PTS/$F,fps=30,format=yuv420p[v];[1:a]atrim=0:60,asetpts=PTS-STARTPTS,afade=t=in:d=0.6,afade=t=out:st=57.5:d=2.5,volume=0.6[m];[2:a]atrim=0:60[p];[m][p]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]" \
  -map "[v]" -map "[a]" -t 60 -c:v libx264 -preset slow -crf 26 -profile:v high -movflags +faststart -c:a aac -b:a 128k "$OUT/studybien-tour.mp4"
"$FF" -hide_banner -loglevel error -y -i "$OUT/studybien-tour.mp4" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -cpu-used 4 -c:a libopus -b:a 96k "$OUT/studybien-tour.webm"
"$FF" -hide_banner -loglevel error -y -ss 2.6 -i "$OUT/studybien-tour.mp4" -frames:v 1 -q:v 3 "$OUT/studybien-tour.jpg"
echo "wrote $OUT/studybien-tour.{mp4,webm,jpg}"
