'use client';

import { useState } from 'react';

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button"
            onClick={async () => { await navigator.clipboard.writeText(text.startsWith('/') ? `${location.origin}${text}` : text); setDone(true); setTimeout(() => setDone(false), 1500); }}
            className="rounded-lg border border-paper/60 px-3 py-1.5 text-sm font-bold text-paper hover:bg-paper/10">
      {done ? 'Copied ✓' : label}
    </button>
  );
}
