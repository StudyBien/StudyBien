'use client';

import { useEffect, useRef, useState } from 'react';
import { VOICES, saveVoice, type VoiceId } from './voices';
import { currentVoice, setVoice, speak } from './speak';

const SAMPLE = '¡Hola! Soy Plumi. ¿Te gusta mi voz?';

/** "🔊 Escuchar ▾" — opens a list of Plumi's voices; picking one plays a sample. */
export function VoicePicker() {
  const [open, setOpen] = useState(false);
  const [voice, setVoiceState] = useState<VoiceId>('mx-f');
  const [playing, setPlaying] = useState<VoiceId | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setVoiceState(currentVoice()); }, []);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  function choose(id: VoiceId) {
    setVoice(id); saveVoice(id); setVoiceState(id); setPlaying(id);
    speak(SAMPLE, { onEnd: () => setPlaying(null) });
  }

  const current = VOICES.find((v) => v.id === voice)!;
  return (
    <div ref={ref} className="relative mt-1 inline-block">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="listbox"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-bold text-primary hover:bg-primary-tint">
        🔊 Escuchar <span className="font-normal text-ink-muted">· {current.flag} {current.name}</span> <span aria-hidden>▾</span>
      </button>
      {open && (
        <div role="listbox" aria-label="Plumi’s voice"
             className="absolute left-0 top-full z-30 mt-1 w-72 rounded-2xl border border-rule p-2 shadow-xl" style={{ background: '#F5FBFF' }}>
          <p className="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-ink-muted">Choose Plumi’s voice</p>
          {VOICES.map((v) => (
            <button key={v.id} role="option" aria-selected={v.id === voice} onClick={() => choose(v.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${v.id === voice ? 'bg-primary text-paper' : 'hover:bg-primary-tint'}`}>
              <span className="text-xl" aria-hidden>{v.flag}</span>
              <span className="flex-1">
                <span className="block font-bold">{v.name}</span>
                <span className={`block text-xs ${v.id === voice ? 'text-paper/85' : 'text-ink-muted'}`}>{v.label}</span>
              </span>
              <span aria-hidden className="text-lg">{playing === v.id ? '🔊' : v.id === voice ? '✓' : '▶'}</span>
            </button>
          ))}
          <p className="px-2 pt-2 text-[11px] text-ink-muted">Free open-source voices (Piper). Your choice is remembered on this device.</p>
        </div>
      )}
    </div>
  );
}
