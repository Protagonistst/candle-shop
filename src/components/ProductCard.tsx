import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import ImageWithFallback from './ImageWithFallback';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Ensure rating is a valid number or default to 0
  const rating = typeof product.rating === 'number' ? product.rating : 0;
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-50px' }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
    >
      <div className="h-64 bg-white overflow-hidden relative flex items-center justify-center p-4">
        <div className="relative w-full h-full flex items-center justify-center">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="w-full h-full absolute inset-0 bg-black/5 hover:bg-black/0 transition-all duration-300"></div>
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-amber-600 text-white px-2 py-1 text-xs rounded-md z-10">
            New
          </div>
        )}
        {product.stock < 10 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs rounded-md z-10">
            Limited Stock
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-playfair font-medium mb-2">{product.name}</h3>
        <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs mb-3">
          {product.category}
        </div>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : 'stroke-current fill-none'}`}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-amber-800">${product.price.toFixed(2)}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-lg transition-colors duration-300"
            onClick={handleAddToCart}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 