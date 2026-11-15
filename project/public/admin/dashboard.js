import { productProblems } from './content-rules.js';

const root = document.querySelector('[data-dashboard]');
const list = root?.querySelector('[data-catalog-list]');
const retry = root?.querySelector('[data-retry-catalog]');
const price = value => typeof value === 'number'
  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value)
  : 'Call for pricing';
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  element.className = className;
  if (text != null) element.textContent = text;
  return element;
};
let loading = false;

async function loadCatalog() {
  if (!list || loading) return;
  loading = true;
  retry.hidden = true;
  list.setAttribute('aria-busy', 'true');
  list.replaceChildren(node('li', 'catalog-loading', 'Loading your catalog…'));
  try {
    const response = await fetch('/admin/catalog.json', { cache: 'no-cache', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Catalog unavailable');
    const products = await response.json();
    if (!Array.isArray(products) || !products.every(pc => typeof pc?.id === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(pc.id) && ['available', 'reserved'].includes(pc.status) && productProblems(pc).length === 0)) throw new Error('Catalog invalid');
    for (const [key, value] of Object.entries({ total: products.length, available: products.filter(pc => pc.status === 'available').length, reserved: products.filter(pc => pc.status === 'reserved').length })) root.querySelector(`[data-count="${key}"]`).textContent = value;
    list.replaceChildren();
    if (!products.length) list.append(node('li', 'catalog-loading', 'Your catalog is ready for its first PC. Open PC inventory to add a listing.'));
    for (const pc of products.slice(0, 6)) {
      const item = node('li', 'catalog-item');
      if (pc.image) {
        const image = node('img', 'catalog-photo');
        image.src = pc.image; image.alt = pc.imageAlt || pc.title; image.loading = 'lazy'; image.width = 76; image.height = 88;
        item.append(image);
      } else item.append(node('span', 'catalog-placeholder', 'PC'));
      const copy = node('div', 'catalog-item-copy');
      copy.append(node('span', `catalog-state ${pc.status === 'reserved' ? 'catalog-state-amber' : ''}`, pc.status === 'reserved' ? 'Reserved' : 'Available'), node('h3', 'catalog-item-name', pc.title), node('p', 'catalog-item-price', price(pc.price)));
      const edit = node('button', 'catalog-edit', 'Edit');
      edit.type = 'button'; edit.dataset.openEditor = ''; edit.dataset.entry = pc.id; edit.setAttribute('aria-label', `Edit ${pc.title}`);
      item.append(copy, edit); list.append(item);
    }
  } catch {
    list.replaceChildren(node('li', 'catalog-loading', 'The catalog summary couldn’t load. You can still open the editor to manage all your PCs.'));
    retry.hidden = false;
  } finally {
    loading = false;
    list.removeAttribute('aria-busy');
  }
}

retry?.addEventListener('click', () => void loadCatalog());
void loadCatalog();
