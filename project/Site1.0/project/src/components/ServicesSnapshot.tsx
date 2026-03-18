import React from 'react';
import { Wrench, Monitor } from 'lucide-react';

const ServicesSnapshot = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-purple-50/10 to-transparent relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          {/* Repair Services */}
          <div className="bg-purple-800/30 border border-purple-400/30 rounded-xl p-8 hover:bg-purple-800/40 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <Wrench className="h-8 w-8 text-purple-800" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Computer Repair & Trade-In
            </h3>
            <p className="text-purple-100 mb-6 leading-relaxed">
              Expert repairs with a no fix, no pay guarantee. We also offer trade-in options to help you upgrade affordably.
            </p>
            <a 
              href="/pages/repair.html"
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto"
            >
              View Repair Services
            </a>
          </div>

          {/* Gaming PCs */}
          <div className="bg-purple-800/30 border border-purple-400/30 rounded-xl p-8 hover:bg-purple-800/40 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <Monitor className="h-8 w-8 text-purple-800" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Refurbished & Custom Gaming PCs
            </h3>
            <p className="text-purple-100 mb-6 leading-relaxed">
              Hand-built and tested for performance. Shop trusted, affordable systems backed by warranty.
            </p>
            <a 
              href="/pages/products.html"
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto"
            >
              View Gaming PCs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSnapshot;