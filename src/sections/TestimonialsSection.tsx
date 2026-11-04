import { Star } from 'lucide-react';
import NewsletterForm from '../components/NewsletterForm';

// Fictional reviews for the demo brand.
const reviews = [
  {
    quote: 'Forest Pine smells exactly like the walk to our cabin. I have reordered it three times now.',
    name: 'Maya H.',
    product: 'Forest Pine',
  },
  {
    quote: 'The burn is so even. No tunnelling, no soot, and the scent fills the whole living room.',
    name: 'Jonah P.',
    product: 'Vanilla Amber',
  },
  {
    quote: 'Lavender Dreams is on my nightstand permanently. It is the only thing that makes me put my phone down.',
    name: 'Priya R.',
    product: 'Lavender Dreams',
  },
];

const TestimonialsSection = () => (
  <>
    <section className="section">
      <div className="container-custom">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="eyebrow mb-3">Kind words</p>
          <h2 className="text-4xl font-light md:text-5xl">4.8 out of 5 from 1,500+ reviews</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {reviews.map((r) => (
            <figure key={r.name} className="card flex flex-col p-7">
              <div className="flex gap-0.5 text-honey" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 font-display text-xl font-light leading-snug">"{r.quote}"</blockquote>
              <figcaption className="mt-6 text-sm text-smoke">
                <span className="font-medium text-espresso">{r.name}</span> on {r.product}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>

    <section className="pb-20 md:pb-28">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-[2rem] bg-ember px-6 py-14 text-center text-cream md:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-honey/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-espresso/30 blur-3xl" />
          <div className="relative mx-auto max-w-lg">
            <h2 className="text-balance text-4xl font-light text-cream md:text-5xl">10% off your first order</h2>
            <p className="mt-4 text-cream/80">
              Join The Glow Letter for new scents and restock alerts. Or use code <strong className="font-semibold">GLOW10</strong> at
              checkout right now.
            </p>
            <div className="mx-auto mt-8 max-w-sm">
              <NewsletterForm tone="dark" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default TestimonialsSection;
