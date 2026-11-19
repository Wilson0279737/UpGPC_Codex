import { Menu, Phone, X, ArrowUpRight } from 'lucide-react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { directShopEnabled } from '../config/directShop';
import { siteConfig } from '../config/site';
import ResponsiveImage from './ui/ResponsiveImage';
import { usePageNavigation } from '../lib/navigation';
const routes = [
  { to: '/products', label: directShopEnabled ? 'Showroom PCs' : 'Shop PCs' },
  ...(directShopEnabled ? [{ to: '/shop', label: 'Shop online' }] : []),
  { to: '/services', label: 'Repairs & upgrades' },
  { to: '/about', label: 'Our shop' },
  { to: '/contact', label: 'Visit & contact' },
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigateToPage = usePageNavigation();
  const { user, googleEnabled } = useAuth();
  const items = user || googleEnabled ? [...routes, { to: '/account', label: user ? 'Saved PCs' : 'Sign in' }] : routes;
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    setOpen(false);
    navigateToPage(event, path);
  };
  useEffect(() => { setOpen(false); }, [location.pathname, location.search, location.hash]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', escape); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <header ref={headerRef} className="studio-header site-header nav-shell" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <div className="studio-wrap studio-header-row">
      <Link to="/" className="studio-brand" aria-label="Upgrade Gaming PCs home" onClick={event => handleNavigation(event, '/')}><ResponsiveImage src="/ChatGPT Image Jun 9, 2025, 12_57_49 PM.png" alt="Upgrade Gaming PCs" sizes="150px" /></Link>
      <nav className="studio-desktop-nav" aria-label="Main navigation">{items.map(item => <NavLink key={item.to} to={item.to} onClick={event => handleNavigation(event, item.to)}>{item.label}</NavLink>)}</nav>
      <div className="studio-header-actions"><a className="studio-header-call" href={siteConfig.phoneHref} aria-label={'Call the shop at ' + siteConfig.phone}><Phone size={15} aria-hidden="true" /><span>Talk to the shop</span><ArrowUpRight size={15} aria-hidden="true" /></a><button ref={buttonRef} type="button" className="studio-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button></div>
    </div>
    <nav id="mobile-navigation" className="studio-mobile-nav studio-wrap" aria-label="Mobile navigation" hidden={!open}>{items.map(item => <NavLink key={item.to} to={item.to} onClick={event => handleNavigation(event, item.to)}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></NavLink>)}</nav>
  </header>;
}
