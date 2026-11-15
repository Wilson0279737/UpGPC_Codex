import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Footer from './Footer';
import Header from './Header';
import SeoManager from './SeoManager';

const Layout = () => {
  const location = useLocation();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let target: HTMLElement | null = null;
      try { target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch { /* Ignore malformed incoming anchors. */ }
      if (target) target.scrollIntoView();
      else window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (hasNavigated.current && !target) document.getElementById('main-content')?.focus({ preventScroll: true });
      hasNavigated.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

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
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SeoManager />
      <Header />
      <main id="main-content" tabIndex={-1} className="relative focus:outline-none">
        <div key={location.pathname} className="page-shell">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
