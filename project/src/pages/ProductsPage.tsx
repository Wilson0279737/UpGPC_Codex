import ProductsPageHero from '../components/ProductsPageHero';
import ProductsShowcase from '../components/ProductsShowcase';

const ProductsPage = () => {
  return (
    <>
      <ProductsPageHero />
      <ProductsShowcase showHeader={false} />
    </>
  );
};

export default ProductsPage;
