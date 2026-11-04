import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { scentFamilies } from '../../shared/catalog';
import { familyIcons } from '../components/Icons';

const ScentsSection = () => (
  <section className="section">
    <div className="container-custom">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="eyebrow mb-3">Six scent families</p>
        <h2 className="text-balance text-4xl font-light md:text-5xl">Choose by feeling, not by name</h2>
        <p className="mt-4 text-bark/75">
          Every candle belongs to a family. Start with the mood you want in the room and the right scent follows.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {scentFamilies.map((family, i) => {
          const Icon = familyIcons[family.id];
          return (
            <motion.div
              key={family.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/shop?family=${family.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sand/70 bg-white/60 p-5 transition-all hover:-translate-y-0.5 hover:border-ember/40 hover:bg-white hover:shadow-soft md:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-light text-ember">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-smoke transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" />
                </div>
                <h3 className="mt-6 text-2xl font-normal">{family.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bark/75">{family.description}</p>
                <p className="mt-4 hidden text-xs text-smoke sm:block">{family.notes.join(' / ')}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default ScentsSection;
