import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="section bg-amber-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src="/images/about1.png"
                alt="Handcrafting candles"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg w-48 hidden md:block">
              <p className="text-sm text-gray-600 italic">
                "Crafting moments of serenity, one candle at a time."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Founded in 2018, Amber & Glow began as a small home workshop with a mission to create candles that not only illuminated spaces but transformed them into sanctuaries of peace and comfort.
            </p>
            <p className="text-gray-700 mb-6">
              Each of our candles is hand-poured in small batches using premium soy wax, cotton wicks, and thoughtfully curated scent blends made from essential oils and fine fragrances.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-playfair font-medium mb-2 text-amber-700">Handmade</h3>
                <p className="text-sm text-gray-600">
                  Crafted with care in small batches for the highest quality.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-playfair font-medium mb-2 text-amber-700">Eco-friendly</h3>
                <p className="text-sm text-gray-600">
                  Sustainable materials and recyclable packaging.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-playfair font-medium mb-2 text-amber-700">Natural</h3>
                <p className="text-sm text-gray-600">
                  Premium soy wax and pure essential oils.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-playfair font-medium mb-2 text-amber-700">Slow-made</h3>
                <p className="text-sm text-gray-600">
                  Thoughtfully created with attention to detail.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 