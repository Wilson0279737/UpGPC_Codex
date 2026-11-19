import {
  connectionPages,
  pageFields,
  ShopError,
  shopErrorResponse,
  shopResponse,
  shopUnavailable,
  stockFields,
  stockUnavailable,
  storefront,
  variantCanSell,
} from './_shared/storefront.mjs';

const eligibilityQuery = `
  query ShopCheckoutEligibility($handle: String!, $variantId: ID!) {
    collection(handle: $handle) { id }
    node(id: $variantId) {
      ... on ProductVariant {
        id
        ${stockFields}
        product {
          id
          collections(first: 100) {
            nodes { id }
            ${pageFields}
          }
        }
      }
    }
  }
`;

const productCollectionsQuery = `
  query ShopProductCollections($productId: ID!, $after: String!) {
    node(id: $productId) {
      ... on Product {
        collections(first: 100, after: $after) {
          nodes { id }
          ${pageFields}
        }
      }
    }
  }
`;

const createCartMutation = `
  mutation ShopCheckout($variantId: ID!, $quantity: Int!) {
    cartCreate(input: {lines: [{merchandiseId: $variantId, quantity: $quantity}]}) {
      cart {
        checkoutUrl
        lines(first: 2) { nodes { quantity merchandise { ... on ProductVariant { id } } } }
      }
      warnings { code }
      userErrors { code }
    }
  }
`;

const variantIdPattern = /^gid:\/\/shopify\/ProductVariant\/[1-9]\d{0,29}$/;
const maximumCollectionsPages = 25;
const buyerErrorCodes = new Set([
  'INVALID_INCREMENT',
  'INVALID_MERCHANDISE_LINE',
  'MAXIMUM_EXCEEDED',
  'MERCHANDISE_NOT_APPLICABLE',
  'MINIMUM_NOT_MET',
  'MERCHANDISE_NOT_ENOUGH_STOCK',
  'MERCHANDISE_OUT_OF_STOCK',
  'PRODUCT_UNAVAILABLE_IN_BUYER_LOCATION',
]);

async function checkoutInput(request) {
  if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) {
    throw new ShopError(403, 'Checkout request denied.');
  }
  const invalidInput = new ShopError(400, 'Select an item and a quantity between 1 and 99.');
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw invalidInput;
  }

  let input;
  try {
    const body = await request.text();
    if (body.length > 512) throw invalidInput;
    input = JSON.parse(body);
  } catch {
    throw invalidInput;
  }
  const { variantId, quantity } = input ?? {};
  if (typeof variantId !== 'string' || !variantIdPattern.test(variantId) ||
      !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
    throw invalidInput;
  }
  return { variantId, quantity };
}

async function catalogVariant(shop, variantId) {
  const data = await shop.graphql(eligibilityQuery, { handle: shop.handle, variantId });
  const collectionId = data.collection?.id;
  if (typeof collectionId !== 'string') throw shopUnavailable('shopify-collection-unavailable');
  const variant = data.node;
  if (variant?.id !== variantId || !variant.product?.id) return null;

  const readMoreCollections = async (after) => {
    const result = await shop.graphql(productCollectionsQuery, { productId: variant.product.id, after });
    return result.node?.collections;
  };
  for await (const collections of connectionPages(
    variant.product.collections,
    readMoreCollections,
    maximumCollectionsPages,
  )) {
    if (collections.some((collection) => collection?.id === collectionId)) return variant;
  }
  return null;
}

async function checkoutCart(shop, input) {
  const data = await shop.graphql(createCartMutation, input);
  const result = data.cartCreate;
  if (!Array.isArray(result?.warnings) || !Array.isArray(result.userErrors)) {
    throw shopUnavailable('invalid-shopify-cart');
  }
  const issues = [...result.warnings, ...result.userErrors];
  if (issues.some((issue) => buyerErrorCodes.has(issue?.code))) throw stockUnavailable();
  if (issues.length) throw shopUnavailable('shopify-cart-rejected');

  const lines = result.cart?.lines?.nodes;
  if (!Array.isArray(lines)) throw shopUnavailable('invalid-shopify-cart-lines');
  if (lines.length !== 1 || lines[0]?.quantity !== input.quantity ||
      lines[0]?.merchandise?.id !== input.variantId) {
    throw stockUnavailable();
  }
  return shop.checkoutUrl(result.cart.checkoutUrl);
}

export default async function shopCheckout(request, context) {
  if (request.method !== 'POST') {
    return shopResponse({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }

  try {
    const input = await checkoutInput(request);
    const shop = storefront(context);
    const variant = await catalogVariant(shop, input.variantId);
    if (!variant) throw new ShopError(404, 'That item is no longer available.');
    if (!variantCanSell(variant, input.quantity)) throw stockUnavailable();
    return shopResponse({ checkoutUrl: await checkoutCart(shop, input) });
  } catch (error) {
    return shopErrorResponse(error);
  }
}
