import Hero from '../components/Hero';
import HomeGamingFeature from '../components/HomeGamingFeature';
import MapSection from '../components/MapSection';

const HomePage = () => {
  return (
    <>
      <MapSection collapsible priorityTop />
      <HomeGamingFeature />
      <Hero compactTop showAddressCard={false} />
    </>
  );
};

export default HomePage;
