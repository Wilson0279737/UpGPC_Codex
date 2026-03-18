import ServicesPageHero from '../components/ServicesPageHero';
import ServicesSnapshot from '../components/ServicesSnapshot';

const ServicesPage = () => {
  return (
    <>
      <ServicesPageHero />
      <ServicesSnapshot showHeader={false} />
    </>
  );
};

export default ServicesPage;
