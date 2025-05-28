import { motion } from 'framer-motion';

const scents = [
  {
    id: 1,
    name: 'Vanilla',
    description: 'Warm, comforting and sweet with subtle hints of amber and caramel.',
    icon: '🍦',
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
  },
  {
    id: 2,
    name: 'Lavender',
    description: 'Floral, calming, and soothing with notes of herb and light woodiness.',
    icon: '💜',
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
  },
  {
    id: 3,
    name: 'Eucalyptus',
    description: 'Fresh, invigorating, and clarifying with a clean, minty undertone.',
    icon: '🌿',
    color: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
  },
  {
    id: 4,
    name: 'Cinnamon Spice',
    description: 'Warm, spicy, and robust with hints of clove and sweet undertones.',
    icon: '🌶️',
    color: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
  },
];

const ScentsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="scents" className="section bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">Signature Scents</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our candles feature carefully curated scents, each designed to create a unique atmosphere in your space.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {scents.map((scent) => (
            <motion.div
              key={scent.id}
              variants={itemVariants}
              className={`${scent.color} border ${scent.borderColor} rounded-lg p-6 text-center transition-transform hover:scale-105`}
            >
              <div className="text-4xl mb-4">{scent.icon}</div>
              <h3 className={`text-xl font-playfair font-medium mb-2 ${scent.textColor}`}>{scent.name}</h3>
              <p className="text-gray-600 text-sm">{scent.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ScentsSection; 