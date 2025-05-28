import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import RouterScrollToTop from './components/RouterScrollToTop';
import { CartProvider } from './contexts/CartContext';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ScentsPage from './pages/ScentsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <RouterScrollToTop />
      <CartProvider>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/scents" element={<ScentsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
