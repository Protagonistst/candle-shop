import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/productData';

const ProductsSection = () => {
  // Get featured products for homepage display (limit to 4)
  const featuredProducts = products
    .filter(product => product.isFeatured)
    .slice(0, 4);

  return (
    <section id="products" className="section bg-cream">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">Our Handcrafted Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each candle is carefully crafted with premium natural ingredients and essential oils to create the perfect ambiance for your space.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/shop" className="btn btn-outline inline-block">
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection; 