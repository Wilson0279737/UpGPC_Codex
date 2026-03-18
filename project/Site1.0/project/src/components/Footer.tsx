import React from 'react';
import { Monitor, Facebook, Twitter, Instagram, Youtube, CreditCard, Shield, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-purple-900 to-gray-900 text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-gray-900"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Monitor className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold">Upgrade Gaming PCs</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted partner for premium gaming PCs and professional computer repair services in Swartz Creek. 
              Test before you buy, get real value from real people.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors">Repair Services</a></li>
              <li><a href="#products" className="text-gray-300 hover:text-white transition-colors">Gaming PCs</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gaming PCs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Hardware Repair</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Virus Removal</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Data Recovery</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Free Diagnostics</a></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Guarantees */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Methods
              </h4>
              <p className="text-gray-300 text-sm">
                Cash, Credit Cards, PayPal, Financing Available
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Warranty Info
              </h4>
              <p className="text-gray-300 text-sm">
                90-day repair guarantee, 1-year parts warranty
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Try Before You Buy
              </h4>
              <p className="text-gray-300 text-sm">
                Test gaming PCs in our Swartz Creek showroom
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Upgrade Gaming PCs. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Return Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;