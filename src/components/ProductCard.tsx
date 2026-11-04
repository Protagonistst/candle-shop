import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Product } from '../../shared/types';
import { familyName } from '../../shared/catalog';
import { formatMoney } from '../../shared/pricing';
import { useCart } from '../contexts/CartContext';
import { Rating } from './ui';

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();
  const soldOut = product.stock === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
      className="group flex flex-col"
    >
      <Link
        to={`/shop/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#2b1e15]"
        aria-label={`${product.name}, ${formatMoney(product.price)}`}
      >
        <img
          src={product.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-espresso">New</span>}
          {soldOut ? (
            <span className="rounded-full bg-espresso px-2.5 py-1 text-[11px] font-semibold text-cream">Sold out</span>
          ) : (
            product.stock < 10 && (
              <span className="rounded-full bg-ember px-2.5 py-1 text-[11px] font-semibold text-cream">Only {product.stock} left</span>
            )
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-smoke">{familyName(product.family)}</p>
            <h3 className="mt-1 text-xl font-normal leading-snug">
              <Link to={`/shop/${product.slug}`} className="hover:text-ember">
                {product.name}
              </Link>
            </h3>
          </div>
          <p className="shrink-0 pt-4 font-medium tabular-nums">{formatMoney(product.price)}</p>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-bark/75">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <Rating value={product.rating} count={product.reviewCount} />
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={soldOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-espresso/20 px-3.5 py-2 text-xs font-medium text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-espresso"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] rounded-2xl bg-sand/60" />
    <div className="mt-4 h-3 w-16 rounded bg-sand/60" />
    <div className="mt-2 h-5 w-3/4 rounded bg-sand/60" />
    <div className="mt-2 h-3 w-full rounded bg-sand/50" />
  </div>
);

export default ProductCard;
