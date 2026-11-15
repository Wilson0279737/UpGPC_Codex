import Hero from '../components/Hero';
import HomeGamingFeature from '../components/HomeGamingFeature';
import MapSection from '../components/MapSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <HomeGamingFeature />
      <MapSection collapsible />
    </>
  );
};

export default HomePage;
