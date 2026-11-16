import { useEffect, useId, useRef } from 'react';
import { Archive, ArrowUpRight, Check, Clock3, Mail, Maximize2, Monitor, Phone, X } from 'lucide-react';
import { formatPcPrice, type ListedProduct } from '../config/inventory';
import { siteConfig } from '../config/site';
import ProductSpecs from './ProductSpecs';

export default function ProductDetailsDialog({ product, onClose }: { product: ListedProduct; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const pointerStartedOutside = useRef(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  const outsideDialog = (x: number, y: number) => {
    const bounds = dialogRef.current?.getBoundingClientRect();
    return Boolean(bounds && (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom));
  };
  const reserved = product.status === 'reserved';
  const sold = product.status === 'sold';
  const StatusIcon = sold ? Archive : reserved ? Clock3 : Check;
  const questionUrl = siteConfig.emailHref + '?subject=' + encodeURIComponent(sold || reserved ? 'Looking for a PC similar to ' + product.title : 'Question about ' + product.title);
  return <dialog ref={dialogRef} tabIndex={-1} className={'pc-dialog ' + (sold ? 'pc-dialog--sold' : '')} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
    // Recompute for the current content rather than assuming fixed first/last actions.
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]'))
      .filter(control => control.tabIndex >= 0 && !control.matches(':disabled') && !control.closest('[inert]') && control.getClientRects().length > 0 && getComputedStyle(control).visibility !== 'hidden');
    const first = controls[0];
    const last = controls[controls.length - 1];
    const active = document.activeElement;
    if (!first || !last) { event.preventDefault(); event.currentTarget.focus(); return; }
    if (event.shiftKey && (active === first || !controls.includes(active as HTMLElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (active === last || !controls.includes(active as HTMLElement))) {
      event.preventDefault(); first.focus();
    }
  }} onPointerDown={event => { pointerStartedOutside.current = outsideDialog(event.clientX, event.clientY); }} onClick={event => {
    if (event.target === event.currentTarget && pointerStartedOutside.current && outsideDialog(event.clientX, event.clientY)) onClose();
    pointerStartedOutside.current = false;
  }}>
    <button ref={closeRef} type="button" className="pc-dialog-close" aria-label="Close PC details" onClick={onClose}><X size={21} aria-hidden="true" /></button>
    <div className="pc-detail-layout">
      <div className="pc-detail-photo">{product.image ? <a className="pc-full-photo" href={product.image} target="_blank" rel="noopener noreferrer" aria-label={'Open full-size photograph of ' + product.title + ' (opens in a new tab)'}><img src={product.image} alt={product.imageAlt || product.title} width={sold ? 261 : 720} height={sold ? 261 : 960} /><span className="pc-full-photo-label"><Maximize2 size={15} aria-hidden="true" />Open full-size photograph<ArrowUpRight size={14} aria-hidden="true" /></span></a> : <Monitor size={80} aria-hidden="true" />}<span>{sold ? 'Previously sold · For reference' : 'Actual showroom photograph'}</span></div>
      <div className="pc-detail-copy">
        <span className={'pc-stock ' + (sold ? 'pc-stock--sold' : reserved ? 'pc-stock--reserved' : '')}><StatusIcon size={13} aria-hidden="true" />{sold ? 'Sold' : reserved ? 'Reserved' : 'Available'}</span>
        <p className="pc-shop-label">Upgrade Gaming PCs · Swartz Creek, MI</p>
        <h2 id={titleId}>{product.title}</h2>{sold && <span className="pc-historical-label">Last advertised listing price</span>}<p className="pc-detail-price">{sold && typeof product.price !== 'number' ? 'Price not recorded' : formatPcPrice(product.price)}</p>
        <ProductSpecs product={product} /><p className="pc-detail-description">{product.description}</p>
        <div className="pc-detail-actions">
          {product.marketplaceUrl && <a className={'pc-action ' + (sold || reserved ? 'pc-action--outline' : 'pc-action--primary')} href={product.marketplaceUrl} target="_blank" rel="noopener noreferrer">{sold ? 'Original Marketplace listing' : 'View on Facebook Marketplace'}<ArrowUpRight size={18} aria-hidden="true" /></a>}
          <a className={'pc-action ' + (product.marketplaceUrl && !sold && !reserved ? 'pc-action--outline' : 'pc-action--primary')} href={questionUrl}><Mail size={17} aria-hidden="true" />{sold || reserved ? 'Ask about similar PCs' : 'Ask about this PC'}</a>
          <a className="pc-call" href={siteConfig.phoneHref}><Phone size={15} aria-hidden="true" />{siteConfig.phone}</a>
        </div>
        <p className="pc-detail-note">{sold ? 'This PC is sold. Its listing is shown for reference; contact the shop for a similar system.' : reserved ? 'This PC is reserved. Ask us about other options, or call to check whether its status has changed.' : 'Call to confirm availability or arrange an in-store test. Saving a PC does not reserve it.'}</p>
      </div>
    </div>
  </dialog>;
}
