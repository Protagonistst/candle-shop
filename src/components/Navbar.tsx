import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import DemoBanner from './DemoBanner';
import { LogoMark } from './Icons';

const navLinks = [
  { name: 'Shop', path: '/shop' },
  { name: 'Scents', path: '/scents' },
  { name: 'Our Story', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Track Order', path: '/track' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-sm transition-colors ${
      isActive ? 'text-espresso after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-ember' : 'text-bark/80 hover:text-espresso'
    }`;

  return (
    <header className="sticky top-0 z-40">
      <DemoBanner />
      <nav
        className={`border-b transition-all duration-300 ${
          isScrolled || menuOpen ? 'border-sand/70 bg-cream/90 backdrop-blur-md' : 'border-transparent bg-cream'
        }`}
        aria-label="Main"
      >
        <div className="container-custom flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-espresso" aria-label="Amber and Glow home">
            <LogoMark />
            <span className="font-display text-xl font-medium tracking-tight">Amber &amp; Glow</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-full p-2.5 text-espresso transition-colors hover:bg-espresso/5"
              aria-label={`Open bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.7} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[11px] font-semibold text-cream"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-full p-2.5 text-espresso hover:bg-espresso/5 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden md:hidden"
            >
              <div className="container-custom flex flex-col gap-1 pb-5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-3 font-display text-lg ${isActive ? 'bg-parchment text-espresso' : 'text-bark'}`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
