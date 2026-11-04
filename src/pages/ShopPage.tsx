import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import type { ScentFamily } from '../../shared/types';
import { scentFamilies } from '../../shared/catalog';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { PageHeader } from '../components/ui';
import { useProducts } from '../contexts/ProductsContext';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Top rated' },
  { id: 'price-low', label: 'Price: low to high' },
  { id: 'price-high', label: 'Price: high to low' },
];

const ShopPage = () => {
  useDocumentTitle('Shop all candles');
  const { products, loading, error, reload } = useProducts();
  const [params, setParams] = useSearchParams();
  const family = (params.get('family') ?? 'all') as ScentFamily | 'all';
  const sort = params.get('sort') ?? 'featured';
  const query = params.get('q') ?? '';

  const update = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value === fallback || value === '') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (family === 'all' || p.family === family) &&
        (!q || [p.name, p.tagline, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ').toLowerCase().includes(q)),
    );
    const sorted = [...list];
    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return sorted;
  }, [products, family, sort, query]);

  return (
    <div className="container-custom pb-24">
      <PageHeader eyebrow="The collection" title="Every candle, hand-poured">
        Eight signature scents in 8 oz reusable glass. Natural soy wax, cotton wicks, 45 to 55 hours of burn time.
      </PageHeader>

      <div className="-mx-4 mb-10 border-y border-sand/70 bg-white/50 px-4 py-3 sm:mx-0 sm:rounded-2xl sm:border">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {[{ id: 'all', name: 'All' }, ...scentFamilies].map((f) => (
              <button
                key={f.id}
                onClick={() => update('family', f.id, 'all')}
                className={`chip shrink-0 ${
                  family === f.id ? 'bg-espresso text-cream' : 'bg-white text-bark hover:bg-parchment'
                }`}
                aria-pressed={family === f.id}
              >
                {f.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-56 lg:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
              <input
                type="search"
                value={query}
                onChange={(e) => update('q', e.target.value, '')}
                placeholder="Search scents"
                aria-label="Search candles"
                className="w-full rounded-full border border-sand bg-white py-2 pl-10 pr-4 text-sm focus:border-ember focus:outline-none"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => update('sort', e.target.value, 'featured')}
              aria-label="Sort products"
              className="rounded-full border border-sand bg-white px-4 py-2 text-sm text-bark focus:border-ember focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="card mx-auto max-w-md p-8 text-center">
          <p className="text-bark">{error}</p>
          <button onClick={reload} className="btn-primary mt-4">
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-2xl">No candles match that search.</p>
          <button
            onClick={() => setParams({}, { replace: true })}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-ember hover:underline"
          >
            <X className="h-4 w-4" /> Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-smoke" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'candle' : 'candles'}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;
