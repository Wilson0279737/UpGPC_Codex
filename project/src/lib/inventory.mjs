// Only systems the shop currently offers belong in the public catalog.
export function visibleProducts(products) {
  const rank = { available: 0, reserved: 1 };
  return products.filter(product => Object.hasOwn(rank, product.status))
    .sort((a, b) => rank[a.status] - rank[b.status] || a.title.localeCompare(b.title));
}
