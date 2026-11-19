import {
  connectionPages,
  httpsUrl,
  pageFields,
  shopErrorResponse,
  shopResponse,
  shopUnavailable,
  stockFields,
  storefront,
  variantCanSell,
} from './_shared/storefront.mjs';

const variantFields = `
  nodes {
    id
    title
    price { amount currencyCode }
    ${stockFields}
  }
  ${pageFields}
`;

const catalogQuery = `
  query ShopCatalog($handle: String!, $after: String) {
    collection(handle: $handle) {
      products(first: 25, after: $after) {
        nodes {
          id
          handle
          title
          description(truncateAt: 2400)
          featuredImage { url(transform: {maxWidth: 900}) altText }
          variants(first: 12) { ${variantFields} }
        }
        ${pageFields}
      }
    }
  }
`;

const variantsQuery = `
  query ShopProductVariants($productId: ID!, $after: String!) {
    node(id: $productId) {
      ... on Product {
        variants(first: 100, after: $after) { ${variantFields} }
      }
    }
  }
`;

const maximumProductsPages = 100;
const maximumVariantsPages = 25;

function readVariant(variant) {
  const price = variant?.price;
  if (typeof variant?.id !== 'string' || typeof variant.title !== 'string' ||
      typeof price?.amount !== 'string' || !/^\d+(?:\.\d+)?$/.test(price.amount) ||
      typeof price.currencyCode !== 'string' || !/^[A-Z]{3}$/.test(price.currencyCode)) {
    throw shopUnavailable('invalid-shopify-variant');
  }
  return {
    id: variant.id,
    title: variant.title,
    available: variantCanSell(variant),
    price: { amount: price.amount, currencyCode: price.currencyCode },
  };
}

async function readProduct(shop, product) {
  if (typeof product?.id !== 'string' || typeof product.handle !== 'string' ||
      typeof product.title !== 'string' || typeof product.description !== 'string') {
    throw shopUnavailable('invalid-shopify-product');
  }

  const readMoreVariants = async (after) => {
    const data = await shop.graphql(variantsQuery, { productId: product.id, after });
    return data.node?.variants;
  };
  const variants = [];
  for await (const page of connectionPages(product.variants, readMoreVariants, maximumVariantsPages)) {
    variants.push(...page.map(readVariant));
  }

  const imageUrl = httpsUrl(product.featuredImage?.url);
  const alt = product.featuredImage?.altText;
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    image: imageUrl ? { url: imageUrl.href, alt: typeof alt === 'string' && alt.trim() ? alt : product.title } : null,
    variants,
  };
}

export default async function shopCatalog(request, context) {
  if (request.method !== 'GET') {
    return shopResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  }

  try {
    const shop = storefront(context);
    const readProductsPage = async (after) => {
      const data = await shop.graphql(catalogQuery, { handle: shop.handle, after });
      if (!data.collection) throw shopUnavailable('shopify-collection-unavailable');
      return data.collection.products;
    };
    const products = [];
    const firstPage = await readProductsPage(null);
    for await (const page of connectionPages(firstPage, readProductsPage, maximumProductsPages)) {
      products.push(...await Promise.all(page.map((product) => readProduct(shop, product))));
    }
    return shopResponse({ products });
  } catch (error) {
    return shopErrorResponse(error);
  }
}
