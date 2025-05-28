import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

interface CartButtonProps {
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const { itemCount } = useCart();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 text-amber-800 hover:text-amber-700 transition-colors"
      onClick={onClick}
      aria-label="Shopping cart"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </motion.button>
  );
};

export default CartButton; 