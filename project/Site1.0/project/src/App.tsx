import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSnapshot from './components/ServicesSnapshot';
import MapSection from './components/MapSection';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ServicesSnapshot />
      <MapSection />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;