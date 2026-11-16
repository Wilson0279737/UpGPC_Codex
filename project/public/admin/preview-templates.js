import { validMarketplaceUrl } from './content-rules.js';

const copy = (value, fallback = '') => typeof value === 'string' && value ? value : fallback;
const price = value => typeof value === 'number' && Number.isFinite(value)
  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value)
  : 'Call for pricing';

export function registerPreviews(CMS, { demo = false } = {}) {
  const h = CMS.React.createElement;
  CMS.registerPreviewStyle('/admin/preview.css');
  const heading = label => h('div', { className: 'preview-heading' }, h('span', { className: 'preview-eyebrow' }, demo ? 'Practice workspace' : 'Website preview'), h('span', {}, label));
  const footer = () => h('p', { className: 'preview-note' }, demo ? 'Example content · Saves stay in this browser.' : 'Save your changes, then review the rebuilt website.');

  CMS.registerPreviewTemplate('products', ({ entry, getAsset }) => {
    const pc = entry.get('data').toJS();
    const title = copy(pc.title, 'Your PC name');
    const status = ['available', 'reserved', 'sold'].includes(pc.status) ? pc.status : 'draft';
    const notes = { available: 'Visible in the catalog after this preview rebuilds.', reserved: 'Visible with a reserved label. Shoppers can ask about similar PCs.', sold: 'Visible in the Sold PCs archive. Excluded from available stock and saved-PC controls.', draft: 'Hidden from shoppers. Choose Available when this PC is ready.' };
    const photo = pc.image ? getAsset(pc.image) : undefined;
    const specs = [['Processor', pc.cpu], ['Graphics', pc.gpu], ['Memory', pc.ram], ['Storage', pc.storage]].filter(([, value]) => value);
    return h('div', { className: 'pc-preview' }, heading('PC listing'),
      h('article', { className: 'pc-preview-card' },
        h('div', { className: 'pc-preview-stage' },
          photo ? h('a', { className: 'pc-preview-photo', href: photo.url, target: '_blank', rel: 'noopener noreferrer', title: 'Open the full photo' }, h('img', { src: photo.url, alt: copy(pc.imageAlt, title) })) : h('div', { className: 'pc-preview-placeholder' }, 'Your PC photo'),
          h('span', { className: `preview-stock ${status}` }, status.charAt(0).toUpperCase() + status.slice(1)),
        ),
        h('div', { className: 'pc-preview-body' },
          h('div', { className: 'pc-preview-price-row' }, h('span', { className: 'preview-eyebrow' }, status === 'sold' ? 'Last advertised listing price' : 'Upgrade Gaming PCs'), h('strong', {}, status === 'sold' && typeof pc.price !== 'number' ? 'Price not recorded' : price(pc.price))),
          h('h1', {}, title), h('p', { className: 'pc-preview-description' }, copy(pc.description, 'Add a description to help customers choose.')),
          h('dl', { className: 'preview-specs' }, specs.map(([label, value]) => h('div', { key: label }, h('dt', {}, label), h('dd', {}, copy(value))))),
          validMarketplaceUrl(pc.marketplaceUrl) ? h('a', { className: 'preview-action', href: pc.marketplaceUrl, target: '_blank', rel: 'noopener noreferrer' }, status === 'sold' ? 'Original Marketplace listing ↗' : 'View on Marketplace ↗') : null,
          pc.marketplaceVerifiedOn ? h('p', { className: 'preview-note' }, `Marketplace last checked: ${copy(pc.marketplaceVerifiedOn)}`) : null,
          h('p', { className: `visibility-note ${status}` }, demo ? 'Practice only. This PC will not appear on your website.' : notes[status]),
        ),
      ), footer(),
    );
  });

  CMS.registerPreviewTemplate('site', ({ entry, getAsset }) => {
    const site = entry.get('data').toJS();
    const home = site.home || {}, about = site.about || {}, contact = site.contact || {}, business = site.business || {}, inventory = site.inventory || {};
    const photo = home.image ? getAsset(home.image) : undefined;
    return h('div', { className: 'page-preview' }, heading('Pages & contact'),
      h('div', { className: 'preview-brand' }, h('img', { src: '/apple-touch-logo-full.png', alt: 'Upgrade Gaming PCs' }), h('span', {}, 'Swartz Creek, MI')),
      h('section', { className: 'preview-home' }, photo ? h('img', { src: photo.url, alt: copy(home.imageAlt, 'Shop photo') }) : null, h('div', {}, h('span', { className: 'preview-eyebrow' }, 'Home page'), h('h1', {}, copy(home.title, 'Your headline')), h('p', {}, copy(home.description, 'Your introduction will appear here.')))),
      h('section', { className: 'preview-section' }, h('span', { className: 'preview-eyebrow' }, 'About the shop'), h('h2', {}, copy(about.title)), h('p', {}, copy(about.description)), h('p', {}, copy(about.body))),
      h('section', { className: 'preview-section preview-contact' }, h('span', { className: 'preview-eyebrow' }, 'Contact'), h('h2', {}, copy(contact.title)), h('p', {}, copy(contact.description)), h('div', { className: 'preview-contact-details' }, h('strong', {}, copy(business.phone)), h('span', {}, copy(business.email)), h('span', {}, [business.streetAddress, business.city, business.state, business.postalCode].filter(value => typeof value === 'string' && value).join(', '))), h('p', {}, copy(business.hoursNote))),
      h('section', { className: 'preview-section' }, h('span', { className: 'preview-eyebrow' }, 'Catalog introduction'), h('h2', {}, copy(inventory.title)), h('p', {}, copy(inventory.description))), footer(),
    );
  });

  CMS.registerPreviewTemplate('services', ({ entry }) => {
    const services = entry.get('data').toJS();
    return h('div', { className: 'page-preview' }, heading('Repair services'),
      h('section', { className: 'preview-section preview-services-intro' }, h('span', { className: 'preview-eyebrow' }, 'Upgrade Gaming PCs'), h('h1', {}, copy(services.title, 'Your services')), h('p', {}, copy(services.description))),
      h('div', { className: 'preview-service-grid' }, (Array.isArray(services.cards) ? services.cards : []).map((card, index) => h('article', { className: 'preview-service', key: index }, h('span', { className: 'preview-service-icon' }, card.icon === 'computer' ? 'PC' : '+'), h('h2', {}, copy(card.title, 'Service name')), h('p', {}, copy(card.description)), h('ul', {}, (Array.isArray(card.points) ? card.points : []).map((point, i) => h('li', { key: i }, copy(point)))), ['/contact', '/products', '/services', '/about'].includes(card.ctaPath) ? h('a', { className: 'preview-action preview-action-quiet', href: card.ctaPath, target: '_blank', rel: 'noopener noreferrer' }, copy(card.ctaLabel, 'Learn more')) : null))), footer(),
    );
  });
}
