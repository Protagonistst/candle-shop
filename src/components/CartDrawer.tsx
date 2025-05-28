import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import ImageWithFallback from './ImageWithFallback';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle checkout
  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here in a real e-commerce site.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair font-semibold text-amber-800">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-600 text-center">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-grow overflow-y-auto mb-4">
                    <ul className="space-y-4">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex border-b border-gray-100 pb-4">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.category}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-2 py-1">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="font-medium text-amber-700 hover:text-amber-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                      <p>Subtotal</p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Shipping and taxes calculated at checkout.</p>
                    <div className="space-y-2">
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-amber-700 text-white py-3 px-4 rounded-md hover:bg-amber-800 transition-colors"
                      >
                        Checkout
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full border border-amber-700 text-amber-700 py-3 px-4 rounded-md hover:bg-amber-50 transition-colors"
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={clearCart}
                        className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer; 