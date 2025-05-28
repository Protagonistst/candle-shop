import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ImageWithFallback';

// Sample scent data
const scentsData = [
  {
    id: 'floral',
    name: 'Floral',
    description: 'Delicate and feminine aromas reminiscent of fresh flowers in bloom',
    benefits: 'Promotes relaxation, reduces anxiety, and enhances mood',
    popularScents: ['Lavender', 'Rose', 'Jasmine', 'Cherry Blossom'],
    image: '/images/floral.png',
    backgroundColor: 'bg-pink-50',
    textColor: 'text-pink-800',
    accentColor: 'bg-pink-200',
  },
  {
    id: 'woody',
    name: 'Woody',
    description: 'Rich and earthy fragrances inspired by forests and natural landscapes',
    benefits: 'Grounds emotions, promotes focus, and creates a sense of comfort',
    popularScents: ['Sandalwood', 'Cedar', 'Pine', 'Patchouli'],
    image: '/images/woody.png',
    backgroundColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    accentColor: 'bg-amber-200',
  },
  {
    id: 'citrus',
    name: 'Citrus',
    description: 'Bright and invigorating scents that uplift and energize',
    benefits: 'Boosts mood, increases energy, and enhances mental clarity',
    popularScents: ['Lemon', 'Orange', 'Grapefruit', 'Bergamot'],
    image: '/images/citrus.png',
    backgroundColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    accentColor: 'bg-yellow-200',
  },
  {
    id: 'spicy',
    name: 'Spicy',
    description: 'Warm and complex aromas that create a cozy, inviting atmosphere',
    benefits: 'Stimulates the senses, improves circulation, and creates warmth',
    popularScents: ['Cinnamon', 'Clove', 'Nutmeg', 'Cardamom'],
    image: '/images/spicy.png',
    backgroundColor: 'bg-red-50',
    textColor: 'text-red-800',
    accentColor: 'bg-red-200',
  },
  {
    id: 'fresh',
    name: 'Fresh',
    description: 'Clean and crisp scents reminiscent of pure air and fresh linens',
    benefits: 'Clears the mind, reduces stress, and creates a clean environment',
    popularScents: ['Ocean Breeze', 'Linen', 'Cucumber', 'Rain'],
    image: '/images/fresh.png',
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    accentColor: 'bg-blue-200',
  },
  {
    id: 'gourmand',
    name: 'Gourmand',
    description: 'Sweet and delicious aromas inspired by desserts and baked goods',
    benefits: 'Evokes nostalgia, creates comfort, and stimulates the appetite',
    popularScents: ['Vanilla', 'Caramel', 'Chocolate', 'Coffee'],
    image: '/images/gourmand.png',
    backgroundColor: 'bg-brown-50',
    textColor: 'text-amber-900',
    accentColor: 'bg-amber-300',
  },
];

const ScentsPage = () => {
  const [activeScent, setActiveScent] = useState(scentsData[0]);

  return (
    <div className="pt-24 pb-16 bg-cream min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-playfair font-bold text-cinnamon mb-4">Our Scent Families</h1>
          <p className="text-amber-800 max-w-2xl mx-auto">
            Explore our carefully curated collection of scent families, each designed to create a unique atmosphere and evoke different emotions.
          </p>
        </motion.div>

        {/* Scent Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8 justify-center">
          {scentsData.map((scent) => (
            <button
              key={scent.id}
              onClick={() => setActiveScent(scent)}
              className={`px-6 py-3 mx-2 rounded-t-lg font-medium transition-colors duration-300 border-b-4 ${
                activeScent.id === scent.id
                  ? `${scent.textColor} border-current ${scent.backgroundColor}`
                  : 'text-amber-700 border-transparent hover:bg-amber-50'
              }`}
            >
              {scent.name}
            </button>
          ))}
        </div>

        {/* Active Scent Display */}
        <motion.div
          key={activeScent.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-8 shadow-lg overflow-hidden ${activeScent.backgroundColor}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-3xl font-playfair font-bold mb-4 ${activeScent.textColor}`}>
                {activeScent.name} Scents
              </h2>
              <p className="text-gray-700 mb-6">{activeScent.description}</p>
              
              <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${activeScent.textColor}`}>Benefits</h3>
                <p className="text-gray-700">{activeScent.benefits}</p>
              </div>
              
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${activeScent.textColor}`}>Popular {activeScent.name} Scents</h3>
                <div className="flex flex-wrap gap-2">
                  {activeScent.popularScents.map((scent, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm ${activeScent.accentColor} ${activeScent.textColor}`}
                    >
                      {scent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative h-80 rounded-xl overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <ImageWithFallback
                src={activeScent.image}
                alt={`${activeScent.name} scents`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Scent Education */}
        <div className="mt-16">
          <h2 className="text-3xl font-playfair font-bold text-cinnamon mb-6 text-center">The Science of Scent</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-bold text-amber-800 mb-4">Aromatherapy Benefits</h3>
              <p className="text-gray-700">
                Scents directly affect your brain's limbic system, which controls emotions and memories, 
                creating powerful psychological and physiological effects that can improve wellbeing.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-bold text-amber-800 mb-4">Our Sourcing Promise</h3>
              <p className="text-gray-700">
                We source the highest quality essential oils and fragrance components from 
                sustainable suppliers who practice ethical farming and harvesting methods.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-bold text-amber-800 mb-4">Scent Layering</h3>
              <p className="text-gray-700">
                Experiment with combining different scent families to create your own unique 
                atmosphere. Try pairing complementary scents like citrus with floral or woody with spicy.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScentsPage; 