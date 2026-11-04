import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { useProducts } from '../contexts/ProductsContext';

const ProductsSection = () => {
  const { products, loading, error } = useProducts();
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="section bg-parchment/60">
      <div className="container-custom">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-3">Most loved</p>
            <h2 className="text-4xl font-light md:text-5xl">The house favourites</h2>
          </div>
          <Link to="/shop" className="group inline-flex items-center gap-2 text-sm font-medium text-espresso">
            View all candles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {error ? (
          <p className="rounded-2xl bg-white/70 p-6 text-center text-bark">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
