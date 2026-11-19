import assert from 'node:assert/strict';
import test from 'node:test';
import shopCatalog from '../netlify/functions/shop-catalog.mjs';
import shopCheckout from '../netlify/functions/shop-checkout.mjs';

const variantId = 'gid://shopify/ProductVariant/123456';
const productId = 'gid://shopify/Product/12345';
const collectionId = 'gid://shopify/Collection/1234';
const shopifyUrl = 'https://test-example.myshopify.com';
const checkoutUrl = `${shopifyUrl}/cart/c/test-key`;
const netlifyUrl = 'https://upgradegamingpcs.com/.netlify/functions/';
const shopSettings = {
  SHOPIFY_STORE_DOMAIN: 'test-example.myshopify.com',
  SHOPIFY_STOREFRONT_PRIVATE_TOKEN: 'not-a-real-token',
  SHOPIFY_COLLECTION_HANDLE: 'online-shop',
  SHOPIFY_CHECKOUT_HOST: '',
};

function setShop(t, settings = {}) {
  for (const [key, value] of Object.entries({ ...shopSettings, ...settings })) {
    const original = process.env[key];
    process.env[key] = value;
    t.after(() => {
      if (original === undefined) delete process.env[key];
      else process.env[key] = original;
    });
  }
}

function fakeShop(t, operations) {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, `${shopifyUrl}/api/2026-10/graphql.json`);
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers['Shopify-Storefront-Private-Token'], 'not-a-real-token');
    const { query, variables } = JSON.parse(options.body);
    const [, operation] = query.match(/\b(?:query|mutation)\s+(\w+)/);
    calls.push(operation);
    assert.ok(operations[operation], `Unexpected Shopify operation: ${operation}`);
    return Response.json({ data: operations[operation](variables, options.headers) });
  });
  return calls;
}

function connection(nodes, cursor = null) {
  return { nodes, pageInfo: { hasNextPage: Boolean(cursor), endCursor: cursor } };
}

function catalogRequest() {
  return new Request(`${netlifyUrl}shop-catalog`);
}

function checkoutRequest(input = { variantId, quantity: 1 }) {
  return new Request(`${netlifyUrl}shop-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

function eligibleVariant(stock = {}, collections = connection([{ id: collectionId }])) {
  return {
    collection: { id: collectionId },
    node: {
      id: variantId,
      availableForSale: true,
      currentlyNotInStock: false,
      quantityAvailable: 1,
      product: { id: productId, collections },
      ...stock,
    },
  };
}

function cart({ url = checkoutUrl, quantity = 1, warnings = [], userErrors = [] } = {}) {
  return {
    cartCreate: {
      cart: { checkoutUrl: url, lines: { nodes: [{ quantity, merchandise: { id: variantId } }] } },
      warnings,
      userErrors,
    },
  };
}

test('catalog reads subsequent product and variant pages and only sells tracked stock', async (t) => {
  setShop(t);
  const item = {
    id: variantId,
    title: 'Default Title',
    price: { amount: '599.00', currencyCode: 'USD' },
    availableForSale: true,
    currentlyNotInStock: false,
    quantityAvailable: 1,
  };
  const product = {
    id: productId,
    handle: 'small-gaming-pc',
    title: 'Small gaming PC',
    description: 'Test system',
    featuredImage: { url: 'https://cdn.shopify.com/s/files/example.jpg', altText: null },
  };
  const operations = fakeShop(t, {
    ShopCatalog: ({ handle, after }, headers) => {
      assert.equal(handle, 'online-shop');
      assert.equal(headers['Shopify-Storefront-Buyer-IP'], '203.0.113.1');
      const products = after === null
        ? connection([{ ...product, variants: connection([item], 'next-variant-page') }], 'next-product-page')
        : connection([{
          ...product,
          id: 'gid://shopify/Product/12346',
          variants: connection([{ ...item, id: 'gid://shopify/ProductVariant/123458', quantityAvailable: null }]),
        }]);
      return { collection: { products } };
    },
    ShopProductVariants: (variables) => {
      assert.deepEqual(variables, { productId, after: 'next-variant-page' });
      return { node: { variants: connection([{
        ...item, id: 'gid://shopify/ProductVariant/123457', currentlyNotInStock: true, quantityAvailable: 0,
      }]) } };
    },
  });

  const response = await shopCatalog(catalogRequest(), { ip: '203.0.113.1' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const { products } = await response.json();
  assert.equal(products.length, 2);
  assert.deepEqual(products[0].variants.map(({ available }) => available), [true, false]);
  assert.equal(products[1].variants[0].available, false);
  assert.equal(products[0].image.alt, 'Small gaming PC');
  assert.equal('quantityAvailable' in products[0].variants[0], false);
  assert.deepEqual(operations, ['ShopCatalog', 'ShopProductVariants', 'ShopCatalog']);
});

test('checkout ignores browser prices and verifies collection membership through later pages', async (t) => {
  setShop(t);
  const operations = fakeShop(t, {
    ShopCheckoutEligibility: () => eligibleVariant({}, connection([{ id: 'another' }], 'next-collection-page')),
    ShopProductCollections: (variables) => {
      assert.deepEqual(variables, { productId, after: 'next-collection-page' });
      return { node: { collections: connection([{ id: collectionId }]) } };
    },
    ShopCheckout: (variables) => {
      assert.deepEqual(variables, { variantId, quantity: 1 });
      return cart();
    },
  });
  const response = await shopCheckout(checkoutRequest({ variantId, quantity: 1, price: '0.01' }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { checkoutUrl });
  assert.deepEqual(operations, ['ShopCheckoutEligibility', 'ShopProductCollections', 'ShopCheckout']);
});

test('checkout rejects variants outside the storefront collection before creating a cart', async (t) => {
  setShop(t);
  const operations = fakeShop(t, {
    ShopCheckoutEligibility: () => eligibleVariant({}, connection([{ id: 'another' }])),
  });
  const response = await shopCheckout(checkoutRequest());
  assert.equal(response.status, 404);
  assert.deepEqual(operations, ['ShopCheckoutEligibility']);
});

test('checkout rejects a requested quantity that exceeds tracked inventory', async (t) => {
  setShop(t);
  const operations = fakeShop(t, { ShopCheckoutEligibility: () => eligibleVariant() });
  const response = await shopCheckout(checkoutRequest({ variantId, quantity: 2 }));
  assert.equal(response.status, 409);
  assert.deepEqual(operations, ['ShopCheckoutEligibility']);
});

test('checkout suppresses provider details for cart warnings and an unexpected checkout host', async (t) => {
  setShop(t);
  t.mock.method(console, 'error', () => {});
  fakeShop(t, {
    ShopCheckoutEligibility: () => eligibleVariant(),
    ShopCheckout: () => cart({
      warnings: [{ code: 'MERCHANDISE_OUT_OF_STOCK', message: 'private-provider-details' }],
    }),
  });
  const warningResponse = await shopCheckout(checkoutRequest());
  assert.equal(warningResponse.status, 409);
  assert.deepEqual(await warningResponse.json(), { error: 'That quantity is no longer available.' });

  globalThis.fetch.mock.restore();
  fakeShop(t, {
    ShopCheckoutEligibility: () => eligibleVariant(),
    ShopCheckout: () => cart({ url: 'https://test-example.myshopify.com.example.test/cart/c/test-key' }),
  });
  const redirectResponse = await shopCheckout(checkoutRequest());
  assert.equal(redirectResponse.status, 502);
  assert.deepEqual(await redirectResponse.json(), { error: 'The online shop is temporarily unavailable.' });
});

test('unconfigured storefront returns maintenance status from both endpoints', async (t) => {
  setShop(t, { SHOPIFY_STOREFRONT_PRIVATE_TOKEN: '' });
  const catalog = await shopCatalog(catalogRequest());
  const checkout = await shopCheckout(checkoutRequest());
  assert.equal(catalog.status, 503);
  assert.equal(checkout.status, 503);
});
