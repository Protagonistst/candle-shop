import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Flame, HandHeart, Recycle } from 'lucide-react';

const pillars = [
  { Icon: HandHeart, title: 'Hand-poured', text: 'Every jar is poured, wicked and labelled by hand in batches of 48.' },
  { Icon: Droplets, title: 'Clean ingredients', text: 'Natural soy wax and phthalate-free fragrance oils. Nothing else.' },
  { Icon: Flame, title: 'Even, quiet burn', text: 'Cotton wicks tested for a steady flame and a full melt pool.' },
  { Icon: Recycle, title: 'Made to be reused', text: 'Reusable glass jars and plastic-free, recyclable packaging.' },
];

const AboutSection = () => (
  <section className="section bg-espresso text-cream">
    <div className="container-custom grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="grid grid-cols-2 gap-4">
          <img src="/images/woody.jpg" alt="A lit amber candle beside pine cones" className="aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" />
          <img src="/images/floral.jpg" alt="A candle surrounded by roses and cherry blossom" className="mt-12 aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" />
        </div>
        <blockquote className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl bg-cream p-5 text-center font-display text-lg italic text-espresso shadow-lift">
          "Crafting moments of calm, one candle at a time."
        </blockquote>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pt-8 lg:pt-0"
      >
        <p className="eyebrow mb-4 text-honey">Our story</p>
        <h2 className="text-balance text-4xl font-light text-cream md:text-5xl">From a kitchen stove to a small workshop</h2>
        <p className="mt-6 leading-relaxed text-cream/70">
          Amber &amp; Glow started in 2018 with a double boiler, a box of jars and a stubborn idea: a candle should make a room
          feel calmer, not louder. Today a small team pours every candle by hand, but the method has not changed.
        </p>
        <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {pillars.map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-5 w-5 text-honey" strokeWidth={1.6} />
              <h3 className="mt-3 font-sans text-sm font-semibold text-cream">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-cream/60">{text}</p>
            </div>
          ))}
        </div>
        <Link to="/about" className="btn mt-10 border border-cream/25 text-cream hover:bg-cream hover:text-espresso">
          Read the full story
        </Link>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
