import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../../shared/types';
import { api, errorMessage } from '../lib/api';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  bySlug: (slug: string) => Product | undefined;
  byId: (id: number) => Product | undefined;
}

const ProductsContext = createContext<ProductsState | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    api<{ products: Product[] }>('/products')
      .then((d) => setProducts(d.products))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  const value: ProductsState = {
    products,
    loading,
    error,
    reload,
    bySlug: (slug) => products.find((p) => p.slug === slug),
    byId: (id) => products.find((p) => p.id === id),
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
