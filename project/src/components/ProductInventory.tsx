import { ArrowUpRight, Monitor, Search, SearchX, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { inventory, type ListedProduct } from '../config/inventory';
import { searchProducts } from '../lib/inventory.mjs';
import { siteConfig, siteContent } from '../config/site';
import ActionLink from './ui/ActionLink';
import SectionHeader from './ui/SectionHeader';
import ProductCard from './ProductCard';
import ProductDetailsDialog from './ProductDetailsDialog';

export default function ProductInventory() {
  const [query, setQuery] = useState('');
  const [availability, setAvailability] = useState('all');
  const [sort, setSort] = useState('availability');
  const [selected, setSelected] = useState<ListedProduct | null>(null);
  const products = searchProducts(inventory, { query, availability, sort });
  const closeDetails = useCallback(() => setSelected(null), []);
  const resetFilters = () => { setQuery(''); setAvailability('all'); setSort('availability'); };
  const filtered = Boolean(query || availability !== 'all' || sort !== 'availability');
  const filters = [
    { value: 'all', label: 'All PCs', count: inventory.length },
    { value: 'available', label: 'Available', count: inventory.filter(pc => pc.status === 'available').length },
    { value: 'reserved', label: 'Reserved', count: inventory.filter(pc => pc.status === 'reserved').length },
  ];
  return <section id="inventory" className="relative scroll-mt-28 py-10 sm:py-14" aria-labelledby="inventory-title">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeader titleId="inventory-title" eyebrow="Find your next setup" title={siteContent.inventory.title} description={siteContent.inventory.description} />
      {inventory.length === 0 ? <div className="inventory-empty">
        <span className="inventory-empty-icon"><Monitor size={30} aria-hidden="true" /></span><h3>Your next PC could be in the showroom.</h3><p>{siteContent.inventory.emptyMessage}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"><ActionLink href={siteConfig.phoneHref}>Call about current PCs</ActionLink><ActionLink href={siteConfig.marketplaceUrl} external variant="secondary">Browse Marketplace<ArrowUpRight size={17} aria-hidden="true" /></ActionLink></div>
      </div> : <>
        <div className="inventory-toolbar">
          <label className="inventory-search"><span className="sr-only">Find a PC</span><Search size={19} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a name, processor, or graphics card" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={17} aria-hidden="true" /></button>}</label>
          <label className="inventory-sort"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="availability">Availability</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
          <div className="inventory-filters" role="group" aria-label="Filter PCs by availability">{filters.map(filter => <button key={filter.value} type="button" aria-pressed={availability === filter.value} onClick={() => setAvailability(filter.value)}>{filter.label}<span>{filter.count}</span></button>)}</div>
          <div className="inventory-result"><p role="status">{products.length} {products.length === 1 ? 'PC' : 'PCs'} {filtered ? 'matched' : 'to explore'}</p>{filtered && <button type="button" onClick={resetFilters}>Reset filters</button>}</div>
        </div>
        {products.length === 0 ? <div className="inventory-empty"><span className="inventory-empty-icon"><SearchX size={30} aria-hidden="true" /></span><h3>No PCs match just yet.</h3><p>Try another search or clear your filters. We’re happy to help you find a system.</p><button type="button" className="pc-action pc-action--primary" onClick={resetFilters}>Clear filters</button></div>
          : <div className={`pc-grid ${products.length > 2 ? 'pc-grid--many' : ''}`}>{products.map(product => <ProductCard key={product.id} product={product} onDetails={setSelected} />)}</div>}
      </>}
    </div>
    {selected && <ProductDetailsDialog product={selected} onClose={closeDetails} />}
  </section>;
}
