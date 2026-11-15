import ProductInventory from '../components/ProductInventory';
import ProductsPageHero from '../components/ProductsPageHero';
import ProductsShowcase from '../components/ProductsShowcase';

const ProductsPage = () => {
  return (
    <>
      <ProductsPageHero />
      <ProductInventory />
      <ProductsShowcase showHeader={false} />
    </>
  );
};

export default ProductsPage;
