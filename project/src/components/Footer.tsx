import { ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ResponsiveImage from './ui/ResponsiveImage';
import { siteConfig } from '../config/site';
import { returnToPageStart } from '../lib/navigation';
export default function Footer() {
  const location = useLocation();
  return <footer className="studio-footer"><div className="studio-wrap">
    <div className="studio-footer-top"><div><Link to="/" className="studio-footer-logo" aria-label="Upgrade Gaming PCs home" onClick={event => returnToPageStart(event, location.pathname, '/')}><ResponsiveImage src="/ChatGPT Image Jun 9, 2025, 12_57_49 PM.png" alt="Upgrade Gaming PCs" sizes="190px" loading="lazy" /></Link><p>Your local PC shop in Swartz Creek, Michigan.</p></div><nav aria-label="Footer navigation"><Link to="/products" onClick={event => returnToPageStart(event, location.pathname, '/products')}>Shop PCs</Link><Link to="/services" onClick={event => returnToPageStart(event, location.pathname, '/services')}>Repairs & upgrades</Link><Link to="/about" onClick={event => returnToPageStart(event, location.pathname, '/about')}>Our shop</Link><Link to="/contact" onClick={event => returnToPageStart(event, location.pathname, '/contact')}>Visit & contact</Link></nav><div className="studio-footer-contact"><a href={siteConfig.phoneHref}>{siteConfig.phone}<ArrowUpRight size={16} aria-hidden="true" /></a><a href={siteConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">{siteConfig.streetAddress}<br />{siteConfig.city}, {siteConfig.state} {siteConfig.postalCode}</a><p>Call ahead to confirm current hours.</p></div></div>
    <div className="studio-footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><div><a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook ↗</a><a href={siteConfig.marketplaceUrl} target="_blank" rel="noopener noreferrer">Marketplace ↗</a><a href="/admin/">Owner workspace</a></div></div>
  </div></footer>;
}
