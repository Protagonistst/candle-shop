import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Brain, Layers, Sprout } from 'lucide-react';
import { scentFamilies } from '../../shared/catalog';
import { formatMoney } from '../../shared/pricing';
import { familyIcons } from '../components/Icons';
import { PageHeader } from '../components/ui';
import { useProducts } from '../contexts/ProductsContext';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const education = [
  {
    Icon: Brain,
    title: 'Scent and memory',
    text: 'Smell is processed close to the parts of the brain that handle emotion and memory, which is why one note can take you straight back to a place.',
  },
  {
    Icon: Sprout,
    title: 'How we source',
    text: 'Our fragrance oils are phthalate-free and blended with essential oils from suppliers who share their farming and harvesting practices with us.',
  },
  {
    Icon: Layers,
    title: 'Try layering',
    text: 'Burn two families in one room. Citrus lifts florals, and woody notes give spicy blends a calmer, deeper base.',
  },
];

const ScentsPage = () => {
  useDocumentTitle('Scent families');
  const [activeId, setActiveId] = useState(scentFamilies[0].id);
  const active = scentFamilies.find((f) => f.id === activeId)!;
  const { products } = useProducts();
  const matching = products.filter((p) => p.family === active.id);

  return (
    <div className="container-custom pb-24">
      <PageHeader eyebrow="Scent guide" title="Find the family that fits the room">
        Every Amber &amp; Glow candle belongs to one of six scent families. Pick a mood, and we will point you to the candles
        that match.
      </PageHeader>

      <div role="tablist" aria-label="Scent families" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:justify-center">
        {scentFamilies.map((f) => {
          const Icon = familyIcons[f.id];
          const selected = f.id === activeId;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(f.id)}
              className={`chip flex shrink-0 items-center gap-2 border ${
                selected ? 'border-espresso bg-espresso text-cream' : 'border-sand bg-white text-bark hover:border-espresso/40'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.6} /> {f.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid overflow-hidden rounded-[2rem] border border-sand/70 bg-white/70 shadow-soft md:grid-cols-2"
        >
          <img src={active.image} alt={`${active.name} candle styled with seasonal props`} className="h-72 w-full object-cover md:h-full" />
          <div className="p-8 md:p-12">
            <h2 className="text-4xl font-light">{active.name}</h2>
            <p className="mt-3 text-lg text-bark/85">{active.description}</p>
            <p className="mt-4 text-sm leading-relaxed text-smoke">{active.mood}</p>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-smoke">Signature notes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.notes.map((n) => (
                <span key={n} className="rounded-full bg-parchment px-3.5 py-1.5 text-sm text-bark">
                  {n}
                </span>
              ))}
            </div>

            {matching.length > 0 && (
              <>
                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-smoke">Candles in this family</p>
                <ul className="mt-3 divide-y divide-sand/70">
                  {matching.map((p) => (
                    <li key={p.id}>
                      <Link to={`/shop/${p.slug}`} className="group flex items-center gap-4 py-3">
                        <img src={p.image} alt="" className="h-14 w-12 rounded-lg object-cover" />
                        <span className="flex-1">
                          <span className="block font-display text-lg group-hover:text-ember">{p.name}</span>
                          <span className="text-xs text-smoke">{p.tagline}</span>
                        </span>
                        <span className="text-sm tabular-nums">{formatMoney(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Link to={`/shop?family=${active.id}`} className="btn-primary mt-8">
              Shop {active.name.toLowerCase()} candles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <section className="mt-24">
        <h2 className="mb-10 text-center text-4xl font-light">The science of scent</h2>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {education.map(({ Icon, title, text }) => (
            <div key={title} className="card p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-light text-ember">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-2xl font-normal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark/80">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ScentsPage;
