import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-purple-50/10 to-purple-100/20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-purple-900/20"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-xl text-purple-100">
            Ready to upgrade your gaming setup or need PC repair? Contact us today!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 relative z-10">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-purple-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <a 
                    href="tel:8104413020"
                    className="text-purple-300 hover:text-purple-100 hover:underline transition-colors"
                  >
                    (810) 441-3020
                  </a>
                  <p className="text-sm text-purple-200">Free estimates over the phone</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-purple-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <a 
                    href="mailto:brandonwilson0279737@gmail.com"
                    className="text-purple-300 hover:text-purple-100 hover:underline transition-colors break-all"
                  >
                    brandonwilson0279737@gmail.com
                  </a>
                  <p className="text-sm text-purple-200">Fast response!</p>
                </div>
              </div>
              
              <a 
                href="https://www.google.com/maps/place/Upgrade+Gaming+PCs+%2B+Computer+Repair/@42.957475,-83.8324749,17z/data=!3m1!4b1!4m6!3m5!1s0x88246f304b3af7fb:0xae6166c538ca04ed!8m2!3d42.957475!4d-83.8324749!16s%2Fg%2F11lw8tygg_?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 hover:bg-purple-800/30 p-3 rounded-lg transition-colors group"
              >
                <MapPin className="h-6 w-6 text-purple-400 mt-1 group-hover:text-purple-300" />
                <div>
                  <h4 className="font-semibold text-white group-hover:text-purple-100">Location and Hours</h4>
                  <p className="text-purple-300 group-hover:text-purple-100 group-hover:underline">
                    8048 Miller Rd Ste B<br />Swartz Creek, MI 48473
                  </p>
                  <p className="text-sm text-purple-200 mt-1">Visit our showroom to test gaming PCs</p>
                </div>
              </a>
            </div>

            <div className="bg-purple-800/30 border border-purple-400/30 rounded-lg p-6">
              <h4 className="font-semibold text-purple-200 mb-2">Try Before You Buy</h4>
              <p className="text-purple-100 text-sm">
                Visit our Swartz Creek showroom to test gaming PCs hands-on. 
                Experience the performance difference before making your decision.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-purple-200/30">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us about your gaming needs or describe your computer issue..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;