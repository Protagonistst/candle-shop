import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '../components/ImageWithFallback';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="pt-24 pb-16 bg-cream min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-playfair font-bold text-cinnamon mb-4">Contact Us</h1>
          <p className="text-amber-800 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products, 
            custom orders, or anything else, our team is here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white p-8 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-playfair font-bold text-cinnamon mb-6">Send Us a Message</h2>
            
            {formStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6"
              >
                <p className="font-medium">Thank you for your message!</p>
                <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-amber-800 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-amber-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-amber-800 mb-1">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:outline-none"
                  >
                    <option value="">Please select</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="wholesale">Wholesale Information</option>
                    <option value="custom">Custom Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-amber-800 mb-1">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:outline-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`px-6 py-3 bg-amber-700 text-white rounded-lg font-medium transition-colors ${
                    formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-800'
                  }`}
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-md mb-8">
              <h2 className="text-2xl font-playfair font-bold text-cinnamon mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-amber-700 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Visit Our Shop</h3>
                    <p className="text-gray-700">123 Candle Lane<br />Portland, OR 97205</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-amber-700 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Email Us</h3>
                    <p className="text-gray-700">info@amberandglow.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-amber-700 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Call Us</h3>
                    <p className="text-gray-700">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-amber-700 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Business Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 10am - 6pm<br />
                      Saturday: 10am - 4pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden h-64">
              <div className="relative h-full rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="/images/map.jpg"
                  alt="Store location map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-700 text-white px-4 py-2 rounded-lg shadow-lg">
                    Interactive map placeholder
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 