import { useEffect, useRef } from 'react';
import { ArrowUpRight, Check, Clock3, Mail, Monitor, Phone, X } from 'lucide-react';
import { formatPcPrice, type ListedProduct } from '../config/inventory';
import { siteConfig } from '../config/site';
import ProductSpecs from './ProductSpecs';

export default function ProductDetailsDialog({ product, onClose }: { product: ListedProduct; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus({ preventScroll: true }); };
  }, []);
  const reserved = product.status === 'reserved';
  const StatusIcon = reserved ? Clock3 : Check;
  const questionUrl = `${siteConfig.emailHref}?subject=${encodeURIComponent(`Question about ${product.title}`)}`;
  return <dialog ref={dialogRef} className="pc-dialog" aria-labelledby="pc-detail-title" onClose={() => { if (!dialogRef.current?.open) onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="pc-detail-layout">
      <button autoFocus type="button" className="pc-dialog-close" aria-label="Close PC details" onClick={onClose}><X size={21} aria-hidden="true" /></button>
      <div className="pc-detail-photo">{product.image ? <img src={product.image} alt={product.imageAlt || product.title} width="720" height="960" /> : <Monitor size={80} aria-hidden="true" />}<span>See it. Try it. Find your next PC.</span></div>
      <div className="pc-detail-copy">
        <span className={`pc-stock ${reserved ? 'pc-stock--reserved' : ''}`}><StatusIcon size={13} aria-hidden="true" />{reserved ? 'Reserved' : 'Available'}</span>
        <p className="pc-shop-label">Upgrade Gaming PCs · Swartz Creek, MI</p>
        <h2 id="pc-detail-title">{product.title}</h2><p className="pc-detail-price">{formatPcPrice(product.price)}</p>
        <ProductSpecs product={product} /><p className="pc-detail-description">{product.description}</p>
        <div className="pc-detail-actions">
          {product.marketplaceUrl && <a className="pc-action pc-action--primary" href={product.marketplaceUrl} target="_blank" rel="noopener noreferrer">Open Facebook listing<ArrowUpRight size={18} aria-hidden="true" /></a>}
          <a className={`pc-action ${product.marketplaceUrl ? 'pc-action--outline' : 'pc-action--primary'}`} href={questionUrl}><Mail size={17} aria-hidden="true" />{reserved ? 'Ask about similar PCs' : 'Ask about this PC'}</a>
          <a className="pc-call" href={siteConfig.phoneHref}><Phone size={15} aria-hidden="true" />Call the showroom</a>
        </div>
        <p className="pc-detail-note">Call to confirm availability or arrange an in-store test. Saving a PC does not reserve it.</p>
      </div>
    </div>
  </dialog>;
}
