import { MapPin, ShoppingBag, Wrench } from 'lucide-react';
import ActionLink from './ui/ActionLink';

type HeroProps = {
  compactTop?: boolean;
  showAddressCard?: boolean;
};

const Hero = ({ compactTop = false, showAddressCard = true }: HeroProps) => {
  return (
    <section
      id="home"
      className={`relative overflow-hidden pb-14 sm:pb-20 ${compactTop ? 'pt-5 sm:pt-8' : 'pt-24 sm:pt-28'}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="hero-banner relative mx-auto h-[15.5rem] w-full max-w-5xl overflow-hidden rounded-[1.4rem] shadow-2xl sm:h-80 sm:rounded-[1.75rem] lg:h-96">
          <img
            src="/optimized/home-hero.jpg"
            alt="Gaming PC showroom interior at Upgrade Gaming PCs with gaming computers on display"
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-2xl px-5 sm:px-10 lg:px-16">
              <h1 className="text-[2rem] font-bold leading-[1.05] text-white sm:text-4xl lg:text-5xl">Play before you pay.</h1>
              <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-gray-200 sm:mt-4 sm:text-xl">
                Test out gaming PCs in-store, ask anything, and get real value from real people right here in Swartz Creek.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ActionLink to="/products" className="w-full sm:w-auto">
                  <ShoppingBag className="h-5 w-5" />
                  <span>View Products</span>
                </ActionLink>
                <ActionLink to="/services" variant="secondary" className="w-full sm:w-auto">
                  <Wrench className="h-5 w-5" />
                  <span>Repair Services</span>
                </ActionLink>
              </div>
            </div>
          </div>
        </div>

        {showAddressCard && (
          <div className="hero-address mx-auto mt-6 max-w-2xl rounded-[1.35rem] border border-purple-300/30 bg-purple-800/30 p-5 sm:mt-8 sm:p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-purple-300" />
              <div>
                <p className="text-base font-semibold text-white sm:text-lg">8048 Miller Rd Ste B, Swartz Creek, MI 48473</p>
                <p className="mt-1 text-sm text-purple-100">Visit our showroom and test before you buy.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
