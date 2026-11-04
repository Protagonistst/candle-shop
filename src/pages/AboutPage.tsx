import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, HandHeart, Leaf, Users } from 'lucide-react';
import { PageHeader } from '../components/ui';
import { useDocumentTitle } from '../lib/useDocumentTitle';

// Fictional team for the demo brand. Initials stand in for portraits.
const team = [
  {
    name: 'Emma Johnson',
    role: 'Founder and candle maker',
    bio: 'Emma poured the first Amber & Glow candle on her kitchen stove in 2018 and still tests every new blend herself.',
    tone: 'bg-ember-light text-ember',
  },
  {
    name: 'Michael Chen',
    role: 'Head of production',
    bio: 'Fifteen years in perfumery and small-batch production. Michael is the reason every wick burns straight.',
    tone: 'bg-parchment text-bark',
  },
  {
    name: 'Sarah Rodriguez',
    role: 'Creative director',
    bio: 'Sarah shapes everything you see, from the labels and the jars to the way a parcel feels when you open it.',
    tone: 'bg-[#E4E7D9] text-moss',
  },
];

const values = [
  {
    Icon: Leaf,
    title: 'Sustainability',
    text: 'Plastic-free packaging, reusable jars and carbon-neutral shipping. We would rather sell fewer candles than cut corners.',
  },
  {
    Icon: HandHeart,
    title: 'Craft',
    text: 'Every batch is poured by hand, cured for two weeks and burn-tested before a single jar leaves the workshop.',
  },
  {
    Icon: Eye,
    title: 'Transparency',
    text: 'We publish every ingredient on every label. If it goes into the wax, you can read about it.',
  },
  {
    Icon: Users,
    title: 'Community',
    text: 'Monthly pouring workshops in Portland and a share of every sale going to local arts programmes.',
  },
];

const timeline = [
  { year: '2018', text: 'First batch of 12 candles, poured in a home kitchen and sold to friends.' },
  { year: '2020', text: 'Moved into a small workshop and launched the online shop.' },
  { year: '2023', text: 'Switched to 100% plastic-free packaging and refillable jars.' },
  { year: 'Today', text: 'A team of six, eight signature scents and thousands of quiet evenings.' },
];

const AboutPage = () => {
  useDocumentTitle('Our story');
  return (
    <div className="pb-24">
      <div className="container-custom">
        <PageHeader eyebrow="Our story" title="A candle should make a room feel calmer">
          Amber &amp; Glow began in 2018 with a simple idea: make candles that turn ordinary spaces into places you want to stay.
        </PageHeader>
      </div>

      <section className="container-custom grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-light">From kitchen to workshop</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-bark/85">
            <p>
              What started as a hobby in Emma's kitchen grew quickly once friends and family fell for her candles and kept asking
              for more. Within two years the stove was replaced by a proper workshop.
            </p>
            <p>
              We still work the slow way. Small batches, traditional methods and materials we can trace. The team is bigger now,
              but every candle still passes through someone's hands before it reaches yours.
            </p>
          </div>
          <ol className="mt-10 space-y-5 border-l border-sand pl-6">
            {timeline.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-ember ring-4 ring-cream" />
                <p className="font-display text-lg">{t.year}</p>
                <p className="text-sm text-bark/75">{t.text}</p>
              </li>
            ))}
          </ol>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[2rem] shadow-lift"
        >
          <img src="/images/about1.jpg" alt="Wax being poured into a jar in the workshop" className="aspect-[4/5] w-full object-cover" loading="lazy" />
        </motion.div>
      </section>

      <section className="mt-24 bg-parchment/60 py-20">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-4xl font-light">What we care about</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, text }) => (
              <div key={title} className="card bg-white/80 p-7">
                <Icon className="h-6 w-6 text-ember" strokeWidth={1.6} />
                <h3 className="mt-5 text-2xl font-normal">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bark/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom mt-24">
        <h2 className="mb-12 text-center text-4xl font-light">The people behind the glow</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="card p-8 text-center">
              <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full font-display text-3xl ${m.tone}`}>
                {m.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <h3 className="mt-5 text-2xl font-normal">{m.name}</h3>
              <p className="text-sm font-medium text-ember">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-bark/80">{m.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/shop" className="btn-primary px-8 py-3.5">
            Shop the collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
