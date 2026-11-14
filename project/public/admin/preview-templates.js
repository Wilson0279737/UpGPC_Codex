export function registerPreviews(CMS, { demo = false } = {}) {
  const h = CMS.React.createElement;
  CMS.registerPreviewStyle('/admin/preview.css', { collection: 'products' });
  CMS.registerPreviewTemplate('products', ({ entry, getAsset }) => {
    const pc = entry.get('data').toJS();
    const title = pc.title || 'Your PC name';
    const status = ['available', 'reserved', 'sold'].includes(pc.status) ? pc.status : 'draft';
    const notes = {
      available: 'Visible in the catalog after this preview rebuilds.',
      reserved: 'Visible with a reserved label. Visitors can ask about similar PCs.',
      sold: 'Hidden from the public catalog. Keep the record for later reference.',
      draft: 'Hidden from the public catalog. Choose Available when this PC is ready.',
    };
    const photo = pc.image ? getAsset(pc.image) : undefined;
    const price = typeof pc.price === 'number' && Number.isFinite(pc.price)
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pc.price)
      : 'Call for pricing';
    const specs = [['CPU', pc.cpu], ['Graphics', pc.gpu], ['Memory', pc.ram], ['Storage', pc.storage]].filter(([, value]) => value);
    return h('div', { className: 'pc-preview' },
      h('p', { className: 'preview-note' }, demo ? 'Practice listing · Saved in this browser only' : 'Listing preview · Saves go to your review website'),
      h('article', { className: 'pc-card' },
        photo ? h('img', { className: 'pc-photo', src: photo.url, alt: pc.imageAlt || title })
          : h('div', { className: 'pc-photo pc-placeholder' }, 'Your PC photo'),
        h('div', { className: 'pc-heading' }, h('span', { className: `pc-status ${status}` }, status.charAt(0).toUpperCase() + status.slice(1)), h('strong', {}, price)),
        h('h1', {}, title),
        h('p', { className: 'pc-description' }, pc.description || 'Add a description to help customers choose.'),
        h('dl', {}, specs.map(([label, value]) => h('div', { className: 'pc-spec', key: label }, h('dt', {}, label), h('dd', {}, value)))),
        h('p', { className: 'visibility-note' }, demo ? 'Practice only. This PC will not appear on your website.' : notes[status]),
      ),
      h('p', { className: 'preview-note' }, demo ? 'Try changing the price, specifications, photo, and availability. Practice changes never update the real website.' : 'Save, then review the website to confirm the final layout. Draft and sold PCs stay hidden.'),
    );
  });
}
