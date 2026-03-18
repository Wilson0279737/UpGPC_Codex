import React from 'react';

const MapSection = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-transparent to-purple-50/10 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/5"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Visit Our Showroom</h2>
          <p className="text-lg text-purple-100">
            Come test our gaming PCs in person at our Swartz Creek location
          </p>
        </div>
        
        <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-xl border border-purple-300/30 z-10">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2919.986974969934!2d-83.83504982347331!3d42.95747889714901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88246f304b3af7fb%3A0xae6166c538ca04ed!2sUpgrade%20Gaming%20PCs%20%2B%20Computer%20Repair!5e0!3m2!1sen!2sus!4v1751560682135!5m2!1sen!2sus" 
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Upgrade Gaming PCs Location"
          />
        </div>
        
        <div className="mt-6 text-center relative z-10">
          <p className="text-gray-600">
            <strong className="text-white">8048 Miller Rd Ste B, Swartz Creek, MI 48473</strong>
          </p>
          <p className="text-sm text-purple-200 mt-2">
            Free parking available • Easy highway access
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapSection;