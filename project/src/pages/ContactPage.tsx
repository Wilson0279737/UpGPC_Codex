import ContactPageHero from '../components/ContactPageHero';
import Contact from '../components/Contact';
import MapSection from '../components/MapSection';

const ContactPage = () => {
  return (
    <>
      <ContactPageHero />
      <Contact showHeader={false} />
      <MapSection />
    </>
  );
};

export default ContactPage;
