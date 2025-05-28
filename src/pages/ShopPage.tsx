import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/productData';

const ShopPage = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(false);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter and sort products when category or sort option changes
  useEffect(() => {
    // Don't show loading state on initial load to prevent jump
    if (!isInitialLoad) {
      setIsLoading(true);
    }
    
    // Filter products based on category
    const filtered = activeCategory === 'all' 
      ? products 
      : products.filter(product => product.category === activeCategory);
    
    // Sort products
    let sorted = [...filtered];
    switch(sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted = sorted.filter(p => p.isNew).concat(sorted.filter(p => !p.isNew));
        break;
      case 'featured':
      default:
        sorted = sorted.filter(p => p.isFeatured).concat(sorted.filter(p => !p.isFeatured));
        break;
    }
    
    // Apply filters immediately to prevent delay
    setFilteredProducts(sorted);
    setIsLoading(false);
    
    // Scroll to top when filters change, not on initial load
    if (!isInitialLoad) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // After first load, set initial load to false
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [activeCategory, sortBy, isInitialLoad]);

  // Force scroll to top BEFORE the component renders
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    
    // Also set a timeout to ensure scroll position after everything has loaded
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-cream min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-playfair font-bold text-cinnamon mb-4">Our Collection</h1>
          <p className="text-amber-800 max-w-2xl mx-auto">
            Each candle is carefully crafted using premium soy wax and natural essential oils to create a unique sensory experience.
          </p>
        </motion.div>

        {/* Filter and Sort Controls */}
        <div id="filter-controls" className="sticky top-20 z-10 bg-cream pt-2 pb-4 border-b border-amber-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === category.id
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  } transition-colors duration-300`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-amber-200 text-amber-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid with improved height handling */}
        <div ref={productsContainerRef} className="mt-8 min-h-[600px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-amber-800 text-lg">No products found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Product count indicator */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </div>
      </div>
    </div>
  );
};

export default ShopPage; 