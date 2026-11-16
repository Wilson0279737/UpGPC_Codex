import catalog from '../content/catalog.generated.json';
import soldCatalog from '../content/sold.generated.json';

export type Product = {
  title: string;
  status: 'draft' | 'available' | 'reserved' | 'sold';
  formFactor?: 'desktop' | 'laptop';
  price?: number | null;
  description: string;
  image?: string;
  imageAlt?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  marketplaceUrl?: string;
  marketplaceVerifiedOn?: string;
};

export const inventory = catalog as (Product & { id: string })[];
export const soldInventory = soldCatalog as (Product & { id: string })[];

export type ListedProduct = Product & { id: string };
const wholePrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const centsPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatPcPrice = (price?: number | null) => typeof price === 'number'
  ? (Number.isInteger(price) ? wholePrice : centsPrice).format(price)
  : 'Call for pricing';
