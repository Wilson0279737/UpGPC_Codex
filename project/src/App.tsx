import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import NotFoundPage from './pages/NotFoundPage';

const AccountPage = lazy(() => import('./pages/AccountPage'));
const DirectShopPage = lazy(() => import('./pages/DirectShopPage'));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/shop" element={<Suspense fallback={<p role="status" className="studio-page studio-container">Opening the online shop…</p>}><DirectShopPage /></Suspense>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account" element={<Suspense fallback={<p role="status" className="mx-auto max-w-6xl px-6 py-32">Opening your account…</p>}><AccountPage /></Suspense>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
