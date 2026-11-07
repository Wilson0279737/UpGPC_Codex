import catalog from '../content/catalog.generated.json';

export type Product = {
  title: string;
  status: 'draft' | 'available' | 'reserved' | 'sold';
  price?: number | null;
  description: string;
  image?: string;
  imageAlt?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
};

export const inventory = catalog as (Product & { id: string })[];
