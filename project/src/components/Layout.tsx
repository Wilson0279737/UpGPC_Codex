import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import SeoManager from './SeoManager';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const revealedElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (!revealedElements.length) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealedElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      revealedElements.forEach((element) => element.classList.add('is-visible'));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SeoManager />
      <Header />
      <main className="relative">
        <div key={location.pathname} className="page-shell">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
