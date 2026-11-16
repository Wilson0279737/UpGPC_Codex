import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResponsiveImage from './ui/ResponsiveImage';
import { siteConfig } from '../config/site';
export default function Footer() {
  return <footer className="studio-footer"><div className="studio-wrap">
    <div className="studio-footer-top"><div><Link to="/" className="studio-footer-logo" aria-label="Upgrade Gaming PCs home"><ResponsiveImage src="/ChatGPT Image Jun 9, 2025, 12_57_49 PM.png" alt="Upgrade Gaming PCs" sizes="190px" loading="lazy" /></Link><p>Your local PC shop in Swartz Creek, Michigan.</p></div><nav aria-label="Footer navigation"><Link to="/products">Shop PCs</Link><Link to="/services">Repairs & upgrades</Link><Link to="/about">Our shop</Link><Link to="/contact">Visit & contact</Link></nav><div className="studio-footer-contact"><a href={siteConfig.phoneHref}>{siteConfig.phone}<ArrowUpRight size={16} aria-hidden="true" /></a><a href={siteConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">{siteConfig.streetAddress}<br />{siteConfig.city}, {siteConfig.state} {siteConfig.postalCode}</a><p>Call ahead to confirm current hours.</p></div></div>
    <div className="studio-footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><div><a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook ↗</a><a href={siteConfig.marketplaceUrl} target="_blank" rel="noopener noreferrer">Marketplace ↗</a><a href="/admin/">Owner workspace</a></div></div>
  </div></footer>;
}
