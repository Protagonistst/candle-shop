import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../../shared/types';
import { useProducts } from './ProductsContext';

// The cart only stores product ids and quantities. Names, prices and stock
// always come from the latest catalog, and the API re-prices at checkout.

interface StoredLine {
  productId: number;
  quantity: number;
}

export interface CartLine extends StoredLine {
  product: Product;
}

interface CartState {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'amber_glow_cart_v2';
const MAX_PER_ITEM = 20;

const CartContext = createContext<CartState | undefined>(undefined);

function readStorage(): StoredLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredLine[]) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => Number.isInteger(l.productId) && l.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, loading } = useProducts();
  const [stored, setStored] = useState<StoredLine[]>(readStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable: cart still works for this session */
    }
  }, [stored]);

  // Drop lines whose product disappeared from the catalog.
  useEffect(() => {
    if (loading || products.length === 0) return;
    setStored((prev) => prev.filter((l) => products.some((p) => p.id === l.productId)));
  }, [loading, products]);

  const lines = useMemo(
    () =>
      stored.flatMap((l) => {
        const product = products.find((p) => p.id === l.productId);
        return product ? [{ ...l, product }] : [];
      }),
    [stored, products],
  );

  const clamp = (product: Product, qty: number) => Math.max(0, Math.min(qty, product.stock, MAX_PER_ITEM));

  const value: CartState = {
    lines,
    itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((s, l) => s + l.product.price * l.quantity, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addToCart: (product, quantity = 1) => {
      setStored((prev) => {
        const existing = prev.find((l) => l.productId === product.id);
        const next = clamp(product, (existing?.quantity ?? 0) + quantity);
        if (next === 0) return prev;
        return existing
          ? prev.map((l) => (l.productId === product.id ? { ...l, quantity: next } : l))
          : [...prev, { productId: product.id, quantity: next }];
      });
      setIsOpen(true);
    },
    updateQuantity: (productId, quantity) => {
      const product = products.find((p) => p.id === productId);
      setStored((prev) =>
        quantity <= 0 || !product
          ? prev.filter((l) => l.productId !== productId)
          : prev.map((l) => (l.productId === productId ? { ...l, quantity: Math.max(1, clamp(product, quantity)) } : l)),
      );
    },
    removeFromCart: (productId) => setStored((prev) => prev.filter((l) => l.productId !== productId)),
    clearCart: () => setStored([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
