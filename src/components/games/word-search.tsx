'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GameTheme } from './game-words';

const SIZE = 12;
const FILL = 'ABCDEFGHIJLMNOPRSTUVÑ';
type Cell = [number, number];
type Placed = { word: string; display: string; hint: string; cells: Cell[] };

/** Word-search letters: uppercase, accents dropped (Ñ kept), no spaces. */
function clean(w: string): string {
  return w.toUpperCase().replace(/Ñ/g, '\u0000').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\u0000/g, 'Ñ').replace(/[^A-ZÑ]/g, '');
}

function build(theme: GameTheme, hard: boolean): { grid: string[][]; placed: Placed[] } {
  const dirs: Cell[] = hard
    ? [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]]
    : [[0, 1], [1, 0], [1, 1]];
  const grid: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  const placed: Placed[] = [];
  const pool = theme.words
    .map((w) => ({ ...w, letters: clean(w.word) }))
    .filter((w) => w.letters.length >= 3 && w.letters.length <= SIZE)
    .sort(() => Math.random() - 0.5);

  for (const w of pool) {
    if (placed.length >= 10) break;
    for (let attempt = 0; attempt < 200; attempt++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const r0 = Math.floor(Math.random() * SIZE);
      const c0 = Math.floor(Math.random() * SIZE);
      const cells: Cell[] = [...w.letters].map((_, i) => [r0 + dr * i, c0 + dc * i]);
      const fits = cells.every(([r, c], i) =>
        r >= 0 && c >= 0 && r < SIZE && c < SIZE && (grid[r][c] === '' || grid[r][c] === w.letters[i]));
      if (!fits) continue;
      cells.forEach(([r, c], i) => { grid[r][c] = w.letters[i]; });
      placed.push({ word: w.letters, display: w.word, hint: w.hint, cells });
      break;
    }
  }
  for (const row of grid) for (let c = 0; c < SIZE; c++) if (!row[c]) row[c] = FILL[Math.floor(Math.random() * FILL.length)];
  return { grid, placed };
}

const key = ([r, c]: Cell) => `${r},${c}`;

export function WordSearch({ theme }: { theme: GameTheme }) {
  const [hard, setHard] = useState(false);
  const [puzzle, setPuzzle] = useState<{ grid: string[][]; placed: Placed[] } | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<Cell | null>(null);
  const [showHints, setShowHints] = useState(false);

  const newPuzzle = useCallback(() => {
    setPuzzle(build(theme, hard)); setFound(new Set()); setStart(null);
  }, [theme, hard]);
  useEffect(() => { newPuzzle(); }, [newPuzzle]);

  const foundCells = useMemo(() => {
    const s = new Set<string>();
    puzzle?.placed.filter((p) => found.has(p.word)).forEach((p) => p.cells.forEach((c) => s.add(key(c))));
    return s;
  }, [puzzle, found]);

  if (!puzzle) return <p className="text-ink-muted">Building your puzzle…</p>;

  function click(cell: Cell) {
    if (!start) { setStart(cell); return; }
    const [r0, c0] = start; const [r1, c1] = cell;
    setStart(null);
    const dr = Math.sign(r1 - r0); const dc = Math.sign(c1 - c0);
    const len = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0)) + 1;
    if (!(r0 === r1 || c0 === c1 || Math.abs(r1 - r0) === Math.abs(c1 - c0))) return;
    const path = Array.from({ length: len }, (_, i) => key([r0 + dr * i, c0 + dc * i]));
    for (const p of puzzle!.placed) {
      const cells = p.cells.map(key);
      if (cells.length === path.length && (cells.join() === path.join() || [...cells].reverse().join() === path.join())) {
        setFound((f) => new Set(f).add(p.word));
      }
    }
  }

  const done = found.size === puzzle.placed.length;
  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div>
        <div className="inline-grid select-none gap-1 rounded-[var(--radius-md)] border border-rule bg-paper p-2"
             style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
             role="grid" aria-label="Word search grid">
          {puzzle.grid.map((row, r) => row.map((ch, c) => {
            const k = key([r, c]);
            const isStart = start && key(start) === k;
            return (
              <button key={k} onClick={() => click([r, c])}
                      className={`grid h-7 w-7 place-items-center rounded text-sm font-bold sm:h-9 sm:w-9 sm:text-base ${
                        isStart ? 'bg-primary text-paper' : foundCells.has(k) ? 'bg-teal/40' : 'hover:bg-primary-tint'
                      }`}>
                {ch}
              </button>
            );
          }))}
        </div>
        <p className="mt-2 max-w-sm text-xs text-ink-muted">Click the first letter of a word, then its last letter.</p>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={newPuzzle} className="rounded-lg bg-primary px-4 py-2 font-bold text-paper hover:bg-primary-hover">New puzzle</button>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hard} onChange={(e) => setHard(e.target.checked)} className="accent-[var(--color-primary)]" />
            Difícil (backwards and diagonal words)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showHints} onChange={(e) => setShowHints(e.target.checked)} className="accent-[var(--color-primary)]" />
            Show English only (harder)
          </label>
        </div>
        <p className="mt-4 font-bold">{found.size} / {puzzle.placed.length} found</p>
        {done && <p className="mt-2 rounded-lg bg-teal/15 p-3 font-bold">¡Lo encontraste todo! 🎉</p>}
        <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {puzzle.placed.map((p) => (
            <li key={p.word} className={found.has(p.word) ? 'text-ink-muted line-through' : ''}>
              {showHints && !found.has(p.word) ? <span>{p.hint}</span> : <><strong>{p.display}</strong> <span className="text-sm text-ink-muted">({p.hint})</span></>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
