import { ArrowUpRight, Monitor, Search, SearchX, X } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { inventory, formatPcPrice, type ListedProduct } from '../config/inventory';
import { searchProducts } from '../lib/inventory.mjs';
import { siteConfig, siteContent } from '../config/site';
import ProductCard from './ProductCard';
import ProductDetailsDialog from './ProductDetailsDialog';

const availabilityOptions = ['all', 'available', 'reserved'];
const sortOptions = ['availability', 'price-low', 'price-high'];
const budgetOptions = ['all', '500', '1000', '1500', '2500'];

export default function ProductInventory() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = params.get('q') || '';
  const availability = availabilityOptions.includes(params.get('stock') || '') ? params.get('stock')! : 'all';
  const sort = sortOptions.includes(params.get('sort') || '') ? params.get('sort')! : 'availability';
  const budget = budgetOptions.includes(params.get('budget') || '') ? params.get('budget')! : 'all';
  const selectedId = params.get('pc') || (location.hash.startsWith('#pc-') ? location.hash.slice(4) : '');
  const selected = inventory.find(pc => selectedId === pc.id);
  const openDetails = (pc: ListedProduct) => {
    const next = new URLSearchParams(params);
    next.set('pc', pc.id);
    void navigate({ search: next.toString(), hash: location.hash }, { state: { pcDialog: true }, preventScrollReset: true });
  };
  const closeDetails = () => {
    if (location.state?.pcDialog) { void navigate(-1); return; }
    const next = new URLSearchParams(params);
    next.delete('pc');
    void navigate({ search: next.toString(), hash: location.hash.startsWith('#pc-') ? '#inventory' : location.hash }, { replace: true, preventScrollReset: true });
  };
  const products = searchProducts(inventory, { query, availability, sort }).filter(pc => budget === 'all' || (typeof pc.price === 'number' && pc.price <= Number(budget)));
  const filtered = Boolean(query || availability !== 'all' || sort !== 'availability' || budget !== 'all');
  const updateFilter = (key: string, value: string, defaultValue = 'all') => {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(key); else next.set(key, value);
    void navigate({ search: next.toString(), hash: location.hash }, { replace: true, preventScrollReset: true });
  };
  const resetFilters = () => {
    const next = new URLSearchParams(params);
    ['q', 'stock', 'sort', 'budget'].forEach(key => next.delete(key));
    void navigate({ search: next.toString(), hash: location.hash }, { replace: true, preventScrollReset: true });
  };
  const filters = [
    { value: 'all', label: 'All stock', count: inventory.length },
    { value: 'available', label: 'Available', count: inventory.filter(pc => pc.status === 'available').length },
    { value: 'reserved', label: 'Reserved', count: inventory.filter(pc => pc.status === 'reserved').length },
  ];
  return <section id="inventory" className="studio-inventory" aria-labelledby="inventory-title">
    <div className="studio-container">
      <div className="inventory-heading"><h2 id="inventory-title">{siteContent.inventory.title}<span>{inventory.length}</span></h2><p>{siteContent.inventory.description}</p></div>
      {inventory.length === 0 ? <div className="inventory-empty">
        <Monitor size={32} aria-hidden="true" /><h3>Let’s find your next PC.</h3><p>{siteContent.inventory.emptyMessage}</p>
        <a className="pc-action pc-action--primary" href={siteConfig.phoneHref}>Call about current PCs<ArrowUpRight size={18} aria-hidden="true" /></a>
      </div> : <>
        <div className="inventory-toolbar">
          <label className="inventory-search"><span className="sr-only">Search current PCs</span><Search size={19} aria-hidden="true" /><input type="search" value={query} onChange={event => updateFilter('q', event.target.value, '')} placeholder="Search PCs or specifications" />{query && <button type="button" aria-label="Clear PC search" onClick={() => updateFilter('q', '', '')}><X size={17} aria-hidden="true" /></button>}</label>
          <label className="inventory-sort"><span>Budget</span><select value={budget} onChange={event => updateFilter('budget', event.target.value)}><option value="all">Any budget</option><option value="500">Up to $500</option><option value="1000">Up to $1,000</option><option value="1500">Up to $1,500</option><option value="2500">Up to $2,500</option></select></label>
          <label className="inventory-sort"><span>Sort</span><select value={sort} onChange={event => updateFilter('sort', event.target.value, 'availability')}><option value="availability">Availability</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
          <div className="inventory-filters" role="group" aria-label="Filter PCs by availability">{filters.map(filter => <button key={filter.value} type="button" aria-pressed={availability === filter.value} onClick={() => updateFilter('stock', filter.value)}>{filter.label}<span>{filter.count}</span></button>)}</div>
          <div className="inventory-result"><p role="status" aria-live="polite">{products.length} {products.length === 1 ? 'PC' : 'PCs'} {filtered ? 'matched' : 'to explore'}</p>{filtered && <button type="button" onClick={resetFilters}>Reset filters</button>}</div>
        </div>
        {(query || availability !== 'all' || budget !== 'all') && <div className="active-filters" aria-label="Applied filters">{query && <button type="button" onClick={() => updateFilter('q', '', '')} aria-label={'Remove search: ' + query}>“{query}”<X size={14} aria-hidden="true" /></button>}{availability !== 'all' && <button type="button" onClick={() => updateFilter('stock', 'all')} aria-label="Remove availability filter">{availability}<X size={14} aria-hidden="true" /></button>}{budget !== 'all' && <button type="button" onClick={() => updateFilter('budget', 'all')} aria-label="Remove budget filter">Up to {formatPcPrice(Number(budget))}<X size={14} aria-hidden="true" /></button>}</div>}
        {products.length === 0 ? <div className="inventory-empty"><SearchX size={32} aria-hidden="true" /><h3>No PCs match these filters.</h3><p>Try a different specification or budget, or call us for help finding a system.</p><button type="button" className="pc-action pc-action--primary" onClick={resetFilters}>Show all current PCs</button></div>
          : <div className={'pc-grid ' + (products.length > 2 ? 'pc-grid--many' : '')}>{products.map(product => <ProductCard key={product.id} product={product} onDetails={openDetails} />)}</div>}
        <p className="inventory-footnote">Need something different? <a href={siteConfig.phoneHref}>Talk through your budget with the shop<ArrowUpRight size={14} aria-hidden="true" /></a></p>
      </>}
    </div>
    {selected && <ProductDetailsDialog key={selected.id} product={selected} onClose={closeDetails} />}
  </section>;
}
