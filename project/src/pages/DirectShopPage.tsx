import { ArrowUpRight, ImageOff, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/product-cards.css';
import './direct-shop.css';

type Variant = {
  id: string;
  title: string;
  available: boolean;
  price: { amount: string; currencyCode: string };
};

type Product = {
  id: string;
  title: string;
  description: string;
  image: { url: string; alt: string | null } | null;
  variants: Variant[];
};

type Catalog =
  | { status: 'loading' | 'unavailable' | 'error' }
  | { status: 'ready'; products: Product[] };

const pageSize = 24;

function formatPrice({ amount, currencyCode }: Variant['price']) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(Number(amount));
}

function ShopItem({
  product,
  pendingVariant,
  checkoutError,
  onCheckout,
}: {
  product: Product;
  pendingVariant: string | null;
  checkoutError: { variantId: string; message: string } | null;
  onCheckout: (variant: Variant) => void;
}) {
  const [selectedId, setSelectedId] = useState('');
  const variant = product.variants.find(item => item.id === selectedId)
    ?? product.variants.find(item => item.available)
    ?? product.variants[0];
  const available = variant?.available === true;
  const openingCheckout = pendingVariant !== null && pendingVariant === variant?.id;

  return (
    <article className="pc-card">
      <div className="pc-image-stage direct-shop-image">
        {product.image ? (
          <img src={product.image.url} alt={product.image.alt || product.title} width={560} height={350} loading="lazy" decoding="async" />
        ) : (
          <span className="pc-no-photo"><ImageOff size={32} aria-hidden="true" />Photo unavailable</span>
        )}
      </div>
      <div className="pc-card-body">
        <h3>{product.title}</h3>
        {product.description && (
          <details className="direct-shop-details">
            <summary>Item details</summary>
            <p>{product.description}</p>
          </details>
        )}
        <div className="pc-card-actions direct-shop-card-actions">
          {product.variants.length > 1 && (
            <label className="direct-shop-variant">
              <span>Option</span>
              <select aria-label={`Option for ${product.title}`} value={variant?.id} onChange={event => setSelectedId(event.target.value)} disabled={pendingVariant !== null}>
                {product.variants.map(item => (
                  <option value={item.id} key={item.id}>{item.title}{item.available ? '' : ' (unavailable)'}</option>
                ))}
              </select>
            </label>
          )}
          <div className="direct-shop-price">
            {variant && <strong className="pc-price">{formatPrice(variant.price)}</strong>}
            {!available && <span className="direct-shop-unavailable">Out of stock</span>}
          </div>
          {(available || openingCheckout) && variant && (
            <button
              className="pc-action pc-action--primary direct-shop-checkout"
              type="button"
              disabled={pendingVariant !== null}
              aria-label={openingCheckout ? `Opening checkout for ${product.title}` : `Buy ${product.title}`}
              onClick={() => { setSelectedId(variant.id); onCheckout(variant); }}
            >
              {openingCheckout ? 'Opening checkout…' : 'Buy now'}<ArrowUpRight size={18} aria-hidden="true" />
            </button>
          )}
          {variant && checkoutError?.variantId === variant.id && <p className="direct-shop-error" role="alert">{checkoutError.message}</p>}
        </div>
      </div>
    </article>
  );
}

export default function DirectShopPage() {
  const [catalog, setCatalog] = useState<Catalog>({ status: 'loading' });
  const [request, setRequest] = useState(0);
  const [query, setQuery] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(pageSize);
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<{ variantId: string; message: string } | null>(null);
  const checkoutRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch('/.netlify/functions/shop-catalog', { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (response.status === 503) {
          setCatalog({ status: 'unavailable' });
          return;
        }
        if (!response.ok) throw new Error('Unable to load catalog');
        const body = await response.json() as { products?: Product[] };
        if (!Array.isArray(body.products)) throw new Error('Invalid catalog response');
        if (!controller.signal.aborted) setCatalog({ status: 'ready', products: body.products });
      } catch {
        if (!controller.signal.aborted) setCatalog({ status: 'error' });
      }
    }

    void loadCatalog();
    return () => controller.abort();
  }, [request]);

  useEffect(() => () => checkoutRequest.current?.abort(), []);

  function retryCatalog() {
    setCatalog({ status: 'loading' });
    setRequest(previous => previous + 1);
  }

  function updateSearch(value: string) {
    setQuery(value);
    setVisibleLimit(pageSize);
  }

  async function openCheckout(variant: Variant) {
    if (!variant.available || checkoutRequest.current) return;

    const controller = new AbortController();
    checkoutRequest.current = controller;
    setPendingVariant(variant.id);
    setCheckoutError(null);

    try {
      const response = await fetch('/.netlify/functions/shop-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: variant.id, quantity: 1 }),
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;

      if (response.status === 404 || response.status === 409) {
        setCatalog(previous => previous.status === 'ready' ? {
          ...previous,
          products: previous.products.map(product => product.variants.some(item => item.id === variant.id)
            ? { ...product, variants: product.variants.map(item => item.id === variant.id ? { ...item, available: false } : item) }
            : product),
        } : previous);
        setCheckoutError({ variantId: variant.id, message: 'This item became unavailable before checkout.' });
        return;
      }

      if (!response.ok) throw new Error('Unable to start checkout');
      const { checkoutUrl } = await response.json() as { checkoutUrl?: string };
      if (typeof checkoutUrl !== 'string') throw new Error('Missing checkout URL');
      const url = new URL(checkoutUrl);
      if (url.protocol !== 'https:' || url.username || url.password || url.port) throw new Error('Invalid checkout URL');
      if (!controller.signal.aborted) window.location.assign(url.href);
    } catch {
      if (!controller.signal.aborted) {
        setCheckoutError({ variantId: variant.id, message: 'Checkout is temporarily unavailable. Please try again.' });
      }
    } finally {
      checkoutRequest.current = null;
      if (!controller.signal.aborted) setPendingVariant(null);
    }
  }

  const products = catalog.status === 'ready' ? catalog.products : [];
  const searchTerm = query.trim().toLowerCase();
  const results = products.filter(product => !searchTerm ||
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.variants.some(variant => variant.title.toLowerCase().includes(searchTerm)));

  return (
    <section className="studio-page studio-container" aria-labelledby="direct-shop-title">
      <div className="direct-shop-intro">
        <div>
          <h1 id="direct-shop-title" className="studio-page-title">Shop online</h1>
          <p className="studio-lead">Buy computers and parts directly from Upgrade Gaming PCs.</p>
        </div>
        <Link className="studio-inline-link" to="/products">Browse showroom PCs<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>

      {catalog.status === 'loading' && <p className="direct-shop-notice" role="status">Loading products…</p>}
      {catalog.status === 'unavailable' && (
        <div className="direct-shop-notice" role="status">
          <h2>Online shopping is currently unavailable.</h2>
          <p>Contact us for help finding a computer or part.</p>
          <Link className="studio-inline-link" to="/contact">Contact the shop<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      )}
      {catalog.status === 'error' && (
        <div className="direct-shop-notice">
          <p role="alert">We couldn’t load products. Please try again.</p>
          <button className="studio-button-secondary" type="button" onClick={retryCatalog}>Try again</button>
        </div>
      )}
      {catalog.status === 'ready' && products.length === 0 && (
        <div className="direct-shop-notice" role="status">
          <h2>No products are listed for online purchase yet.</h2>
          <Link className="studio-inline-link" to="/contact">Ask about availability<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      )}
      {products.length > 0 && (
        <>
          <div className="direct-shop-toolbar">
            <label className="inventory-search">
              <span className="sr-only">Search online products</span>
              <Search size={19} aria-hidden="true" />
              <input type="search" placeholder="Search products" value={query} onChange={event => updateSearch(event.target.value)} />
              {query && <button type="button" aria-label="Clear product search" onClick={() => updateSearch('')}><X size={17} aria-hidden="true" /></button>}
            </label>
            <p role="status">{results.length} {results.length === 1 ? 'product' : 'products'}{searchTerm ? ' found' : ''}</p>
          </div>
          {results.length === 0 ? (
            <div className="direct-shop-notice"><p>No products match your search.</p></div>
          ) : (
            <>
              <div className="pc-grid pc-grid--many direct-shop-grid">
                {results.slice(0, visibleLimit).map(product => <ShopItem key={product.id} product={product} pendingVariant={pendingVariant} checkoutError={checkoutError} onCheckout={variant => void openCheckout(variant)} />)}
              </div>
              {results.length > visibleLimit && (
                <button className="studio-button-secondary direct-shop-more" type="button" onClick={() => setVisibleLimit(limit => limit + pageSize)}>Show more products</button>
              )}
              <p className="direct-shop-footnote"><ShoppingBag size={16} aria-hidden="true" /> Shipping options and taxes are shown at checkout.</p>
            </>
          )}
        </>
      )}
    </section>
  );
}
