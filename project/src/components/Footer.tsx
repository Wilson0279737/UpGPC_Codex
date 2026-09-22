import ResponsiveImage from './ui/ResponsiveImage';
import { Clock, CreditCard, ExternalLink, Facebook, Mail, MapPin, Phone, Shield } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import { Link } from 'react-router-dom';

const marketplaceUrl = 'https://www.facebook.com/marketplace/profile/100086538835294/';
const facebookUrl = 'https://www.facebook.com/profile.php?id=61565010745151';
const googleMapsUrl =
  'https://www.google.com/maps/place/Upgrade+Gaming+PCs+%2B+Computer+Repair/@42.957475,-83.8324749,17z/data=!3m1!4b1!4m6!3m5!1s0x88246f304b3af7fb:0xae6166c538ca04ed!8m2!3d42.957475!4d-83.8324749!16s%2Fg%2F11lw8tygg_?entry=ttu';

const assurances = [
  {
    title: 'Flexible payment options',
    description: 'Cash, credit cards, PayPal, and financing available',
    icon: CreditCard,
  },
  {
    title: '90 day free warranty',
    description: 'Systems and repairs include a 90 day free warranty from the local shop.',
    icon: Shield,
  },
  {
    title: 'Try before you buy',
    description: 'Test gaming PCs in our Swartz Creek showroom',
    icon: Clock,
  },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-purple-900 to-gray-900 pt-14 text-white sm:pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-gray-900"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative z-10 grid gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:items-start">
          <div>
            <div className="inline-flex rounded-[1.35rem] border border-white/15 bg-white/95 p-3 shadow-[0_18px_34px_rgba(6,5,23,0.22)] sm:p-4">
              <ResponsiveImage
                src="/ChatGPT Image Jun 9, 2025, 12_57_49 PM.png"
                sizes="(min-width: 640px) 180px, 150px"
                loading="lazy"
                decoding="async"
                alt="Upgrade Gaming PCs"
                className="h-12 w-auto object-contain sm:h-14"
              />
            </div>
            <p className="mt-4 max-w-md text-gray-300">
              Your trusted partner for premium gaming PCs and professional computer repair services in Swartz Creek.
              Test before you buy, get real value from real people.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ActionLink to="/contact" className="w-full sm:w-auto">
                Contact the shop
              </ActionLink>
              <ActionLink href={marketplaceUrl} external variant="secondary" className="w-full sm:w-auto">
                <span>Marketplace Profile</span>
                <ExternalLink className="h-5 w-5" />
              </ActionLink>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Contact and Social</h2>
            <div className="mt-4 space-y-3 text-gray-300">
              <a href="tel:+18104413020" className="flex min-h-11 items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-purple-300" />
                <span>(810) 441-3020</span>
              </a>
              <a
                href="mailto:brandonwilson0279737@gmail.com"
                className="flex min-h-11 items-start gap-3 break-all transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />
                <span>brandonwilson0279737@gmail.com</span>
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-start gap-3 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />
                <span>8048 Miller Rd Ste B, Swartz Creek, MI 48473</span>
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 transition-colors hover:text-white"
              >
                <Facebook className="h-4 w-4 text-purple-300" />
                <span>Follow on Facebook</span>
              </a>
            </div>
            <nav aria-label="Footer navigation" className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
              <Link className="inline-flex min-h-11 items-center text-purple-100 hover:underline" to="/services">Services</Link>
              <Link className="inline-flex min-h-11 items-center text-purple-100 hover:underline" to="/products">Gaming PCs</Link>
              <Link className="inline-flex min-h-11 items-center text-purple-100 hover:underline" to="/about">About us</Link>
              <Link className="inline-flex min-h-11 items-center text-purple-100 hover:underline" to="/contact">Contact</Link>
            </nav>
          </div>
        </div>

        <div className="reveal reveal-delay-1 relative z-10 mt-10 grid gap-6 border-t border-gray-800 pt-8 md:mt-12 md:grid-cols-3 md:gap-8">
          {assurances.map((assurance) => {
            const Icon = assurance.icon;

            return (
              <div key={assurance.title}>
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Icon className="h-5 w-5 text-purple-300" />
                  <span>{assurance.title}</span>
                </h3>
                <p className="mt-2 text-sm text-gray-300">{assurance.description}</p>
              </div>
            );
          })}
        </div>

        <div className="reveal reveal-delay-2 relative z-10 mt-6 border-t border-gray-800 py-8 text-sm text-gray-400 sm:mt-8">
          Copyright {new Date().getFullYear()} Upgrade Gaming PCs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
