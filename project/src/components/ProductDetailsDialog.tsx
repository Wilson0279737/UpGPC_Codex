import { useEffect, useRef } from 'react';
import { Archive, ArrowUpRight, Check, Clock3, Mail, Monitor, Phone, X } from 'lucide-react';
import { formatPcPrice, type ListedProduct } from '../config/inventory';
import { siteConfig } from '../config/site';
import ProductSpecs from './ProductSpecs';

export default function ProductDetailsDialog({ product, onClose }: { product: ListedProduct; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const callRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus({ preventScroll: true }); };
  }, []);
  const reserved = product.status === 'reserved';
  const sold = product.status === 'sold';
  const StatusIcon = sold ? Archive : reserved ? Clock3 : Check;
  const questionUrl = `${siteConfig.emailHref}?subject=${encodeURIComponent(sold ? `Looking for a PC similar to ${product.title}` : `Question about ${product.title}`)}`;
  return <dialog ref={dialogRef} className={`pc-dialog ${sold ? 'pc-dialog--sold' : ''}`} aria-labelledby="pc-detail-title" onCancel={event => { event.preventDefault(); onClose(); }} onClose={() => { if (!dialogRef.current?.open) onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === closeRef.current) { event.preventDefault(); callRef.current?.focus(); }
    else if (!event.shiftKey && document.activeElement === callRef.current) { event.preventDefault(); closeRef.current?.focus(); }
  }}>
    <button ref={closeRef} type="button" className="pc-dialog-close" aria-label="Close PC details" onClick={onClose}><X size={21} aria-hidden="true" /></button>
    <div className="pc-detail-layout">
      <div className="pc-detail-photo">{product.image ? <img src={product.image} alt={product.imageAlt || product.title} width={sold ? 261 : 720} height={sold ? 261 : 960} /> : <Monitor size={80} aria-hidden="true" />}<span>{sold ? 'Previously sold at Upgrade Gaming PCs' : 'See it. Try it. Find your next PC.'}</span></div>
      <div className="pc-detail-copy">
        <span className={`pc-stock ${sold ? 'pc-stock--sold' : reserved ? 'pc-stock--reserved' : ''}`}><StatusIcon size={13} aria-hidden="true" />{sold ? 'Sold' : reserved ? 'Reserved' : 'Available'}</span>
        <p className="pc-shop-label">Upgrade Gaming PCs · Swartz Creek, MI</p>
        <h2 id="pc-detail-title">{product.title}</h2>{sold && <span className="pc-historical-label">Last advertised listing price</span>}<p className="pc-detail-price">{sold && typeof product.price !== 'number' ? 'Price not recorded' : formatPcPrice(product.price)}</p>
        <ProductSpecs product={product} /><p className="pc-detail-description">{product.description}</p>
        <div className="pc-detail-actions">
          {product.marketplaceUrl && <a className={`pc-action ${sold ? 'pc-action--outline' : 'pc-action--primary'}`} href={product.marketplaceUrl} target="_blank" rel="noopener noreferrer">{sold ? 'Original Marketplace listing' : 'Open Facebook listing'}<ArrowUpRight size={18} aria-hidden="true" /></a>}
          <a className={`pc-action ${product.marketplaceUrl && !sold ? 'pc-action--outline' : 'pc-action--primary'}`} href={questionUrl}><Mail size={17} aria-hidden="true" />{sold || reserved ? 'Ask about similar PCs' : 'Ask about this PC'}</a>
          <a ref={callRef} className="pc-call" href={siteConfig.phoneHref}><Phone size={15} aria-hidden="true" />Call the showroom</a>
        </div>
        <p className="pc-detail-note">{sold ? 'This PC is sold. Its listing is shown for reference; contact the shop for a similar system.' : 'Call to confirm availability or arrange an in-store test. Saving a PC does not reserve it.'}</p>
      </div>
    </div>
  </dialog>;
}
