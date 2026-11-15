import { ArrowUpRight, Check, Clock3, Maximize2, Monitor } from 'lucide-react';
import { formatPcPrice, type ListedProduct } from '../config/inventory';
import { siteConfig } from '../config/site';
import ProductSpecs from './ProductSpecs';
import SavePcButton from './SavePcButton';
import './product-cards.css';

const checkedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function ProductCard({ product, onDetails }: { product: ListedProduct; onDetails: (product: ListedProduct) => void }) {
  const reserved = product.status === 'reserved';
  const StatusIcon = reserved ? Clock3 : Check;
  const questionUrl = `${siteConfig.emailHref}?subject=${encodeURIComponent(`Question about ${product.title}`)}`;
  return <article id={`pc-${product.id}`} className="pc-card" aria-labelledby={`title-${product.id}`}>
    <div className="pc-image-stage">
      <button type="button" className="pc-photo-button" aria-label={`View details for ${product.title}`} onClick={() => onDetails(product)}>
        {product.image ? <img src={product.image} alt={product.imageAlt || product.title} width="720" height="960" loading="lazy" decoding="async" /> : <span className="pc-no-photo"><Monitor size={52} aria-hidden="true" /><span>See this PC in the showroom</span></span>}
        <span className="pc-photo-hint"><Maximize2 size={14} aria-hidden="true" />Take a closer look</span>
      </button>
      <span className={`pc-stock ${reserved ? 'pc-stock--reserved' : ''}`}><StatusIcon size={13} aria-hidden="true" />{reserved ? 'Reserved' : 'Available'}</span>
      <SavePcButton productId={product.id} productTitle={product.title} compact />
    </div>
    <div className="pc-card-body">
      <div className="pc-price-row"><span className="pc-shop-label">Upgrade Gaming PCs</span><span className="pc-price">{formatPcPrice(product.price)}</span></div>
      <h3 id={`title-${product.id}`}><button type="button" onClick={() => onDetails(product)}>{product.title}</button></h3>
      <p className="pc-card-description">{product.description}</p>
      <ProductSpecs product={product} />
      <div className="pc-card-actions">
        {product.marketplaceUrl ? <a className="pc-action pc-action--primary" href={product.marketplaceUrl} target="_blank" rel="noopener noreferrer">View on Marketplace<ArrowUpRight size={18} aria-hidden="true" /></a> : <a className="pc-action pc-action--primary" href={questionUrl}>{reserved ? 'Ask about similar PCs' : 'Ask about this PC'}<ArrowUpRight size={18} aria-hidden="true" /></a>}
        <div className="pc-secondary-actions"><button type="button" onClick={() => onDetails(product)}>Full PC details</button><a href={questionUrl}>{reserved ? 'Ask about alternatives' : 'Ask the shop'}<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        {product.marketplaceUrl && product.marketplaceVerifiedOn && <p className="pc-checked">Marketplace checked <time dateTime={product.marketplaceVerifiedOn}>{checkedDate.format(new Date(`${product.marketplaceVerifiedOn}T00:00:00Z`))}</time></p>}
      </div>
    </div>
  </article>;
}
