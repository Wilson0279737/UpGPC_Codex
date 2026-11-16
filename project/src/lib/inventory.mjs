// Only systems the shop currently offers belong in the public catalog.
export function visibleProducts(products) {
  const rank = { available: 0, reserved: 1 };
  return products.filter(product => Object.hasOwn(rank, product.status))
    .sort((a, b) => rank[a.status] - rank[b.status] || a.title.localeCompare(b.title));
}

// Sold listings are a separate public archive, never current stock.
export function soldProducts(products) {
  return products.filter(product => product.status === 'sold')
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function searchSoldProducts(products, { query = '', formFactor = 'all', sort = 'title' } = {}) {
  const search = query.trim().toLowerCase();
  const matches = soldProducts(products).filter(product =>
    (formFactor === 'all' || (product.formFactor || 'desktop') === formFactor)
    && (!search || [product.title, product.description, product.cpu, product.gpu, product.ram, product.storage].filter(Boolean).join(' ').toLowerCase().includes(search)));
  if (sort === 'price-low' || sort === 'price-high') matches.sort((a, b) => {
    const aHasPrice = typeof a.price === 'number';
    const bHasPrice = typeof b.price === 'number';
    if (aHasPrice !== bHasPrice) return aHasPrice ? -1 : 1;
    return aHasPrice ? (a.price - b.price) * (sort === 'price-low' ? 1 : -1) : 0;
  });
  return matches;
}

export function searchProducts(products, { query = '', availability = 'all', sort = 'availability' } = {}) {
  const search = query.trim().toLowerCase();
  const matches = visibleProducts(products).filter(product =>
    (availability === 'all' || product.status === availability)
    && (!search || [product.title, product.description, product.cpu, product.gpu, product.ram, product.storage].filter(Boolean).join(' ').toLowerCase().includes(search)));
  if (sort === 'price-low' || sort === 'price-high') matches.sort((a, b) => {
    const aHasPrice = typeof a.price === 'number';
    const bHasPrice = typeof b.price === 'number';
    if (aHasPrice !== bHasPrice) return aHasPrice ? -1 : 1;
    return aHasPrice ? (a.price - b.price) * (sort === 'price-low' ? 1 : -1) : 0;
  });
  return matches;
}
