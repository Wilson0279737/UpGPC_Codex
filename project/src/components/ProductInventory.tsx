import { Monitor } from 'lucide-react';
import { inventory } from '../config/inventory';
import { siteConfig, siteContent } from '../config/site';
import ActionLink from './ui/ActionLink';
import SectionHeader from './ui/SectionHeader';
import { cardClass } from './ui/siteStyles';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function ProductInventory() {
  return (
    <section id="inventory" className="relative scroll-mt-28 py-10 sm:py-14" aria-labelledby="inventory-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div id="inventory-title">
          <SectionHeader eyebrow="In the showroom" title={siteContent.inventory.title} description={siteContent.inventory.description} />
        </div>
        {inventory.length === 0 ? (
          <div className={`${cardClass} mt-6`}>
            <p className="max-w-2xl text-purple-100">{siteContent.inventory.emptyMessage}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ActionLink href={siteConfig.phoneHref}>Call about current PCs</ActionLink>
              <ActionLink href={siteConfig.marketplaceUrl} external variant="secondary">Browse Marketplace</ActionLink>
            </div>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inventory.map(product => (
              <article key={product.id} className={`${cardClass} flex min-w-0 flex-col`}>
                {product.image ? (
                  <img src={product.image} alt={product.imageAlt || product.title} width="720" height="540" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl object-cover" />
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
                    <div key={label} className="grid grid-cols-[5rem_1fr] gap-2"><dt className="text-purple-200">{label}</dt><dd className="break-words font-medium text-white">{value}</dd></div>
                  ))}
                </dl>
                <a className="mt-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-center font-semibold text-white hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-200" href={`${siteConfig.emailHref}?subject=${encodeURIComponent(`Question about ${product.title}`)}`}>
                  {product.status === 'reserved' ? 'Ask about similar PCs' : 'Ask about this PC'}
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
