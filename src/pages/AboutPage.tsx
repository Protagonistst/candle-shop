import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ImageWithFallback';

const teamMembers = [
  {
    id: 1,
    name: 'Emma Johnson',
    role: 'Founder & Artisan',
    bio: 'With a passion for natural fragrances and sustainable living, Emma founded Amber & Glow to share her love of handcrafted candles with the world.',
    image: '/images/team-member-1.jpg',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Master Candle Maker',
    bio: 'Michael brings over 15 years of experience in candle making and perfumery, ensuring that each Amber & Glow candle meets our exacting standards of quality.',
    image: '/images/team-member-2.jpg',
  },
  {
    id: 3,
    name: 'Sarah Rodriguez',
    role: 'Creative Director',
    bio: 'Sarah\'s eye for design and creativity drives our brand aesthetic, from packaging design to our online presence and retail experiences.',
    image: '/images/team-member-3.jpg',
  },
];

const values = [
  {
    id: 'sustainability',
    title: 'Sustainability',
    description: 'We\'re committed to minimizing our environmental impact through sustainable sourcing, plastic-free packaging, and carbon-neutral shipping.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.3 15a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    ),
  },
  {
    id: 'quality',
    title: 'Quality Craftsmanship',
    description: 'Every candle is hand-poured in small batches using premium sustainable soy wax, cotton wicks, and the finest fragrance oils.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
      </svg>
    ),
  },
  {
    id: 'transparency',
    title: 'Transparency',
    description: 'We believe in complete honesty about our ingredients, processes, and business practices to build trust with our community.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    id: 'community',
    title: 'Community',
    description: 'We\'re proud to support local communities through charitable partnerships, employment opportunities, and educational workshops.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const AboutPage = () => {
  return (
    <div className="pt-24 pb-16 bg-cream min-h-screen">
      <div className="container-custom">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-playfair font-bold text-cinnamon mb-4">Our Story</h1>
          <p className="text-amber-800 max-w-3xl mx-auto text-lg">
            Founded in 2018, Amber & Glow began with a simple passion: creating beautifully scented candles 
            that transform ordinary spaces into extraordinary experiences.
          </p>
        </motion.div>

        {/* Company Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-playfair font-bold text-cinnamon mb-6">From Kitchen to Workshop</h2>
            <p className="text-gray-700 mb-4">
              What began as a hobby in Emma's kitchen quickly grew into something more as friends and family 
              fell in love with her handcrafted candles and encouraged her to share her creations with a wider audience.
            </p>
            <p className="text-gray-700 mb-4">
              Today, our dedicated team of artisans creates our signature candles in our workshop using traditional 
              methods and sustainable materials, but the passion and attention to detail remains the same.
            </p>
            <p className="text-gray-700">
              Each Amber & Glow candle is a labor of love, designed to create moments of joy, calm, and connection 
              in homes around the world.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-xl"
          >
            <ImageWithFallback
              src="/images/workshop.jpg"
              alt="Our candle workshop"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>
        </div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-playfair font-bold text-cinnamon mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md flex"
              >
                <div className="mr-5 text-amber-700">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-800 mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Meet Our Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-playfair font-bold text-cinnamon mb-12 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 