import { Archive, ArrowRight, ChevronLeft, ChevronRight, Laptop, Monitor, Search, X } from 'lucide-react';
import { useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { formatPcPrice, soldInventory, type ListedProduct } from '../config/inventory';
import { searchSoldProducts } from '../lib/inventory.mjs';
import ProductDetailsDialog from './ProductDetailsDialog';
import SectionHeader from './ui/SectionHeader';
import './sold-pcs.css';

const pageSize = 12;

export default function SoldProductInventory() {
  const [params] = useSearchParams();
  const query = params.get('sold-q') || '';
  const formFactor = ['desktop', 'laptop'].includes(params.get('sold-type') || '') ? params.get('sold-type')! : 'all';
  const sort = ['price-low', 'price-high'].includes(params.get('sold-sort') || '') ? params.get('sold-sort')! : 'title';
  const pageValue = Number(params.get('sold-page'));
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue - 1 : 0;
  const resultsRef = useRef<HTMLParagraphElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedId = params.get('pc') || (location.hash.startsWith('#pc-') ? location.hash.slice(4) : '');
  const selected = soldInventory.find(pc => pc.id === selectedId);
  const openDetails = (pc: ListedProduct) => {
    const next = new URLSearchParams(params);
    next.set('pc', pc.id);
    void navigate({ search: next.toString(), hash: location.hash }, { state: { pcDialog: true }, preventScrollReset: true });
  };
  const closeDetails = () => {
    if (location.state?.pcDialog) { void navigate(-1); return; }
    const next = new URLSearchParams(params);
    next.delete('pc');
    void navigate({ search: next.toString(), hash: location.hash.startsWith('#pc-') ? '#sold-pcs' : location.hash }, { replace: true, preventScrollReset: true });
  };
  const updateFilter = (key: string, value: string, defaultValue = '') => {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(key); else next.set(key, value);
    next.delete('sold-page');
    void navigate({ search: next.toString(), hash: location.hash }, { replace: true, preventScrollReset: true });
  };
  const products = searchSoldProducts(soldInventory, { query, formFactor, sort });
  const pages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const start = currentPage * pageSize;
  const visible = products.slice(start, start + pageSize);
  const filtered = Boolean(query || formFactor !== 'all' || sort !== 'title');

  if (!soldInventory.length) return null;
  const reset = () => {
    const next = new URLSearchParams(params);
    ['sold-q', 'sold-type', 'sold-sort', 'sold-page'].forEach(key => next.delete(key));
    void navigate({ search: next.toString(), hash: location.hash }, { replace: true, preventScrollReset: true });
  };
  const changePage = (page: number) => {
    const next = new URLSearchParams(params);
    if (page > 0) next.set('sold-page', String(page + 1)); else next.delete('sold-page');
    void navigate({ search: next.toString(), hash: location.hash }, { preventScrollReset: true });
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ block: 'start' });
  };

  return <section className="sold-section relative scroll-mt-28 py-10 sm:py-14" aria-labelledby="sold-pcs-title">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="sold-heading-row">
        <SectionHeader titleId="sold-pcs-title" eyebrow="A look at our past PCs" title="Sold PCs" description="Explore gaming systems from our Marketplace history. These PCs are already sold—use them as inspiration, then ask us about a similar setup." />
        <span className="sold-total"><Archive size={17} aria-hidden="true" />{soldInventory.length} sold {soldInventory.length === 1 ? 'listing' : 'listings'}</span>
      </div>
      <div className="sold-notice"><span className="pc-stock pc-stock--sold"><Archive size={13} aria-hidden="true" />Sold archive</span><p>These systems are no longer available. Prices show the last advertised amount, which may differ from the final sale price.</p><a href="#inventory">Shop available PCs<ArrowRight size={15} aria-hidden="true" /></a></div>
      <div className="sold-toolbar">
        <label className="inventory-search"><span className="sr-only">Search sold PCs</span><Search size={19} aria-hidden="true" /><input type="search" value={query} onChange={event => updateFilter('sold-q', event.target.value)} placeholder="Search a PC name, processor, or graphics card" />{query && <button type="button" aria-label="Clear sold PC search" onClick={() => updateFilter('sold-q', '')}><X size={17} aria-hidden="true" /></button>}</label>
        <label className="inventory-sort"><span>System</span><select value={formFactor} onChange={event => updateFilter('sold-type', event.target.value, 'all')}><option value="all">All systems</option><option value="desktop">Desktops</option><option value="laptop">Gaming laptops</option></select></label>
        <label className="inventory-sort"><span>Sort by</span><select value={sort} onChange={event => updateFilter('sold-sort', event.target.value, 'title')}><option value="title">Name: A to Z</option><option value="price-low">Last price: low to high</option><option value="price-high">Last price: high to low</option></select></label>
      </div>
      <div className="sold-results-row"><p ref={resultsRef} tabIndex={-1} role="status">{products.length ? `Showing ${start + 1}–${Math.min(start + pageSize, products.length)} of ${products.length} sold ${products.length === 1 ? 'listing' : 'listings'}` : 'No sold PCs match these filters.'}</p>{filtered && <button type="button" onClick={reset}>Reset sold filters</button>}</div>
      {visible.length ? <div className="sold-grid">{visible.map(product => {
        const TypeIcon = product.formFactor === 'laptop' ? Laptop : Monitor;
        return <article id={`pc-${product.id}`} key={product.id} className="sold-card" aria-labelledby={`sold-title-${product.id}`}>
          <button type="button" className="sold-photo" aria-label={`View sold PC details for ${product.title}`} onClick={() => openDetails(product)}>{product.image ? <img src={product.image} alt={product.imageAlt || product.title} width="261" height="261" loading="lazy" decoding="async" /> : <Monitor size={48} aria-hidden="true" />}<span className="pc-stock pc-stock--sold"><Archive size={12} aria-hidden="true" />Sold</span></button>
          <div className="sold-card-copy"><span className="sold-type"><TypeIcon size={13} aria-hidden="true" />{product.formFactor === 'laptop' ? 'Gaming laptop' : 'Desktop PC'}</span><h3 id={`sold-title-${product.id}`}><button type="button" onClick={() => openDetails(product)}>{product.title}</button></h3><p className="sold-price"><span>Last listed</span><strong>{typeof product.price === 'number' ? formatPcPrice(product.price) : 'Price not recorded'}</strong></p><button type="button" className="sold-details" onClick={() => openDetails(product)}>View sold PC<ArrowRight size={15} aria-hidden="true" /></button></div>
        </article>;
      })}</div> : <div className="inventory-empty"><Archive size={32} aria-hidden="true" /><h3>Try another name or specification.</h3><p>Clear your search to explore all of the sold PCs.</p><button type="button" className="pc-action pc-action--primary" onClick={reset}>Show all sold PCs</button></div>}
      {pages > 1 && <nav className="sold-pagination" aria-label="Sold PC pages"><button type="button" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}><ChevronLeft size={18} aria-hidden="true" />Previous</button><span>Page {currentPage + 1} of {pages}</span><button type="button" disabled={currentPage + 1 >= pages} onClick={() => changePage(currentPage + 1)}>Next<ChevronRight size={18} aria-hidden="true" /></button></nav>}
    </div>
    {selected && <ProductDetailsDialog key={selected.id} product={selected} onClose={closeDetails} />}
  </section>;
}
