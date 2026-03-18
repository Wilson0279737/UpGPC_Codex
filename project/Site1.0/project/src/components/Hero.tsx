import React from 'react';
import { ShoppingBag, Wrench, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Integrated Banner with Text Overlay */}
          <div className="relative w-full max-w-5xl mx-auto h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl shadow-2xl">
            {/* Banner Image */}
            <img 
              src="/Banner.png" 
              alt="Upgrade Gaming PCs LLC Banner" 
              className="w-full h-full object-cover object-center"
            />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            
            {/* Text Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full max-w-2xl px-8 sm:px-12 lg:px-16">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                  Play before you pay.
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mb-6 leading-relaxed">
                  Test out gaming PCs in-store, ask anything, and get real value from real people — right here in Swartz Creek.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-lg">
                    <ShoppingBag className="h-5 w-5" />
                    <span>View Products</span>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                    <Wrench className="h-5 w-5" />
                    <span>Repair Services</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Section Below Banner */}
          <div className="text-center mt-8">
            <div className="flex items-start space-x-3 bg-purple-800/30 border border-purple-400/30 rounded-lg p-6 max-w-2xl mx-auto">
              <MapPin className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-white">📍 8048 Miller Rd Ste B, Swartz Creek, MI 48473</p>
                <p className="text-purple-100 text-sm mt-1">Visit our showroom and test before you buy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;