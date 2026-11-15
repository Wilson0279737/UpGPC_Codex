import { ArrowUpRight, Monitor, Search, SearchX, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { inventory, formatPcPrice, type ListedProduct } from '../config/inventory';
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
  const [budget, setBudget] = useState('all');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const compared = inventory.filter(pc => compareIds.includes(pc.id));
  const toggleCompare = (id: string) => {
    setCompareIds(ids => ids.includes(id) ? ids.filter(item => item !== id) : ids.length < 2 ? [...ids, id] : ids);
    setShowComparison(false);
  };
  const [selected, setSelected] = useState<ListedProduct | null>(null);
  const products = searchProducts(inventory, { query, availability, sort }).filter(pc => budget === 'all' || (typeof pc.price === 'number' && pc.price <= Number(budget)));
  const closeDetails = useCallback(() => setSelected(null), []);
  const resetFilters = () => { setQuery(''); setAvailability('all'); setSort('availability'); setBudget('all'); };
  const filtered = Boolean(query || availability !== 'all' || sort !== 'availability' || budget !== 'all');
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
        <div className="shop-guide"><div><span className="shop-kicker">YOUR NEXT SETUP STARTS HERE</span><h3>Find it. Compare it. Try it.</h3><p>Pick up to two PCs to compare. No account needed.</p></div><a href={siteConfig.phoneHref}>Need a hand choosing? Call the shop ↗</a></div>
        <div className="inventory-toolbar">
          <label className="inventory-search"><span className="sr-only">Find a PC</span><Search size={19} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a name, processor, or graphics card" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={17} aria-hidden="true" /></button>}</label>
          <label className="inventory-sort"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="availability">Availability</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
          <label className="inventory-sort"><span>Budget</span><select value={budget} onChange={event => setBudget(event.target.value)}><option value="all">Any budget</option><option value="500">Up to $500</option><option value="1000">Up to $1,000</option><option value="1500">Up to $1,500</option><option value="2500">Up to $2,500</option></select></label>
          <div className="inventory-filters" role="group" aria-label="Filter PCs by availability">{filters.map(filter => <button key={filter.value} type="button" aria-pressed={availability === filter.value} onClick={() => setAvailability(filter.value)}>{filter.label}<span>{filter.count}</span></button>)}</div>
          <div className="inventory-result"><p role="status">{products.length} {products.length === 1 ? 'PC' : 'PCs'} {filtered ? 'matched' : 'to explore'}</p>{filtered && <button type="button" onClick={resetFilters}>Reset filters</button>}</div>
        </div>
        {(query || availability !== 'all' || budget !== 'all') && <div className="active-filters" aria-label="Applied filters">{query && <button onClick={() => setQuery('')}>Search: {query}<X size={14} aria-label="Remove search" /></button>}{availability !== 'all' && <button onClick={() => setAvailability('all')}>Status: {availability}<X size={14} aria-label="Remove availability filter" /></button>}{budget !== 'all' && <button onClick={() => setBudget('all')}>Up to {formatPcPrice(Number(budget))}<X size={14} aria-label="Remove budget filter" /></button>}</div>}
        {compared.length > 0 && <div className="compare-panel"><div className="compare-toolbar"><div><strong>Your comparison</strong><p role="status">{compared.length === 1 ? 'One picked. Choose one more PC below.' : 'Two picked. See what’s different.'}</p></div><div className="compare-controls"><button className="pc-action pc-action--primary" disabled={compared.length !== 2} onClick={() => setShowComparison(value => !value)} aria-expanded={showComparison} aria-controls="pc-comparison">{showComparison ? 'Hide comparison' : 'Compare PCs'}</button><button onClick={() => { setCompareIds([]); setShowComparison(false); }}>Clear</button></div></div><div className="active-filters">{compared.map(pc => <button key={pc.id} onClick={() => toggleCompare(pc.id)} aria-label={`Remove ${pc.title} from comparison`}>{pc.title}<X size={14} aria-hidden="true" /></button>)}</div>{showComparison && <div id="pc-comparison" className="comparison-scroll" role="region" aria-label="PC specification comparison" tabIndex={0}><table><caption>Side by side. Find your fit.</caption><thead><tr><th scope="col">Details</th>{compared.map(pc => <th scope="col" key={pc.id}>{pc.title}</th>)}</tr></thead><tbody>{(['price','status','cpu','gpu','ram','storage'] as const).map(key => <tr key={key}><th scope="row">{{price:'Price',status:'Availability',cpu:'Processor',gpu:'Graphics',ram:'Memory',storage:'Storage'}[key]}</th>{compared.map(pc => <td key={pc.id}>{key === 'price' ? formatPcPrice(pc.price) : pc[key] || 'Ask the shop'}</td>)}</tr>)}<tr><th scope="row">Explore</th>{compared.map(pc => <td key={pc.id}><button onClick={() => setSelected(pc)}>View PC details ↗</button></td>)}</tr></tbody></table></div>}</div>}
        {products.length === 0 ? <div className="inventory-empty"><span className="inventory-empty-icon"><SearchX size={30} aria-hidden="true" /></span><h3>No PCs match just yet.</h3><p>Try another search or clear your filters. We’re happy to help you find a system.</p><button type="button" className="pc-action pc-action--primary" onClick={resetFilters}>Clear filters</button></div>
          : <div className={`pc-grid ${products.length > 2 ? 'pc-grid--many' : ''}`}>{products.map(product => <div key={product.id} className="compare-card-wrap"><ProductCard product={product} onDetails={setSelected} /><button className="compare-choice" aria-pressed={compareIds.includes(product.id)} disabled={compared.length === 2 && !compareIds.includes(product.id)} onClick={() => toggleCompare(product.id)} aria-label={`${compareIds.includes(product.id) ? 'Remove' : 'Compare'} ${product.title}`}>{compareIds.includes(product.id) ? '✓ Added to comparison' : compared.length === 2 ? 'Remove a PC to compare another' : '+ Compare this PC'}</button></div>)}</div>}
      </>}
    </div>
    {selected && <ProductDetailsDialog product={selected} onClose={closeDetails} />}
  </section>;
}
