import { Menu, Phone, X } from 'lucide-react';
import { type MouseEvent, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Products', to: '/products' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavIntent = (to: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false);

    if (location.pathname !== to) {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMobileMenuOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`site-header fixed left-1/2 z-50 w-[calc(100%-0.75rem)] -translate-x-1/2 transition-all duration-300 sm:w-[calc(100%-1rem)] ${
        isScrolled ? 'max-w-5xl' : 'max-w-6xl'
      }`}
    >
      <div
        className={`nav-shell border border-white/40 bg-white/95 shadow-xl transition-all duration-300 ${
          isScrolled ? 'rounded-2xl py-2.5 sm:py-3' : 'rounded-[1.4rem] py-3 sm:rounded-3xl sm:py-4'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={handleNavIntent('/')} className="group flex items-center" aria-label="Go to the top of the home page">
              <img
                src="/ChatGPT Image Jun 9, 2025, 12_57_49 PM.png"
                alt="Upgrade Gaming PCs LLC"
                className={`w-auto transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02] ${
                  isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-10'
                }`}
              />
            </Link>

            <nav className="hidden space-x-6 lg:flex xl:space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleNavIntent(item.to)}
                  className={({ isActive }) =>
                    `relative font-medium transition-colors group ${
                      isActive ? 'text-purple-700' : 'text-gray-700 hover:text-purple-600'
                    }`
                  }
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                      location.pathname === item.to ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/contact"
                className="action-link hidden items-center space-x-2 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-purple-700 md:flex"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Get a Free Quote</span>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-xl bg-gray-100 p-2.5 transition-colors hover:bg-gray-200 active:bg-gray-200 lg:hidden"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
                type="button"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>

          <div className={`nav-drawer ${isMobileMenuOpen ? 'open mt-4 border-t border-gray-200 pt-4' : 'mt-0 border-t-0 pt-0'} lg:hidden`}>
            <div className="pb-1">
              <nav className="flex flex-col space-y-2.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={handleNavIntent(item.to)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="action-link mt-1 inline-flex items-center justify-center space-x-2 rounded-xl bg-purple-600 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-purple-700 md:hidden"
                >
                  <Phone className="h-4 w-4" />
                  <span>Get a Free Quote</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
