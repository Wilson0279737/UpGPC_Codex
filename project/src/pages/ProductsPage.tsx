import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { soldInventory } from '../config/inventory';
import ProductInventory from '../components/ProductInventory';
import SoldProductInventory from '../components/SoldProductInventory';
import '../components/product-cards.css';

export default function ProductsPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const selectedId = params.get('pc') || (location.hash.startsWith('#pc-') ? location.hash.slice(4) : '');
  const selectedSoldId = soldInventory.some(pc => selectedId === pc.id) ? selectedId : '';
  const soldParameters = ['sold-q', 'sold-type', 'sold-sort', 'sold-page'].map(key => params.get(key));
  const soldFiltersKey = JSON.stringify(soldParameters);
  const hasSoldFilters = soldParameters.some(value => value !== null);
  const previousArchiveIntent = useRef<{ hash: string; selectedSoldId: string; soldFiltersKey: string } | null>(null);
  useEffect(() => {
    const previous = previousArchiveIntent.current;
    previousArchiveIntent.current = { hash: location.hash, selectedSoldId, soldFiltersKey };
    const newArchiveAnchor = location.hash === '#sold-pcs' && previous?.hash !== location.hash;
    const newSoldSelection = Boolean(selectedSoldId) && previous?.selectedSoldId !== selectedSoldId;
    const changedSoldFilters = hasSoldFilters && (!previous || previous.soldFiltersKey !== soldFiltersKey);
    // Restore archive links and history without reopening a user-collapsed archive
    // when only current-stock search, budget, or sorting changes.
    if (newArchiveAnchor || newSoldSelection || changedSoldFilters) setArchiveOpen(true);
  }, [location.hash, selectedSoldId, soldFiltersKey, hasSoldFilters]);
  return <>
    <section className="studio-page-intro studio-container">
      <span className="studio-eyebrow">The showroom, online</span>
      <div className="shop-intro-row"><div><h1>Find your next PC.</h1><p>Explore the specs. Find your fit. Try it in our Swartz Creek showroom before you decide.</p></div><a className="shop-archive-link" href="#sold-pcs" onClick={() => setArchiveOpen(true)}>View sold PCs<ArrowDown size={17} aria-hidden="true" /></a></div>
    </section>
    <ProductInventory />
    {soldInventory.length > 0 && <div className="studio-archive-wrap studio-container">
      <details id="sold-pcs" className="studio-archive" open={archiveOpen} onToggle={event => setArchiveOpen(event.currentTarget.open)}>
        <summary><span><span className="studio-eyebrow">The archive</span><strong>Previously sold PCs</strong><span>Explore {soldInventory.length} sold systems for inspiration. These PCs are no longer available.</span></span><ArrowDown size={22} aria-hidden="true" /></summary>
        {archiveOpen && <SoldProductInventory />}
      </details>
    </div>}
  </>;
}
