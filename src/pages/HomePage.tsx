import HeroSection from '../sections/HeroSection';
import ProductsSection from '../sections/ProductsSection';
import ScentsSection from '../sections/ScentsSection';
import AboutSection from '../sections/AboutSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const HomePage = () => {
  useDocumentTitle();
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <ScentsSection />
      <AboutSection />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;
