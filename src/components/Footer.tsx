import { Link } from 'react-router-dom';
import { InstagramIcon, LogoMark, PinterestIcon, TikTokIcon } from './Icons';
import NewsletterForm from './NewsletterForm';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All candles', to: '/shop' },
      { label: 'New arrivals', to: '/shop?sort=newest' },
      { label: 'Scent families', to: '/scents' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track an order', to: '/track' },
      { label: 'Contact us', to: '/contact' },
      { label: 'Our story', to: '/about' },
    ],
  },
];

const Footer = () => (
  <footer className="bg-espresso text-cream/80">
    <div className="container-custom grid gap-12 py-16 md:grid-cols-12">
      <div className="md:col-span-5">
        <Link to="/" className="flex items-center gap-2 text-cream">
          <LogoMark />
          <span className="font-display text-2xl">Amber &amp; Glow</span>
        </Link>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/65">
          Small-batch soy candles, hand-poured in Portland. Slow to make, slow to burn, made to turn a room into a refuge.
        </p>
        <div className="mt-6 flex gap-3">
          {[
            { Icon: InstagramIcon, label: 'Instagram' },
            { Icon: PinterestIcon, label: 'Pinterest' },
            { Icon: TikTokIcon, label: 'TikTok' },
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-honey hover:text-honey"
              aria-label={`${label} (demo link)`}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {columns.map((col) => (
        <div key={col.title} className="md:col-span-2">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-honey">{col.title}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {col.links.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-cream/70 transition-colors hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="md:col-span-3">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-honey">The Glow Letter</h3>
        <p className="mb-4 mt-4 text-sm text-cream/65">New scents, restocks and 10% off your first order.</p>
        <NewsletterForm tone="dark" />
      </div>
    </div>

    <div className="border-t border-cream/10">
      <div className="container-custom flex flex-col gap-2 py-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Amber &amp; Glow. A fictional brand built as a portfolio demo.</p>
        <Link to="/admin" className="hover:text-cream/80">
          Store admin
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
