import { Archive, ArrowRight, ChevronLeft, ChevronRight, Laptop, Monitor, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { formatPcPrice, soldInventory, type ListedProduct } from '../config/inventory';
import { searchSoldProducts } from '../lib/inventory.mjs';
import ProductDetailsDialog from './ProductDetailsDialog';
import SectionHeader from './ui/SectionHeader';
import './sold-pcs.css';

const pageSize = 12;

export default function SoldProductInventory() {
  const [query, setQuery] = useState('');
  const [formFactor, setFormFactor] = useState('all');
  const [sort, setSort] = useState('title');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<ListedProduct | null>(null);
  const resultsRef = useRef<HTMLParagraphElement>(null);
  const location = useLocation();
  const closeDetails = useCallback(() => setSelected(null), []);
  const products = searchSoldProducts(soldInventory, { query, formFactor, sort });
  const pages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const start = currentPage * pageSize;
  const visible = products.slice(start, start + pageSize);
  const filtered = Boolean(query || formFactor !== 'all' || sort !== 'title');

  useEffect(() => {
    const match = soldInventory.find(pc => location.hash === `#pc-${pc.id}`);
    if (match) setSelected(match);
  }, [location.hash]);

  if (!soldInventory.length) return null;
  const reset = () => { setQuery(''); setFormFactor('all'); setSort('title'); setPage(0); };
  const changePage = (next: number) => { setPage(next); resultsRef.current?.focus(); };

  return <section id="sold-pcs" className="sold-section relative scroll-mt-28 py-10 sm:py-14" aria-labelledby="sold-pcs-title">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="sold-heading-row">
        <SectionHeader titleId="sold-pcs-title" eyebrow="A look at our past PCs" title="Sold PCs" description="Explore gaming systems from our Marketplace history. These PCs are already sold—use them as inspiration, then ask us about a similar setup." />
        <span className="sold-total"><Archive size={17} aria-hidden="true" />{soldInventory.length} sold {soldInventory.length === 1 ? 'listing' : 'listings'}</span>
      </div>
      <div className="sold-notice"><span className="pc-stock pc-stock--sold"><Archive size={13} aria-hidden="true" />Sold archive</span><p>These systems are no longer available. Prices show the last advertised amount, which may differ from the final sale price.</p><a href="#inventory">Shop available PCs<ArrowRight size={15} aria-hidden="true" /></a></div>
      <div className="sold-toolbar">
        <label className="inventory-search"><span className="sr-only">Search sold PCs</span><Search size={19} aria-hidden="true" /><input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Search a PC name, processor, or graphics card" />{query && <button type="button" aria-label="Clear sold PC search" onClick={() => { setQuery(''); setPage(0); }}><X size={17} aria-hidden="true" /></button>}</label>
        <label className="inventory-sort"><span>System</span><select value={formFactor} onChange={event => { setFormFactor(event.target.value); setPage(0); }}><option value="all">All systems</option><option value="desktop">Desktops</option><option value="laptop">Gaming laptops</option></select></label>
        <label className="inventory-sort"><span>Sort by</span><select value={sort} onChange={event => { setSort(event.target.value); setPage(0); }}><option value="title">Name: A to Z</option><option value="price-low">Last price: low to high</option><option value="price-high">Last price: high to low</option></select></label>
      </div>
      <div className="sold-results-row"><p ref={resultsRef} tabIndex={-1} role="status">{products.length ? `Showing ${start + 1}–${Math.min(start + pageSize, products.length)} of ${products.length} sold ${products.length === 1 ? 'listing' : 'listings'}` : 'No sold PCs match these filters.'}</p>{filtered && <button type="button" onClick={reset}>Reset sold filters</button>}</div>
      {visible.length ? <div className="sold-grid">{visible.map(product => {
        const TypeIcon = product.formFactor === 'laptop' ? Laptop : Monitor;
        return <article id={`pc-${product.id}`} key={product.id} className="sold-card" aria-labelledby={`sold-title-${product.id}`}>
          <button type="button" className="sold-photo" aria-label={`View sold PC details for ${product.title}`} onClick={() => setSelected(product)}>{product.image ? <img src={product.image} alt={product.imageAlt || product.title} width="261" height="261" loading="lazy" decoding="async" /> : <Monitor size={48} aria-hidden="true" />}<span className="pc-stock pc-stock--sold"><Archive size={12} aria-hidden="true" />Sold</span></button>
          <div className="sold-card-copy"><span className="sold-type"><TypeIcon size={13} aria-hidden="true" />{product.formFactor === 'laptop' ? 'Gaming laptop' : 'Desktop PC'}</span><h3 id={`sold-title-${product.id}`}><button type="button" onClick={() => setSelected(product)}>{product.title}</button></h3><p className="sold-price"><span>Last listed</span><strong>{typeof product.price === 'number' ? formatPcPrice(product.price) : 'Price not recorded'}</strong></p><button type="button" className="sold-details" onClick={() => setSelected(product)}>View sold PC<ArrowRight size={15} aria-hidden="true" /></button></div>
        </article>;
      })}</div> : <div className="inventory-empty"><Archive size={32} aria-hidden="true" /><h3>Try another name or specification.</h3><p>Clear your search to explore all of the sold PCs.</p><button type="button" className="pc-action pc-action--primary" onClick={reset}>Show all sold PCs</button></div>}
      {pages > 1 && <nav className="sold-pagination" aria-label="Sold PC pages"><button type="button" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}><ChevronLeft size={18} aria-hidden="true" />Previous</button><span>Page {currentPage + 1} of {pages}</span><button type="button" disabled={currentPage + 1 >= pages} onClick={() => changePage(currentPage + 1)}>Next<ChevronRight size={18} aria-hidden="true" /></button></nav>}
    </div>
    {selected && <ProductDetailsDialog product={selected} onClose={closeDetails} />}
  </section>;
}
