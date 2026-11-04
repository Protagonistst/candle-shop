import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, formatMoney } from '../../shared/pricing';
import { useCart } from '../contexts/CartContext';
import { QuantityStepper } from './ui';

const CartDrawer = () => {
  const { lines, subtotal, isOpen, closeCart, updateQuantity, removeFromCart, itemCount } = useCart();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  const goToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-espresso/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-lift outline-none"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
          >
            <div className="flex items-center justify-between border-b border-sand/70 px-6 py-5">
              <h2 className="text-2xl font-light">
                Your bag <span className="text-base text-smoke">({itemCount})</span>
              </h2>
              <button onClick={closeCart} className="rounded-full p-2 hover:bg-espresso/5" aria-label="Close bag">
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-parchment">
                  <ShoppingBag className="h-7 w-7 text-bark" strokeWidth={1.5} />
                </div>
                <p className="font-display text-xl">Your bag is empty</p>
                <p className="max-w-xs text-sm text-smoke">Find a scent you love and it will wait for you here.</p>
                <Link to="/shop" onClick={closeCart} className="btn-primary mt-2">
                  Browse the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-sand/70 px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-bark">
                    <Truck className="h-4 w-4 text-ember" />
                    {remaining > 0 ? (
                      <span>
                        Add <strong className="font-semibold">{formatMoney(remaining)}</strong> for free standard shipping
                      </span>
                    ) : (
                      <span>You have unlocked free standard shipping</span>
                    )}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand/70">
                    <div className="h-full rounded-full bg-ember transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-sand/70 overflow-y-auto px-6">
                  {lines.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-4 py-5">
                      <Link
                        to={`/shop/${product.slug}`}
                        onClick={closeCart}
                        className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#2b1e15]"
                      >
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-display text-lg leading-tight">{product.name}</p>
                            <p className="mt-0.5 text-xs text-smoke">{product.size}</p>
                          </div>
                          <p className="text-sm font-medium tabular-nums">{formatMoney(product.price * quantity)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <QuantityStepper
                            size="sm"
                            value={quantity}
                            max={Math.min(product.stock, 20)}
                            onChange={(v) => updateQuantity(product.id, v)}
                            label={`Quantity of ${product.name}`}
                          />
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="rounded-full p-2 text-smoke transition-colors hover:bg-red-50 hover:text-red-700"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-sand/70 bg-parchment/50 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-bark">Subtotal</span>
                    <span className="font-display text-2xl tabular-nums">{formatMoney(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-smoke">Shipping, taxes and promo codes are applied at checkout.</p>
                  <button onClick={goToCheckout} className="btn-accent mt-4 w-full py-3.5 text-base">
                    Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                  <button onClick={closeCart} className="mt-2 w-full py-2 text-sm text-bark hover:text-espresso">
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
