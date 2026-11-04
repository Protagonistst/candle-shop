import { Minus, Plus, Star } from 'lucide-react';
import type { ReactNode } from 'react';

export function Rating({ value, count, size = 'sm' }: { value: number; count?: number; size?: 'sm' | 'md' }) {
  const px = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className="flex text-honey">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`${px} ${i < Math.round(value) ? 'fill-current' : 'fill-none opacity-40'}`} strokeWidth={1.5} />
        ))}
      </div>
      <span className="text-xs text-smoke">
        {value.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}

export function QuantityStepper({
  value,
  onChange,
  max,
  size = 'md',
  label = 'Quantity',
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  const pad = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  return (
    <div className="inline-flex items-center rounded-full border border-sand bg-white" role="group" aria-label={label}>
      <button
        type="button"
        className={`${pad} flex items-center justify-center rounded-full text-bark transition-colors hover:bg-parchment disabled:opacity-40`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={`min-w-7 text-center font-medium tabular-nums ${size === 'sm' ? 'text-sm' : ''}`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${pad} flex items-center justify-center rounded-full text-bark transition-colors hover:bg-parchment disabled:opacity-40`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl pb-10 pt-12 text-center md:pb-14 md:pt-16">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-balance text-4xl font-light md:text-5xl">{title}</h1>
      {children && <div className="mt-4 text-base leading-relaxed text-bark/80 md:text-lg">{children}</div>}
    </div>
  );
}

export function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function StockNote({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-sm font-medium text-red-700">Sold out</span>;
  if (stock < 10) return <span className="text-sm font-medium text-ember">Only {stock} left</span>;
  return <span className="text-sm text-moss">In stock, ships in 1 to 2 days</span>;
}
