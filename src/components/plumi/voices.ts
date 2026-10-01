/**
 * Plumi's voices. Each is a free, open-source Piper voice whose licence allows
 * commercial use; clips live in public/voice/<id>/. See public/voice/LICENSE.md.
 */
export type VoiceId = 'mx-f' | 'es-f' | 'mx-m' | 'es-m';
export type VoiceOption = { id: VoiceId; name: string; label: string; flag: string; model: string; speaker?: number };

export const VOICES: VoiceOption[] = [
  { id: 'mx-f', name: 'Sofía', label: 'Mexican · female', flag: '🇲🇽', model: 'es_MX-claude-high' },
  { id: 'es-f', name: 'Lucía', label: 'Spain · female', flag: '🇪🇸', model: 'es_ES-sharvard-medium', speaker: 1 },
  { id: 'mx-m', name: 'Diego', label: 'Mexican · male', flag: '🇲🇽', model: 'es_MX-ald-medium' },
  { id: 'es-m', name: 'Javier', label: 'Spain · male', flag: '🇪🇸', model: 'es_ES-sharvard-medium', speaker: 0 },
];

export const DEFAULT_VOICE: VoiceId = 'mx-f';
const KEY = 'studybien.plumi.voice';

export function savedVoice(): VoiceId {
  try {
    const v = localStorage.getItem(KEY);
    return (VOICES.some((x) => x.id === v) ? v : DEFAULT_VOICE) as VoiceId;
  } catch {
    return DEFAULT_VOICE;
  }
}

export function saveVoice(id: VoiceId): void {
  try { localStorage.setItem(KEY, id); } catch { /* ignore */ }
}
