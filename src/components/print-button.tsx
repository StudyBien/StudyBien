'use client';

export function PrintButton({ label = 'Print' }: { label?: string }) {
  return (
    <button onClick={() => window.print()}
            className="rounded-lg border border-rule bg-paper px-4 py-2 font-bold text-ink hover:border-primary">
      🖨 {label}
    </button>
  );
}
