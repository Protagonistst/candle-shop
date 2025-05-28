import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="pt-24 pb-16 bg-cream min-h-screen flex items-center justify-center">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <h1 className="text-6xl font-playfair font-bold text-cinnamon mb-4">404</h1>
          <h2 className="text-2xl font-medium text-amber-800 mb-6">Page Not Found</h2>
          <p className="text-amber-700 mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link 
            to="/"
            className="inline-block bg-amber-700 hover:bg-amber-800 text-white py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage; 