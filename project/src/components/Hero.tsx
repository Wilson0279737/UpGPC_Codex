import { siteConfig, siteContent } from '../config/site';
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
        <div className="hero-banner relative mx-auto min-h-[22rem] w-full max-w-5xl overflow-hidden rounded-[1.4rem] shadow-2xl sm:min-h-80 sm:rounded-[1.75rem] lg:min-h-96">
          <img
            src={siteContent.home.image}
            alt={siteContent.home.imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50"></div>

          <div className="relative flex min-h-[22rem] items-center py-8 sm:min-h-80 lg:min-h-96">
            <div className="w-full max-w-2xl px-5 sm:px-10 lg:px-16">
              <h1 className="text-[2rem] font-bold leading-[1.05] text-white sm:text-4xl lg:text-5xl">{siteContent.home.title}</h1>
              <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-gray-200 sm:mt-4 sm:text-xl">
                {siteContent.home.description}
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
                <p className="text-base font-semibold text-white sm:text-lg">{siteConfig.address}</p>
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
