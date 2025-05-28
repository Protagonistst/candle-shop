import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1603006905393-c79cdd06f3e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-transparent"></div>
      
      <div className="container-custom relative z-10 mt-20 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl text-white"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold mb-4 text-white">
            Handcrafted Candles for Every Moment
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Transform your space with our artisanal candles, carefully crafted with premium natural ingredients for a warm, inviting glow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/shop"
                className="btn btn-primary text-center inline-block"
              >
                Shop Now
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/about"
                className="btn btn-outline border-white text-white hover:bg-white/10 text-center inline-block"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 