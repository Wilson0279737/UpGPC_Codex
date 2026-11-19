import { isIP } from 'node:net';

const apiVersion = '2026-10';
const storeDomainPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.myshopify\.com$/;
const checkoutHostPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const collectionHandlePattern = /^[a-z0-9][a-z0-9-]{0,254}$/;

export class ShopError extends Error {
  constructor(status, message, cause) {
    super(message);
    this.status = status;
    this.reason = cause;
  }
}

export function shopUnavailable(reason) {
  return new ShopError(502, 'The online shop is temporarily unavailable.', reason);
}

export function stockUnavailable() {
  return new ShopError(409, 'That quantity is no longer available.');
}

export function shopResponse(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  });
}

export function shopErrorResponse(error) {
  const failure = error instanceof ShopError ? error : shopUnavailable('unexpected-error');
  if (failure.reason) console.error('Shop request failed:', failure.reason);
  return shopResponse({ error: failure.message }, failure.status);
}

export function storefront(context) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim().toLowerCase();
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();
  const handle = process.env.SHOPIFY_COLLECTION_HANDLE?.trim();
  const customCheckoutHost = process.env.SHOPIFY_CHECKOUT_HOST?.trim().toLowerCase();

  if (!storeDomain || !token || !handle) {
    throw new ShopError(503, 'The online shop is not available yet.');
  }
  if (!storeDomainPattern.test(storeDomain) || !collectionHandlePattern.test(handle) ||
      (customCheckoutHost && !checkoutHostPattern.test(customCheckoutHost))) {
    throw shopUnavailable('invalid-configuration');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Shopify-Storefront-Private-Token': token,
  };
  if (typeof context?.ip === 'string' && isIP(context.ip)) {
    headers['Shopify-Storefront-Buyer-IP'] = context.ip;
  }

  const endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`;
  const deadline = AbortSignal.timeout(24_000);
  async function graphql(query, variables) {
    let payload;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        redirect: 'error',
        signal: AbortSignal.any([deadline, AbortSignal.timeout(8_000)]),
      });
      if (!response.ok) throw shopUnavailable(`shopify-http-${response.status}`);
      payload = await response.json();
    } catch (error) {
      if (error instanceof ShopError) throw error;
      throw shopUnavailable('shopify-fetch-failed');
    }
    if (payload?.errors?.length || !payload?.data) {
      throw shopUnavailable('shopify-graphql-failed');
    }
    return payload.data;
  }

  function checkoutUrl(value) {
    const url = httpsUrl(value);
    if (!url || url.port || (url.hostname !== storeDomain && url.hostname !== customCheckoutHost)) {
      throw shopUnavailable('invalid-checkout-url');
    }
    return url.href;
  }

  return { graphql, handle, checkoutUrl };
}

export function httpsUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

export function variantCanSell(variant, quantity = 1) {
  return variant.availableForSale === true &&
    variant.currentlyNotInStock === false &&
    Number.isSafeInteger(variant.quantityAvailable) &&
    variant.quantityAvailable >= quantity;
}

export const stockFields = `
  availableForSale
  currentlyNotInStock
  quantityAvailable
`;

export const pageFields = `
  pageInfo { hasNextPage endCursor }
`;

export async function* connectionPages(firstPage, nextPage, maximumPages) {
  let page = firstPage;
  const cursors = new Set();

  for (let index = 0; index < maximumPages; index += 1) {
    if (!Array.isArray(page?.nodes) || typeof page.pageInfo?.hasNextPage !== 'boolean') {
      throw shopUnavailable('invalid-shopify-page');
    }
    yield page.nodes;
    if (!page.pageInfo.hasNextPage) return;

    const cursor = page.pageInfo.endCursor;
    if (index + 1 === maximumPages || typeof cursor !== 'string' || !cursor || cursors.has(cursor)) {
      throw shopUnavailable('shopify-pagination-limit');
    }
    cursors.add(cursor);
    page = await nextPage(cursor);
  }
}
