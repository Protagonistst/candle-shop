import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Leaf, Package, Ruler, ShieldCheck, Truck } from 'lucide-react';
import { familyName } from '../../shared/catalog';
import { FREE_SHIPPING_THRESHOLD, formatMoney } from '../../shared/pricing';
import ProductCard from '../components/ProductCard';
import { familyIcons } from '../components/Icons';
import { QuantityStepper, Rating, Spinner, StockNote } from '../components/ui';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import NotFoundPage from './NotFoundPage';

const ProductPage = () => {
  const { slug = '' } = useParams();
  const { bySlug, products, loading } = useProducts();
  const { addToCart, lines } = useCart();
  const product = bySlug(slug);
  const [qty, setQty] = useState(1);
  useDocumentTitle(product?.name ?? 'Candle');

  useEffect(() => setQty(1), [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ember">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (!product) return <NotFoundPage />;

  const inBag = lines.find((l) => l.productId === product.id)?.quantity ?? 0;
  const maxAddable = Math.max(0, Math.min(product.stock, 20) - inBag);
  const FamilyIcon = familyIcons[product.family];
  const related = products.filter((p) => p.id !== product.id && p.family === product.family);
  const more = [...related, ...products.filter((p) => p.id !== product.id && p.family !== product.family)].slice(0, 4);

  return (
    <div className="pb-24">
      <div className="container-custom pt-6">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-smoke hover:text-espresso">
          <ChevronLeft className="h-4 w-4" /> All candles
        </Link>
      </div>

      <div className="container-custom mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <div className="overflow-hidden rounded-[2rem] bg-[#2b1e15]">
            <img src={product.image} alt={`${product.name} candle in a glass jar`} className="aspect-[3/4] w-full object-cover" />
          </div>
        </motion.div>

        <div className="lg:py-6">
          <Link
            to={`/shop?family=${product.family}`}
            className="inline-flex items-center gap-2 rounded-full bg-ember-light px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ember"
          >
            <FamilyIcon className="h-3.5 w-3.5" /> {familyName(product.family)}
          </Link>
          <h1 className="mt-4 text-5xl font-light leading-tight">{product.name}</h1>
          <p className="mt-2 font-display text-xl italic text-bark/80">{product.tagline}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-medium tabular-nums">{formatMoney(product.price)}</span>
            <Rating value={product.rating} count={product.reviewCount} size="md" />
          </div>

          <p className="mt-6 leading-relaxed text-bark/85">{product.description}</p>

          <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-sand/80 bg-white/60 p-5">
            {(['top', 'heart', 'base'] as const).map((tier) => (
              <div key={tier}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-smoke">{tier} notes</p>
                <ul className="mt-2 space-y-0.5 text-sm">
                  {product.notes[tier].map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <StockNote stock={product.stock} />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {maxAddable > 0 && <QuantityStepper value={Math.min(qty, maxAddable)} onChange={setQty} max={maxAddable} />}
              <button
                className="btn-accent flex-1 py-3.5 text-base sm:flex-none sm:px-10"
                disabled={maxAddable === 0}
                onClick={() => {
                  addToCart(product, Math.min(qty, maxAddable));
                  setQty(1);
                }}
              >
                {product.stock === 0
                  ? 'Sold out'
                  : maxAddable === 0
                    ? 'Maximum in your bag'
                    : `Add to bag, ${formatMoney(product.price * Math.min(qty, maxAddable))}`}
              </button>
            </div>
            {inBag > 0 && <p className="mt-2 text-xs text-smoke">{inBag} already in your bag</p>}
          </div>

          <ul className="mt-8 space-y-3 border-t border-sand pt-6 text-sm text-bark">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-ember" /> Free standard shipping on orders over {formatMoney(FREE_SHIPPING_THRESHOLD)}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-ember" /> {product.burnTime} burn time
            </li>
            <li className="flex items-center gap-3">
              <Ruler className="h-4 w-4 text-ember" /> {product.size}, reusable glass jar
            </li>
            <li className="flex items-center gap-3">
              <Leaf className="h-4 w-4 text-ember" /> Natural soy wax, cotton wick, phthalate-free fragrance
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-ember" /> 30-day happiness guarantee
            </li>
          </ul>

          <details className="group mt-6 rounded-2xl border border-sand/80 bg-white/60 p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-ember" /> Candle care
              </span>
              <span className="text-smoke transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-bark/80">
              On the first burn, let the wax melt all the way to the edge (about 2 to 3 hours) to prevent tunnelling. Trim the
              wick to 5 mm before each light, never burn for more than 4 hours at a time, and stop when 1 cm of wax remains.
            </p>
          </details>
        </div>
      </div>

      {more.length > 0 && (
        <section className="container-custom mt-24">
          <h2 className="mb-8 text-3xl font-light md:text-4xl">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {more.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
