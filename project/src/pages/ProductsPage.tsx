import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { soldInventory } from '../config/inventory';
import { siteConfig } from '../config/site';
import ProductInventory from '../components/ProductInventory';
import SoldProductInventory from '../components/SoldProductInventory';
import '../components/product-cards.css';

export default function ProductsPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const [archiveOpen, setArchiveOpen] = useState(false);
  useEffect(() => {
    const selectedId = params.get('pc') || (location.hash.startsWith('#pc-') ? location.hash.slice(4) : '');
    if (location.hash === '#sold-pcs' || soldInventory.some(pc => selectedId === pc.id) || ['sold-q', 'sold-type', 'sold-sort', 'sold-page'].some(key => params.has(key))) setArchiveOpen(true);
  }, [location.hash, params]);
  return <>
    <section className="studio-page-intro studio-container">
      <span className="studio-eyebrow">The showroom, online</span>
      <div className="shop-intro-row"><div><h1>Find your next PC.</h1><p>Explore the specs. Find your fit. Try it in our Swartz Creek showroom before you decide.</p></div><a className="shop-archive-link" href="#sold-pcs" onClick={() => setArchiveOpen(true)}>Explore past builds<ArrowDown size={17} aria-hidden="true" /></a></div>
    </section>
    <ProductInventory />
    {soldInventory.length > 0 && <div className="studio-archive-wrap studio-container">
      <details className="studio-archive" open={archiveOpen} onToggle={event => setArchiveOpen(event.currentTarget.open)}>
        <summary><span><span className="studio-eyebrow">The archive</span><strong>Good PCs. New homes.</strong><span>Explore {soldInventory.length} previously sold systems. For inspiration, not current stock.</span></span><ArrowDown size={22} aria-hidden="true" /></summary>
        {archiveOpen && <SoldProductInventory />}
      </details>
    </div>}
    <div className="studio-container shop-help"><p>A budget, a favorite game, or a PC to trade in?<br /><strong>Start with a conversation.</strong></p><a href={siteConfig.phoneHref}>Call {siteConfig.phone}<ArrowUpRight size={18} aria-hidden="true" /></a></div>
  </>;
}
