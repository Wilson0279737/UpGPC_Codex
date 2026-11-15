import { Monitor } from 'lucide-react';
import { useState } from 'react';
import { inventory } from '../config/inventory';
import { searchProducts } from '../lib/inventory.mjs';
import { siteConfig, siteContent } from '../config/site';
import ActionLink from './ui/ActionLink';
import SectionHeader from './ui/SectionHeader';
import { cardClass } from './ui/siteStyles';
import SavePcButton from './SavePcButton';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const listingDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function ProductInventory() {
  const [query, setQuery] = useState('');
  const [availability, setAvailability] = useState('all');
  const [sort, setSort] = useState('availability');
  const products = searchProducts(inventory, { query, availability, sort });
  const resetFilters = () => { setQuery(''); setAvailability('all'); setSort('availability'); };
  return (
    <section id="inventory" className="relative scroll-mt-28 py-10 sm:py-14" aria-labelledby="inventory-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader titleId="inventory-title" eyebrow="In the showroom" title={siteContent.inventory.title} description={siteContent.inventory.description} />
        {inventory.length === 0 ? (
          <div className={`${cardClass} mt-6`}>
            <p className="max-w-2xl text-purple-100">{siteContent.inventory.emptyMessage}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ActionLink href={siteConfig.phoneHref}>Call about current PCs</ActionLink>
              <ActionLink href={siteConfig.marketplaceUrl} external variant="secondary">Browse Marketplace</ActionLink>
            </div>
          </div>
        ) : <>
          <div className="mt-7 grid gap-4 rounded-2xl border border-purple-300/25 bg-purple-950/30 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="grid min-w-0 gap-2 text-sm font-medium text-purple-100">Find a PC
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a PC, processor, or graphics card" className="min-h-11 min-w-0 rounded-xl border border-purple-300/40 bg-[#1b102d] px-3 text-white placeholder:text-purple-200/70" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-purple-100">Availability
              <select value={availability} onChange={event => setAvailability(event.target.value)} className="min-h-11 rounded-xl border border-purple-300/40 bg-[#1b102d] px-3 text-white"><option value="all">All listed PCs</option><option value="available">Available</option><option value="reserved">Reserved</option></select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-purple-100">Sort by
              <select value={sort} onChange={event => setSort(event.target.value)} className="min-h-11 rounded-xl border border-purple-300/40 bg-[#1b102d] px-3 text-white"><option value="availability">Availability</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
            </label>
          </div>
          <p className="mt-4 text-sm text-purple-100" role="status">{products.length} {products.length === 1 ? 'PC' : 'PCs'} found</p>
          {products.length === 0 && <div className={`${cardClass} mt-5`}><h3 className="text-xl font-semibold text-white">No matching PCs</h3><p className="mt-2 text-purple-100">Try another search, or contact the shop for help finding a system.</p><button type="button" onClick={resetFilters} className="mt-4 min-h-11 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700">Clear filters</button></div>}
          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <article id={`pc-${product.id}`} key={product.id} className={`${cardClass} flex min-w-0 scroll-mt-28 flex-col`}>
                {product.image ? (
                  <img src={product.image} alt={product.imageAlt || product.title} width="720" height="540" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl bg-purple-950/40 object-contain" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-purple-950/40" aria-hidden="true"><Monitor className="h-16 w-16 text-purple-300" /></div>
                )}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-purple-300/40 bg-purple-950 px-3 py-1 text-xs font-semibold text-purple-100">{product.status === 'reserved' ? 'Reserved' : 'Available'}</span>
                  <span className="text-xl font-bold text-white">{typeof product.price === 'number' ? currency.format(product.price) : 'Call for pricing'}</span>
                </div>
                <h3 className="mt-4 break-words text-xl font-semibold text-white">{product.title}</h3>
                <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-purple-100">{product.description}</p>
                <dl className="mb-6 mt-5 space-y-2 text-sm text-purple-100">
                  {([['CPU', product.cpu], ['Graphics', product.gpu], ['Memory', product.ram], ['Storage', product.storage]] as const).filter(([, value]) => value).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2"><dt className="text-purple-200">{label}</dt><dd className="break-words font-medium text-white">{value}</dd></div>
                  ))}
                </dl>
                <div className="mt-auto grid gap-3">
                  {product.marketplaceUrl && <>
                    <ActionLink href={product.marketplaceUrl} external className="w-full">View on Facebook Marketplace</ActionLink>
                    {product.marketplaceVerifiedOn && <p className="text-xs leading-relaxed text-purple-200">Marketplace availability checked <time dateTime={product.marketplaceVerifiedOn}>{listingDate.format(new Date(`${product.marketplaceVerifiedOn}T00:00:00Z`))}</time>.</p>}
                  </>}
                  <ActionLink href={`${siteConfig.emailHref}?subject=${encodeURIComponent(`Question about ${product.title}`)}`} variant={product.marketplaceUrl ? 'secondary' : 'primary'} className="w-full">
                    {product.status === 'reserved' ? 'Ask about similar PCs' : 'Ask about this PC'}
                  </ActionLink>
                  <SavePcButton productId={product.id} className="w-full" />
                </div>
              </article>
            ))}
          </div>
        </>}
      </div>
    </section>
  );
}
