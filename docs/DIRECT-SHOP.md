# Direct shop setup

`/shop` reads a Shopify collection at runtime. Shopify creates the checkout with current variant pricing and stock and handles payment, tax, shipping and order confirmation. Each website checkout starts with one item. The existing PC catalog and saved-PC accounts are available at their usual routes.

## Connect eBay and Shopify

1. Confirm the eBay seller account and the Shopify store that will receive website orders. Set up Shopify payments, shipping or pickup, tax, return policy, and order notifications before accepting payments.
2. Choose a Shopify connector that supports importing existing eBay listings, automatically importing future eBay listings, and syncing inventory in both directions. SyncBit Core lists these features and a $9.99 USD monthly subscription. Shopify subscription and payment processing costs are separate. Shopify Marketplace Connect can link existing listings and sync inventory. With Marketplace Connect, listings created on eBay need a separate import into Shopify. [SyncBit setup guide](https://syncbitapp.com/blog/how-to-import-ebay-listings-into-shopify) · [SyncBit pricing](https://apps.shopify.com/ebay-connect-neutroware-1) · [Shopify pricing](https://www.shopify.com/pricing) · [Marketplace Connect linking](https://help.shopify.com/en/manual/online-sales-channels/marketplaces/marketplace-connect/products/link-existing)
3. Connect the accounts using the chosen app's authorization screens. Start with a single representative fixed-price listing. Make sure listings and variants have unique SKUs, inventory is tracked at the proper Shopify location, and **Continue selling when out of stock** is disabled. Use merchant-owned photos and product copy. Set a fixed website price for any auction inventory intended for website sale.
4. In Shopify, add the Headless sales channel and create a storefront. Enable the Storefront API scopes `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_read_checkouts`, and `unauthenticated_write_checkouts`. Create an automated collection for products intended for direct sale and publish it to Headless. Set up the connector or a Shopify Flow rule so newly imported, eligible items join the collection and publish to Headless automatically. Base the rule on a connector-provided tag or another reliable condition verified on a test import. [Headless setup](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started) · [Shopify Flow publish action](https://help.shopify.com/en/manual/shopify-flow/reference/actions/publish-product)
5. Verify one item through the full checklist below before running the bulk import. Reconcile the import totals against eBay Seller Hub, including variations, ended listings and listings that need a website price or missing details. Keep eBay-originated transactions on eBay. [eBay off-platform transactions policy](https://www.ebay.com/help/policies/payment-policies/offers-buy-sell-outside-ebay-policy?id=4272)

## Configure Netlify

Set values in Netlify for the matching deploy context. Scope `SHOPIFY_*` values to Functions and use a separate Shopify test store for a Deploy Preview. Use only the storefront navigation flag in the build environment. [Netlify environment variable scopes](https://docs.netlify.com/build/environment-variables/overview/)

| Key | Value |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Shopify store's `your-store.myshopify.com` hostname |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | Headless storefront private access token, stored as a Netlify secret |
| `SHOPIFY_COLLECTION_HANDLE` | Exact handle of the Shopify collection published to Headless |
| `SHOPIFY_CHECKOUT_HOST` | Optional exact Shopify checkout hostname when Shopify uses a custom domain |
| `VITE_DIRECT_SHOP` | Set to `true` to link to `/shop` from storefront navigation and allow indexing |

Leave production credentials and the navigation flag unset until the owner approves the release. Keep tokens out of GitHub, public content, and browser-facing `VITE_*` settings. For local development with a test store, use Netlify Dev to start the Vite app and functions. Without Shopify settings, `/shop` displays an unavailable state.

## Test before taking orders

- Open `/shop` on desktop and mobile and refresh the route directly. Confirm that multi-variant products show the correct option, price, photo and stock status and that unpublished products stay hidden.
- Create a future eBay fixed-price listing in the chosen connector's supported test setup. Verify that its Shopify product and all variants import, publish to Headless, and appear on the site without manual edits. Change its price and quantity, then end or relist it and verify the result on both channels.
- Use test payments to place a website order for a one-unit product. Verify the Shopify order, order confirmation, quantity decrement, and subsequent eBay availability. Test a sale in the other direction, and verify cancellation and restock behavior. Cross-channel sync takes time. Measure the delay and test the last-unit race before offering unique inventory on both channels.
- Review checkout shipping, tax, order confirmation, contact details, returns, and currency with test orders for the intended destinations. After release approval, verify the production catalog and checkout handoff with the production settings.
