import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Footer from './Footer';
import Header from './Header';
import SeoManager from './SeoManager';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (location.hash) {
      // A malformed percent escape in an incoming URL must not break navigation.
      try {
        const id = decodeURIComponent(location.hash.slice(1));
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView();
        } else if (location.pathname === '/' && ['services', 'products', 'about', 'contact'].includes(id)) {
          // Keep links from the former one-page site useful.
          navigate(`/${id}`, { replace: true });
        }
      } catch {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    } else if (previousPath.current !== location.pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.hash, navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SeoManager />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />
      <main id="main-content" tabIndex={-1} className="relative">
        <div key={location.pathname} className="page-shell">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
