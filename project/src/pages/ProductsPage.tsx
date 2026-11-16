import ProductInventory from '../components/ProductInventory';
import ProductsPageHero from '../components/ProductsPageHero';
import ProductsShowcase from '../components/ProductsShowcase';
import SoldProductInventory from '../components/SoldProductInventory';

const ProductsPage = () => {
  return (
    <>
      <ProductsPageHero />
      <ProductInventory />
      <SoldProductInventory />
      <ProductsShowcase showHeader={false} />
    </>
  );
};

export default ProductsPage;
