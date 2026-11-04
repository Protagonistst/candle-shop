import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const stats = [
  { value: '50+ hrs', label: 'Clean burn time' },
  { value: '100%', label: 'Natural soy wax' },
  { value: 'Small', label: 'Batches of 48' },
];

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="container-custom grid items-center gap-12 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-12 lg:gap-8">
      <motion.div
        className="lg:col-span-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className="eyebrow mb-5">Hand-poured in Portland</p>
        <h1 className="text-balance text-5xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">
          Light something <em className="font-normal italic text-ember">slow.</em>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-bark/80">
          Soy candles made in small batches with cotton wicks and fragrance blends we spend months getting right. Made to
          turn an ordinary evening into a quiet one.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/shop" className="btn-primary px-7 py-3.5">
            Shop the collection <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/scents" className="btn-outline px-7 py-3.5">
            Find your scent
          </Link>
        </div>
        <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-sand pt-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-2xl">{s.value}</dd>
              <dd className="mt-1 text-xs text-smoke">{s.label}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <motion.div
        className="relative lg:col-span-6"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="relative ml-auto aspect-[4/5] max-w-lg overflow-hidden rounded-[2rem] bg-[#2b1e15] shadow-lift">
          <img
            src="/images/about1.jpg"
            alt="A candle maker pouring wax into a glass jar"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
        </div>

        <Link
          to="/shop/forest-pine"
          className="absolute -bottom-6 left-0 flex w-64 items-center gap-3 rounded-2xl border border-sand/80 bg-cream/95 p-3 shadow-lift backdrop-blur transition-transform hover:-translate-y-1 sm:left-6 lg:-left-6"
        >
          <img src="/images/candle6.jpg" alt="" className="h-16 w-14 rounded-xl object-cover" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ember">Bestseller</p>
            <p className="font-display text-lg leading-tight">Forest Pine</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-smoke">
              <Star className="h-3 w-3 fill-honey text-honey" /> 4.9 from 276 reviews
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
