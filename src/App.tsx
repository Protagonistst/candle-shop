import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import RouterScrollToTop from './components/RouterScrollToTop';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';

import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import OrderPage from './pages/OrderPage';
import ProductPage from './pages/ProductPage';
import ScentsPage from './pages/ScentsPage';
import ShopPage from './pages/ShopPage';
import TrackOrderPage from './pages/TrackOrderPage';

function Layout() {
  const { pathname } = useLocation();
  const minimalFooter = pathname.startsWith('/admin');
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductPage />} />
          <Route path="/scents" element={<ScentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!minimalFooter && <Footer />}
      <CartDrawer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <Router>
      <RouterScrollToTop />
      <ProductsProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </ProductsProvider>
    </Router>
  );
}

export default App;
