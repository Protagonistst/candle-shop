import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CartButton from './CartButton';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and cart when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    
    // Force scroll to top when navigating through navbar
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Scents', path: '/scents' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Click handler for nav links to ensure scroll reset
  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container-custom flex justify-between items-center">
          <Link to="/" className="text-2xl font-playfair font-semibold text-cinnamon" onClick={handleNavClick}>
            Amber & Glow
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8 mr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors duration-300 ${
                    isActive(link.path)
                      ? 'text-amber-900 font-medium'
                      : 'text-amber-800 hover:text-amber-600'
                  }`}
                  onClick={handleNavClick}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <CartButton onClick={() => setIsCartOpen(true)} />
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center md:hidden">
            <CartButton onClick={() => setIsCartOpen(true)} />
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 text-amber-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-cream/95 backdrop-blur-sm"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors duration-300 ${
                    isActive(link.path)
                      ? 'text-amber-900 font-medium'
                      : 'text-amber-800 hover:text-amber-600'
                  }`}
                  onClick={handleNavClick}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar; 