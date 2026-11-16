import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';
import Footer from './Footer';
import Header from './Header';
import SeoManager from './SeoManager';

const Layout = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(location.pathname);
  const previousHash = useRef<string | null>(null);
  const positions = useRef(new Map<string, { left: number; top: number }>());

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useLayoutEffect(() => {
    const changedPage = previousPath.current !== location.pathname;
    const changedAnchor = previousHash.current !== location.hash;
    const saved = positions.current.get(location.key);
    const frame = requestAnimationFrame(() => {
      let target: HTMLElement | null = null;
      try { target = location.hash && !location.hash.startsWith('#pc-') ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch { /* Ignore malformed incoming anchors. */ }
      if (navigationType === 'POP' && saved) window.scrollTo({ ...saved, behavior: 'auto' });
      else if (target && (changedPage || changedAnchor)) target.scrollIntoView();
      else if (changedPage) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (changedPage && !target) document.getElementById('main-content')?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
      previousHash.current = location.hash;
    });
    const remember = () => {
      positions.current.set(location.key, { left: window.scrollX, top: window.scrollY });
      if (positions.current.size > 100) positions.current.delete(positions.current.keys().next().value as string);
    };
    window.addEventListener('scroll', remember, { passive: true });
    return () => { remember(); window.removeEventListener('scroll', remember); cancelAnimationFrame(frame); };
  }, [location.key, location.pathname, location.hash, navigationType]);

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
